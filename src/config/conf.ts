import { config } from 'dotenv';

config();

const { env } = process;

export const server = {
  httpPort: env.HTTP_PORT || 4000,
  nodeEnv: env.NODE_ENV || 'development',
  jwtKey: env.JWT_KEY,
  gmailHostname: env.EMAIL_HOSTNAME,
  gmailUsername: env.EMAIl_USERNAME,
  gmailPassowrd: env.EMAIL_PASSWORD,
};