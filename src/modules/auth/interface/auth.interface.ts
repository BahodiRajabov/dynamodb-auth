export interface ISignup {
  full_name: string;
  email: string;
  password: string;
}

export interface ISignin {
  email: string;
  password: string;
}

export interface IDecodedToken {
  tokenId: string;
  userId: string;
}