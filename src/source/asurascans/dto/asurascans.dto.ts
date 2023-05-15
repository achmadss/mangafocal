import { IsNumber, IsOptional, IsString } from "class-validator";

export class AsurascansMangaDto {

    @IsOptional()
    @IsString()
    manga: string

    @IsOptional()
    @IsString()
    chapter: string

    @IsOptional()
    @IsNumber()
    page: number

    @IsOptional()
    @IsString()
    query: string

}