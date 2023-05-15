import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { MangaparkService } from './mangapark.service';
import { MangaparkBrowseType } from 'src/common/scraping/mangaparkv36';
import { MangaparkMangaDto } from './dto/mangapark.dto';

@Controller('mangapark')
export class MangaparkController {

    constructor(
        private service: MangaparkService,
    ) { }

    @Get('popular')
    async getPopular(
        @Query() { page, query }: MangaparkMangaDto
    ) {
        return this.service.getPage(query, page, MangaparkBrowseType.POPULAR)
    }

    @Get('latest')
    async getLatest(
        @Query() { page, query }: MangaparkMangaDto
    ) {
        return this.service.getPage(query, page, MangaparkBrowseType.LATEST)
    }

    @Get('rating')
    async getRating(
        @Query() { page, query }: MangaparkMangaDto
    ) {
        return this.service.getPage(query, page, MangaparkBrowseType.RATING)
    }

    @Get()
    async getManga(
        @Query() { manga, chapter, page, query }: MangaparkMangaDto,
    ) {
        if (manga) return this.service.getManga(manga)
        if (chapter) return this.service.getChapter(chapter)
        return this.service.getPage(query, page)
    }

}
