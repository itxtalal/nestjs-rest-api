import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

// AuthGuard linked to jwt Strategy we created in auth/strategy
// NestJS Guards will prevent unauthorized access to the endpoint
// If user is authenticated, only then the endpoint will be accessible
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  //* GET users/me
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  // getMe(@GetUser('email') email: string) {
  //   return { email };
  // }
}
