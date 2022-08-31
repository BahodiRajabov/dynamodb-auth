import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import { ConfirmOtpDTO, SigninDTO, SignupDTO } from './dto/auth.dto';
import requestIp from 'request-ip';
import { v4 } from 'uuid';
import { ISignin, ISignup } from './interface/auth.interface';

class AuthController {
  private authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ISignup = req.body;

      const sentOtp = await this.authService.signup(userData);

      res.status(201).json({ success: true, data: {}, message: `Verification was sent to ${sentOtp.email}` });
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: ISignin = req.body;

      const remoteIp = requestIp.getClientIp(req);
      const device = req.headers['user-agent'];

      const token = await this.authService
        .signin({ email: userData.email, password: userData.password }, remoteIp, device);

      res.status(201).json({ success: true, data: { token }, message: 'Login success' });
    } catch (error) {
      next(error);
    }
  };

  public resendCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const { body } = req
      const sentOtp = await this.authService.resendOtp(body.email);

      res.status(201).json({ success: true, data: {}, message: `Email was resent successfuly to ${sentOtp.email}` });
    } catch (error) {
      next(error);
    }
  };

  public confirmOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const { body } = req

      const otpData: ConfirmOtpDTO = req.body;

      const remoteIp = requestIp.getClientIp(req);
      const device = req.headers['user-agent'];

      const token = await this.authService.confirmOtp({ code: otpData.code, email: body.email }, remoteIp, device);

      res.status(201).json({ success: true, data: { token }, message: 'Successfull verification' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
