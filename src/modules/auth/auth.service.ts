import { compareHash, generateHash } from '../../modules/shared/utils/bcrypt';
import { generateRandomDigit, getCurrentDate, getExpireDate } from '../../modules/shared/utils/utils';
import sendMail from '../shared/utils/sendEmail';
import { sign } from "jsonwebtoken";
import { ISignin, ISignup } from './interface/auth.interface';
import { IUser } from '../users/interface/users.interface';
import { IConfirmOtp } from './interface/otps.interface';
import { ICreateUserSession } from './interface/sessions.interface';
import UsersService from '../users/users.service';
import ErrorResponse from '../../modules/shared/utils/errorResponse';
import { server } from '../../config/conf';
import OtpsDAO from './dao/otp.dao';
import SessionDAO from './dao/sessions.dao';
import { v4 } from 'uuid';

class AuthService {
   private usersService = new UsersService();
   private otpsDao = new OtpsDAO();
   private sessionsDao = new SessionDAO();
   private OtpDigitsCount = 6;


   async signup({ password, email, full_name }: ISignup) {

      const foundUser = await this.usersService.getByEmail(email)
      console.log("FoundUser", foundUser);

      if (foundUser) {
         throw new ErrorResponse(400, "This email already exists")
      }

      const generatedHash = await generateHash(password)

      const user = await this.usersService.create({ email, full_name, password: generatedHash })

      const otp = await this.sendOtp(user);

      return otp

   }

   async signin({ password, email }: ISignin, device: string, remoteIp: string) {

      const foundUser = await this.usersService.getByEmail(email)
      console.log(foundUser);

      if (!foundUser) {
         throw new ErrorResponse(400, "Password or email is wrong")
      }
      // Should implement is_verified user

      const generatedHash = await compareHash(password, foundUser.password)

      if (!generatedHash) {
         throw new ErrorResponse(400, "Password or email is wrong")
      }

      const tokenId = v4();

      const token = await this.generateToken({ device, remoteIp, tokenId, userId: foundUser.user_id })

      return token
   }

   async sendOtp({ user_id, email }: IUser) {

      const otp = await this.otpsDao.create(
         { code: generateRandomDigit(this.OtpDigitsCount), userId: user_id }
      );

      let messageBody = `Verification code: ${otp.code}`

      await sendMail(email, "Verification", messageBody);

      return { ...otp, email }
   }

   async resendOtp(email: string) {

      const user = await this.usersService.getByEmail(email)

      if (!user) {
         throw new ErrorResponse(400, 'Invalid user email');
      }

      const otp = await this.otpsDao.getLastOtp(user.user_id);

      if (!otp || !(getCurrentDate() >= getExpireDate(otp.created_at))) {
         throw new ErrorResponse(400, 'Cannot send, last one is avtive now')
      }

      await this.otpsDao.deactivateOtpById(otp.otp_id, otp.created_at)

      const sentOtp = await this.sendOtp(user)

      return sentOtp
   }

   async confirmOtp({ email, code }: IConfirmOtp, device: string, remoteIp: string) {

      const user = await this.usersService.getByEmail(email)

      if (!user) {
         throw new ErrorResponse(400, 'Invalid verification code');
      }

      const otp = await this.otpsDao.getLastOtp(user.user_id)

      if (!otp || Number(otp.code) !== code) {
         throw new ErrorResponse(400, "Invalid verification code")
      }

      await this.otpsDao.deactivateOtpById(otp.otp_id, otp.created_at)

      const verifiedUser = await this.usersService.verify(user.user_id, user.created_at)

      const tokenId = v4();

      const token = await this.generateToken({ device, remoteIp, userId: verifiedUser.user_id, tokenId });

      return token

   }

   async generateToken({ device, remoteIp, userId, tokenId }: ICreateUserSession) {

      const token = sign({ tokenId: tokenId, userId: userId }, server.jwtKey)

      await this.sessionsDao.create({
         tokenId: tokenId,
         userId: userId,
         device: device,
         remoteIp: remoteIp,
      });

      return token

   }

}

export default AuthService;
