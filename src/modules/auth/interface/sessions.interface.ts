export interface ICreateUserSession {
  device: string;
  remoteIp: string;
  tokenId: string;
  userId:string;
}

export interface IUserSession {
  session_id: string;
  user_id: string;
  device: string;
  remoteIp: string;
  token_id: string;
  is_logged_out: string;
  logged_out_at: Date;
  created_at: Date;
}








