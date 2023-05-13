import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AsurascansService } from './asurascans.service';

@Controller('asurascans')
export class AsurascansController {

    constructor(
        private service: AsurascansService,
    ) { }

    @Get('popular')
    async getHomePage() {
        return this.service.getPopular()
    }

    @Get(':pageNumber')
    async getPage(
        @Param('pageNumber', ParseIntPipe) pageNumber: number
    ) {
        return this.service.getPage(pageNumber)
    }

    @Get()
    async getManga(
        @Query('manga') manga: string,
        @Query('chapter') chapter: string
    ) {
        if (manga) return this.service.getManga(manga)
        if (chapter) return this.service.getChapter(chapter)
        return this.getPage(1)
    }

}
