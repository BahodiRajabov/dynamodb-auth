import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import {
  ISignin,
  ISignup,
} from '../interface/auth.interface';
import { IConfirmOtp } from '../interface/otps.interface';

export class SignupDTO implements ISignup {
  @IsDefined()
  @IsString()
  @MinLength(5)
  full_name: string;

  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

}

export class SigninDTO implements ISignin {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}


export class ConfirmOtpDTO implements IConfirmOtp {
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  code: number;

}