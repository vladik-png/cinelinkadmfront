export interface ServerAlert {
    id: number;
    created_at: string;
    server_id: string;
    type: string;
    message: string;
    resolved: boolean;
}

export interface ServerLog {
    id: number;
    created_at: string;
    server_id: string;
    component: string;
    action: string;
    status: string;
    details: string;
}

export interface UserReport {
    report_id: number;
    user_id: number;
    from_user_id: number;
    topic: string;
    status: string;
    created_at: string;
}