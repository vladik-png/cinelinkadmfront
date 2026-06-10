export interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'banned' | 'pending';
  registrationDate: string;
  lastActivity: string;
}