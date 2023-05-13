import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nestjs-puppeteer';
import { AsurascansSelector, getChapterAsurascans, getMangaAsurascans, getPageAsurascans } from 'src/common/scraping/asurascans';
import { Browser } from "puppeteer"

@Injectable()
export class AsurascansService {

    constructor(
        @InjectBrowser() private readonly browser: Browser,
    ) { }

    async getPopular() {
        const data = await getPageAsurascans(
            this.browser, AsurascansSelector.POPULAR, 1
        )
        return { data: data }
    }

    async getPage(pageNumber: number) {
        const data = await getPageAsurascans(
            this.browser, AsurascansSelector.LASTEST, pageNumber
        )
        return { data: data }
    }

    async getManga(url: string) {
        const data = await getMangaAsurascans(this.browser, url)
        return data
    }

    async getChapter(url: string) {
        const data = await getChapterAsurascans(this.browser, url)
        return data
    }

}
