import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JwtPayload } from '../types';
import { StringValue } from 'ms';

export class AuthUtil {
  private static readonly JWT_SECRET: Secret =
    process.env.JWT_SECRET || 'fallback-secret';

  private static readonly JWT_EXPIRES_IN: number | StringValue =
    (process.env.JWT_EXPIRES_IN as StringValue) || '24h';

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: this.JWT_EXPIRES_IN,
    };
    return jwt.sign(payload as object, this.JWT_SECRET, options);
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
  }
}
