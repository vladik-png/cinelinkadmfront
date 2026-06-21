export interface EmployeeData {
    employee_id: number;
    user_id?: number;
    first_name: string;
    last_name: string;
    avatar_url: string;
    location: string;
    created_at: string;
    bg_img_url?: string;
    phone?: string;
    email?: string;
    department?: string;
    password?: string;
    _react_key?: string | number;
}

export type SortKey = 'id' | 'name' | 'location';
export type SortDirection = 'asc' | 'desc';