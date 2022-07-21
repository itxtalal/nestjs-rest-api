import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

// AuthGuard linked to jwt Strategy we created in auth/strategy
// NestJS Guards will prevent unauthorized access to the endpoint
// If user is authenticated, only then the endpoint will be accessible
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //* GET users/me
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }
  // getMe(@GetUser('email') email: string) {
  //   return { email };
  // }

  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
