import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHashAdapter {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async validatePassword(passedPassword: string, hashedPassword: string) {
    return await bcrypt.compare(passedPassword, hashedPassword);
  }
}
