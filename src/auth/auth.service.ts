import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return { message: 'Signup  from AuthService' };
  }
  signin() {
    return { message: 'Signin from AuthService' };
  }
}
