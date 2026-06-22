export interface PaginatedResponse<T> {
    count?: number;
    next?: string | null;
    previous?: string | null;
    results: T[] | { data: T[] };
    data?: T[];
}

export interface AwsTag {
    Key: string;
    Value: string;
}

export interface AwsInstanceApiData {
    InstanceId: string;
    Tags?: AwsTag[];
    State?: { Name: string };
    PublicIpAddress?: string;
    [key: string]: unknown;
}

export interface AwsApiResponse {
    instances: AwsInstanceApiData[];
}

export interface AgentApiData {
    instance_id: string;
    device_name?: string;
    public_ip: string;
    cpu_usage?: number;
    cpu?: number;
    cpu_temp?: number;
    ping?: number;
    packet_loss?: string | number;
    ram?: number;
    disk: number;
    location: string;
    time: string;
}

export interface AgentApiResponse {
    data: Record<string, AgentApiData> | AgentApiData[];
}
