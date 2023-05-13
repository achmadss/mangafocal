import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {


    @IsEmail()
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "User email address",
        example: "john.doe123@gmail.com"
    })
    email: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "User password",
        example: "secretpassword"
    })
    password: string

}   