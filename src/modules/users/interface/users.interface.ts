export interface ICreateUser {
  full_name: string;
  email: string;
  password: string;
}

export interface IUser {
  user_id: string;
  created_at: Date;
  full_name: string;
  email: string;
  password: string;
  is_verified: boolean;
}
export interface IUserIdParam {
  userId: string;
}