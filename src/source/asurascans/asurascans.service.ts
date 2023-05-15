import { Injectable } from '@nestjs/common';
import { Browser } from "puppeteer"
import { InjectBrowser } from 'src/common/puppeteer';
import { AsurascansSelector, getChapterAsurascans, getMangaAsurascans, getPageAsurascans } from 'src/common/scraping';

@Injectable()
export class AsurascansService {

    constructor(
        @InjectBrowser() private readonly browser: Browser,
    ) { }

    async getPopular() {
        const page = await this.browser.newPage()
        let data = {}
        try {
            data = await getPageAsurascans(
                page, AsurascansSelector.POPULAR, null
            )
        } catch (error) {
            console.error(error)
        }
        page.close()
        return { data: data }
    }

    async getLatest(
        query: string,
        pageNumber: number = 1
    ) {
        const page = await this.browser.newPage()
        let data = {}
        try {
            data = await getPageAsurascans(
                page, AsurascansSelector.LASTEST, query, pageNumber
            )
        } catch (error) {
            console.error(error)
        }
        page.close()
        return { data: data }
    }

    async getManga(url: string) {
        const page = await this.browser.newPage()
        let data = {}
        try {
            data = await getMangaAsurascans(page, url)
        } catch (error) {
            console.error(error)
        }
        page.close()
        return data
    }

    async getChapter(url: string) {
        const page = await this.browser.newPage()
        let data = {}
        try {
            data = await getChapterAsurascans(page, url)
        } catch (error) {
            console.error(error)
        }
        page.close()
        return data
    }

}
