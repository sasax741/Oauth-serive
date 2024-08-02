import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import {JwtPayload} from '../interfaces/jwt-payload.interface'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {


    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){
    }

    
    async register({name, lastName, email, password, client}: RegisterDto){ 
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

    async getUsers(){
        return this.usersService.findAll();
    }

    async getUser(id:number){
        return this.usersService.findOne(id)
    }


    async login({email, password, client}: LoginDto){
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('email is wrong');
        }

        if(user.daletedAt != null){
            throw new BadRequestException('the user has already been deleted');
        }

        if (user.client != client) {
            throw new UnauthorizedException('unauthorized user for this client');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('password is wrong');
        }
        const timestamp = Math.floor(Date.now() / 1000);
        const jti = `${user.id}-${timestamp}-${uuidv4()}`;
        
        const payload = {
            email: user.email,
            sub: user.id,
            iss: "auth waves",
            aud: user.client,
            nbf: timestamp,
            jti: jti
        }

        const token = await this.jwtService.signAsync(payload)

        return {
            email,
            token,
        };
    }

    async deleteUser(id:number, userToken:JwtPayload){

        const userActive = await this.usersService.findOne(id)
        console.log("de la base---------------------------------",userActive)
        console.log("token------------------------------",userToken)
        if(userActive == null){
            throw new BadRequestException('the user has already been deleted') 
        }
        if (userActive.client != userToken.aud) {
            throw new BadRequestException('unauthorized user for this client')
        }
        if (userActive.id != userToken.sub) {
            throw new BadRequestException('unauthorized token for this user')
        }

        return this.usersService.remove(id);
    }

}
