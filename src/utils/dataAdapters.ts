import { UnifiedServer } from '../types/infrastructure';
import { EmployeeData } from '../types/employee';
import { UserData } from '../types/user';
import { AwsApiResponse, AgentApiResponse, PaginatedResponse } from '../types/api';

export const mapAwsInstancesToUnified = (awsData: AwsApiResponse): UnifiedServer[] => {
    if (!awsData || !awsData.instances) return [];
    return awsData.instances.map((inst) => {
        const nameTag = inst.Tags?.find((t: any) => t.Key === 'Name');
        const name = (inst.Name as string) || (nameTag ? nameTag.Value : `Node ${inst.InstanceId?.substring(0,6) || ''}`);
        
        let type: 'AWS' | 'DIGITAL_OCEAN' | 'WINDOWS' | 'KAMATERA' = 'AWS';
        if (inst.Provider === 'DigitalOcean') type = 'DIGITAL_OCEAN';
        else if (inst.Provider === 'Local') type = 'WINDOWS';
        
        return {
            id: inst.InstanceId,
            name: name || 'Unnamed Node',
            type: type,
            state: ((inst.State as any)?.Name || inst.State || 'unknown') as string,
            ip: (inst.PublicIpAddress || inst.IpAddress || 'No Public IP') as string,
            rawAwsData: inst
        };
    });
};

export const mapAgentDataToUnified = (
    agentRes: AgentApiResponse, 
    fallbackName: string, 
    type: 'WINDOWS' | 'KAMATERA' | 'DIGITAL_OCEAN'
): UnifiedServer[] => {
    if (!agentRes || !agentRes.data) return [];
    
    const dataValues = Array.isArray(agentRes.data) ? agentRes.data : Object.values(agentRes.data);

    return dataValues.map((s) => ({
        id: type === 'WINDOWS' ? `win-${s.instance_id}` : type === 'KAMATERA' ? `kam-${s.instance_id}` : `do-${s.instance_id}`,
        name: s.device_name || fallbackName,
        type,
        state: 'running',
        ip: s.public_ip,
        cpu: s.cpu_usage ?? s.cpu ?? 0,
        temp: s.cpu_temp ?? 0,
        ping: s.ping ?? 0,
        packetLoss: typeof s.packet_loss === 'string' ? parseFloat(s.packet_loss) : (s.packet_loss || 0),
        ram: s.ram ?? 0,
        disk: String(s.disk || 0),
        location: s.location,
        uptime: s.time
    }));
};

export const mapDigitalOceanDropletsToUnified = (data: any): UnifiedServer[] => {
    if (!data) return [];
    const droplets = Array.isArray(data) ? data : (data.droplets || []);
    return droplets.map((d: any) => {
        const pubNet = d.networks?.v4?.find((n: any) => n.type === 'public');
        return {
            id: `do-${String(d.id)}`,
            name: d.name || 'Unnamed Droplet',
            type: 'DIGITAL_OCEAN',
            state: d.status === 'active' ? 'running' : 'stopped',
            ip: pubNet ? pubNet.ip_address : 'No IP',
            ram: d.memory || 0,
            disk: String(d.disk || 0),
            location: d.region?.slug || 'unknown',
            rawAwsData: d
        };
    });
};

export const parseEmployeeResponse = (responseData: unknown): EmployeeData[] => {
    let fetchedList: EmployeeData[] = [];
    
    if (responseData && typeof responseData === 'object') {
        const data = responseData as any;
        if (data.results && Array.isArray(data.results)) {
            fetchedList = data.results;
        } else if (data.results?.data && Array.isArray(data.results.data)) {
            fetchedList = data.results.data;
        } else if (Array.isArray(data)) {
            fetchedList = data;
        } else if (data.data && Array.isArray(data.data)) {
            fetchedList = data.data;
        }
    }
    
    return fetchedList.map((item, index) => {
        const mappedId = item.employee_id || (item as any).id;
        return {
            ...item,
            employee_id: mappedId,
            _react_key: mappedId || `fallback-${index}`
        };
    });
};

export const parseUserResponse = (responseData: unknown): UserData[] => {
    let fetchedList: UserData[] = [];
    
    if (responseData && typeof responseData === 'object') {
        const data = responseData as any;
        if (data.results?.data && Array.isArray(data.results.data)) {
            fetchedList = data.results.data;
        } else if (data.results && Array.isArray(data.results)) {
            fetchedList = data.results;
        } else if (Array.isArray(data)) {
            fetchedList = data;
        } else if (data.data && Array.isArray(data.data)) {
            fetchedList = data.data;
        }
    }
    
    return fetchedList;
};
