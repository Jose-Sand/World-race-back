import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/signin.dto';
import { Auth } from './decorators';
import { ValidRoles } from 'src/common/constant/validRoles';
import { CompleteRequest } from './interfaces/complete-user.interface';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('signin')
  signin(@Body() data: SignInDto) {
    return this.authService.signin(data.email, data.password);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.authService.findAll();
  }

  @Get('auth-me')
  @Auth()
  authMe(@Req() request: CompleteRequest) {
    return request.user;
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Put(':id')
  @Auth(ValidRoles.admin)
  udateUser(@Param('id') id: string, @Body() data: UpdateAuthDto) {
    return this.authService.update(id, data);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
