export type WSMessage = {
    type: string;
    data: any;
};

type WSCallback = (data: any) => void;

class WSService {
    private ws: WebSocket | null = null;
    private listeners: Map<string, WSCallback[]> = new Map();
    private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    private isConnected: boolean = false;

    connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const token = localStorage.getItem('admin_token');
        const wsUrl = `ws://localhost:8081/ws/live?token=${token}`; // Assuming backend runs on 8081
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Connected to Live WS');
            this.isConnected = true;
            if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

            // Send auth
            const currentEmployeeIdStr = localStorage.getItem('employee_id');
            if (currentEmployeeIdStr) {
                this.send('auth', { employee_id: parseInt(currentEmployeeIdStr, 10) });
            }
        };

        this.ws.onmessage = (event) => {
            try {
                const message: WSMessage = JSON.parse(event.data);
                const callbacks = this.listeners.get(message.type);
                if (callbacks) {
                    callbacks.forEach(cb => cb(message.data));
                }
            } catch (error) {
                console.error('Failed to parse WS message', error);
            }
        };

        this.ws.onclose = () => {
            console.log('Disconnected from Live WS');
            this.isConnected = false;
            this.ws = null;
            this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
        };

        this.ws.onerror = (error) => {
            console.error('Live WS error', error);
            this.ws?.close();
        };
    }

    send(type: string, data: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, data }));
        }
    }

    on(type: string, callback: WSCallback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)?.push(callback);
    }

    off(type: string, callback: WSCallback) {
        const callbacks = this.listeners.get(type);
        if (callbacks) {
            this.listeners.set(type, callbacks.filter(cb => cb !== callback));
        }
    }

    disconnect() {
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const liveWs = new WSService();
