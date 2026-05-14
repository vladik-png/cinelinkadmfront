export interface EC2Instance {
  InstanceId: string;
  State: {
    Name: 'running' | 'stopped' | 'pending' | 'stopping' | 'terminated';
  };
  InstanceType: string;
}

export interface AWSReservation {
  Instances: EC2Instance[];
}

export interface InstanceMetrics {
  instance_id: string;
  cpu: string;
  ram: string;
  disk: string;
  ping: number;
  packet_loss: string;
  time: string;
}

export interface SystemMetricsMap {
  [key: string]: InstanceMetrics;
}

export interface UnifiedServer {
  id: string;
  name: string;
  type: 'AWS' | 'WINDOWS' | 'KAMATERA';
  state: string;
  ip?: string;
  cpu?: number | string;
  temp?: number | string;
  ram?: number | string;
  ping?: number | string;
  packetLoss?: number;
  disk?: string;
  location?: string;
  uptime?: string;
  rawAwsData?: any;
}