export interface SystemMetricData {
    time: string;
    cpu: number;
    temp: number;
    ram: number;
    disk: number;
    ping: number;
    packet_loss: number;
}

export type ViewMode = 'combined' | 'split';