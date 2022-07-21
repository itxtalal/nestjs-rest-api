import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    // console.log({ dto });

    // hash the password
    const hash = await argon.hash(dto.password);

    try {
      // create a new user in the database
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // return the signed JWT token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already in use');
        }
      }
      throw error;
    }
  }
  async signin(dto: AuthDto) {
    // find a user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user do not exist, throw ForbiddenException
    if (!user) throw new ForbiddenException('Invalid credentials');

    // if user exists, check if password is correct
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password is incorrect, throw ForbiddenException
    if (!pwMatches) throw new ForbiddenException('Credentials do not match');

    // if password is correct, return the signed JWT token

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
