import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { createUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @Post('/signup')
  async createUser(@Body() createUserDto: createUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async getToto9() {
    return this.usersService.findOne('aaba03@gmail.com');
  }
}
