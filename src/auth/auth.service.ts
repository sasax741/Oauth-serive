import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';

import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    
    async register({name, lastName, email, password, client}: RegisterDto){ //esto es el registerDto
        const user = await this.usersService.findOneByEmail(email)

        if (user) {
           throw new BadRequestException('User already exists') 
        }

        return await this.usersService.create({
            name, 
            lastName, 
            email, 
            password: await bcrypt.hash(password ,10),
            client
        })
    }

    async login({email, password}: LoginDto){
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('email is wrong');

        }

        if(user.daletedAt != null){
            throw new BadRequestException('the user has already been deleted')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('password is wrong');
        }
        
        const payload = {
            id: user.id,
            email: user.email,
        }

        const token = await this.jwtService.signAsync(payload)

        return {
            email,
            token,
        };
    }

    async deleteUser(id:number){

        const userActive = await this.usersService.findOne(id)

        if(userActive.daletedAt != null){
            throw new BadRequestException('the user has already been deleted') 
        }

        return this.usersService.remove(id);
    }

}
