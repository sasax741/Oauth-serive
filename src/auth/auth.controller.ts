import { Body, Controller, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import {JwtPayload} from '../interfaces/jwt-payload.interface'

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    register(
        @Body()
        registerDto: RegisterDto
    ){
        console.log(registerDto)
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(
        @Body()
        loginDto: LoginDto
    ){
        return this.authService.login(loginDto);
    }
    
    @Delete('deleteUser/:id')
    @UseGuards(AuthGuard)
    deleteUser(
        @Param('id') id: number,
        @Body() body:JwtPayload
    ){
        return this.authService.deleteUser(id, body);
    }

}
