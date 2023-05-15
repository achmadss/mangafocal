import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AsurascansService } from './asurascans.service';
import { AsurascansMangaDto } from './dto';

@Controller('asurascans')
export class AsurascansController {

    constructor(
        private service: AsurascansService,
    ) { }

    @Get('popular')
    async getPopular() {
        return this.service.getPopular()
    }

    @Get()
    async getManga(
        @Query() { manga, chapter, page, query }: AsurascansMangaDto,
    ) {
        if (manga) return this.service.getManga(manga)
        if (chapter) return this.service.getChapter(chapter)
        return this.service.getLatest(query, page)
    }

}
