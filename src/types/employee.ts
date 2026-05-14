export interface EmployeeData {
    employee_id: number;
    first_name: string;
    last_name: string;
    avatar_url: string;
    location: string;
    created_at: string;
    bg_img_url?: string;
}

export type SortKey = 'id' | 'name' | 'location';
export type SortDirection = 'asc' | 'desc';