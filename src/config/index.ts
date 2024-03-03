import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, '..', '..', '.env'),
});

const PORT = process.env.PORT;
const APP_URL = process.env.URL
  ? process.env.APP_URL
  : 'http://localhost:3000/';
const CLIENT_URL = process.env.CLIENT_URL || 'set client url';
const NODE_ENV = process.env.NODE_ENV || 'dev';
const SECRET_JWT = process.env.SECRET_JWTF;
const emailerOptions = {
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

export { PORT, APP_URL, NODE_ENV, SECRET_JWT, emailerOptions, CLIENT_URL };
