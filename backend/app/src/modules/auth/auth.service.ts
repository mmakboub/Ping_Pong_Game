import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import RegisterDto from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Prisma } from "@prisma/client";

enum PrismaErrorCodes {
    UniqueViolation = '23505'
}

@Injectable()
export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    ftLogin(req) {
        if (!req.user) {
            return 'NO user from 42';
        }

        return {
            message: 'User information fom 42',
            user: req.user
        }
    }

    ////////////////////////////////////////////////
    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public async register(registrationData: RegisterDto) {
        try {
            const createdUser = await this.usersService.create({
                ...registrationData,
            });
            return createdUser;
        } catch (error) {
            console.log(error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === PrismaErrorCodes.UniqueViolation) {
                    return (registrationData);
                }
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.usersService.getByEmail(email);
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Path=/; Max-Age=0`;
    }
}