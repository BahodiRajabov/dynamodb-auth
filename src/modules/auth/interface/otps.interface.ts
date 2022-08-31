export interface ICreateOtp {
  code: string;
  userId: string;
}

export interface IConfirmOtp {
  code: number;
  email: string;
}

export interface IOtp {
  otp_id: string;
  user_id: string;
  code: string;
  created_at: Date;
  is_active: string;
}