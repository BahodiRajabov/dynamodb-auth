import validate from '../shared/middlewares/validate';
import { Router } from 'express';
import { Routes } from '../shared/interface/routes.interface';
import AuthController from './auth.controller';
import { ConfirmOtpDTO, SigninDTO, SignupDTO } from './dto/auth.dto';

export default class AuthRoute implements Routes {
  public path = '/auth/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validate(SignupDTO, "body"), this.authController.signUp);
    this.router.post(`${this.path}signin`, validate(SigninDTO, "body"), this.authController.signIn);
    this.router.post(`${this.path}resendcode`, this.authController.resendCode);
    this.router.post(`${this.path}verify`, validate(ConfirmOtpDTO, "body"), this.authController.confirmOtp);
  }
}
