export interface UserData {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  avatar_url: string;
  is_active: boolean;
  bio?: string;
  followers?: number;
  followings?: number;
  bg_img_url?: string;
}

export type SortKey = 'id' | 'name' | 'email' | 'date' | 'status';
export type SortDirection = 'asc' | 'desc';