import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {
  // AuthGuard linked to jwt Strategy we created in auth/strategy
  // NestJS Guards will prevent unauthorized access to the endpoint
  // If user is authenticated, only then the endpoint will be accessible

  //* GET users/me
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    console.log({
      user: req.user,
    });
    return req.user;
  }
}
