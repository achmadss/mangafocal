import { Controller, Post, Body, HttpCode, HttpStatus, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }

    @ApiCreatedResponse({
        description: "User signed up",
    })
    @ApiBadRequestResponse({ description: "Sign up user failed" })
    @Post('sign-up')
    signUp(
        @Body() authDto: AuthDto,
    ) {
        return this.authService.signUp(authDto)
    }

    @ApiOkResponse({
        description: "User signed in",
        type: AuthDto,
    })
    @ApiBadRequestResponse({ description: "Sign in user failed" })
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    signIn(
        @Body() authDto: AuthDto,
    ) {
        return this.authService.signIn(authDto)
    }

}