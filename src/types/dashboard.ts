export interface WeatherInfo {
    temp: string | number;
    resolvedPlace: string;
}

export interface DashboardStats {
    users: number;
    activeNodes: number;
}

export interface SystemMetricsSummary {
    cpu: number;
    ram: number;
    disk: number;
    ping: number;
}

export interface RecentUser {
    user_id: number;
    first_name: string;
    last_name: string;
    username: string;
    avatar_url: string;
}