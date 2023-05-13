import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon from 'argon2'

@Injectable({})
export class AuthService {
    // inject services
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async signUp(
        authDto: AuthDto
    ) {
        try {
            // generate password hash
            const hash = await argon.hash(authDto.password)

            // save new user to db
            const user = await this.prismaService.user.create({
                data: {
                    email: authDto.email,
                    hash,
                },
            })

            // return the signed token
            return this.signToken(user.id, user.email)

        } catch (error) {
            // if prisma error
            if (error instanceof PrismaClientKnownRequestError) {
                // if user already taken
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw error
        }

    }

    async signIn(
        authDto: AuthDto
    ) {
        // find user by email
        // if user doesnt exist, throw exception
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDto.email,
            },
        })
        if (!user) throw new ForbiddenException('Credentials incorrect')

        // compare password
        // if password incorrect, throw exception
        const isPasswordMatches = await argon.verify(user.hash, authDto.password)
        if (!isPasswordMatches) throw new ForbiddenException('Credentials incorrect')

        // send back the signed token
        return this.signToken(user.id, user.email)

    }

    async signToken(
        userId: number, email: string
    ): Promise<{ access_token: string }> {
        // the payload
        const payload = {
            sub: userId,
            email,
        }
        // sign async with expire time & jwt secret key
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '1y',
            secret: this.configService.get('JWT_SECRET'),
        })
        // return access token
        return {
            access_token: token,
        }

    }

}