import * as nodemailer from 'nodemailer';
import { emailerOptions } from '../../config';

export const transporter = nodemailer.createTransport(emailerOptions);
