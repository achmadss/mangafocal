import { Injectable } from '@nestjs/common';
import { Browser } from "puppeteer"
import { InjectBrowser } from 'src/common/puppeteer';
import { MangaparkBrowseType, getChapterMangapark, getMangaMangapark, getPageMangapark } from 'src/common/scraping';

@Injectable()
export class MangaparkService {

    constructor(
        @InjectBrowser() private readonly browser: Browser,
    ) { }

    async getPage(
        query: string,
        pageNumber: number = 1,
        type: MangaparkBrowseType = MangaparkBrowseType.LATEST
    ) {
        const page = await this.browser.newPage()
        let data = {}
        try {
            data = await getPageMangapark(
                page, type, query, pageNumber,
            )
        } catch (error) {
            console.error(error)
        }
        page.close()
        return { data: data }
    }

    async getManga(
        url: string
    ) {
        const page = await this.browser.newPage()
        let data = {}
        try {
            data = await getMangaMangapark(
                page, url,
            )
        } catch (error) {
            console.error(error)
        }
        page.close()
        return data
    }

    async getChapter(
        url: string
    ) {
        const page = await this.browser.newPage()
        let data = {}
        try {
            data = await getChapterMangapark(
                page, url,
            )
        } catch (error) {
            console.error(error)
        }
        page.close()
        return data
    }

}
