import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signup() {
    return { message: 'Signup  from AuthService' };
  }
  signin() {
    return { message: 'Signin from AuthService' };
  }
}
