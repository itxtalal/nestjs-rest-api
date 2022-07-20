import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signup(dto: AuthDto) {
    console.log({ dto });
    return { message: 'Signup  from AuthService' };
  }
  signin() {
    return { message: 'Signin from AuthService' };
  }
}
