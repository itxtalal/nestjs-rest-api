import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';

@Injectable({})
export class AuthService {
  signup() {
    return { message: 'Signup  from AuthService' };
  }
  signin() {
    return { message: 'Signin from AuthService' };
  }
}
