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