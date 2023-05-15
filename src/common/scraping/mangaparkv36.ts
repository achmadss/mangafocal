import { Page } from "puppeteer"
import { ChapterModel, MangaDetailModel, MangaModel, PageModel } from "./model/ScrapingModel"
import { isEmptyOrSpaces } from "../StringUtils"

const BASE_URL = `https://mangapark.net`

export enum MangaparkBrowseType {
    POPULAR = 'd007',
    LATEST = 'update',
    RATING = 'rating',
}

export async function getPageMangapark(
    page: Page,
    type: MangaparkBrowseType,
    query: string,
    pageNumber: number = 1,
) {
    let url = `${BASE_URL}/browse?sort=${type}&page=${pageNumber}`
    let idSelector = `subject-list`
    if (!isEmptyOrSpaces(query)) {
        url = `${BASE_URL}/search?word=${query}&page=${pageNumber}`
        idSelector = `search-list`
    }

    await page.goto(url)
    await page.waitForSelector(`div#${idSelector} div.col`)

    const subjectList = await page.$$(`div#${idSelector} div.col`)

    const data: Array<MangaModel> = []

    for (const subject of subjectList) {
        const titleDiv = await subject.$('div')
        const title = await titleDiv.$eval('a', a => a.title)
        const thumbnail = await subject.$eval('a img', img => img.src)
        const url = await subject.$eval('a', a => a.href)
        data.push({ title, thumbnail, url });
    }

    return Promise.resolve(data)

}

export async function getMangaMangapark(
    page: Page,
    url: string,
) {
    await page.goto(url)
    await page.waitForSelector('div.row.detail-set')

    const thumbnail = await page.$eval('div.row.detail-set div img', img => img.src)
    const rating = +(await page.$eval('b.text-color-orange-500', b => b.textContent))
    const genres = await page.$$eval('span span, span u', elements => elements.map(element =>
        element.textContent)
    );
    const status = await page.$$eval('.attr-item', (items) =>
        items.map((item) => {
            const b = item.querySelector('b');
            if (b && b.textContent?.includes('Official status:')) {
                const span = b.nextElementSibling;
                return span?.textContent;
            } else return null
        }).filter(status => status != null)
    );
    const description = await page.$eval('.limit-html', element => element.textContent.trim());
    const title = await page.$eval('.title-set .item-title a', a => {
        return a.innerHTML
    })

    const epList = await page.$('.episode-list')
    const chapters: Array<ChapterModel> = await epList.$$eval('.episode-item a', (anchors) => {
        return anchors.map(a => {
            try {
                return {
                    title: `Chapter ${a.querySelector('b').innerHTML}`,
                    url: a.href
                }
            } catch (error) {
                console.log(error)
            }
        }).filter(chapters => chapters != null)
    })

    const data: MangaDetailModel = {
        cover: "",
        thumbnail,
        title,
        altTitles: [],
        description,
        rating,
        status,
        type: "",
        genres,
        chapters,
    }

    return Promise.resolve(data)

}

export async function getChapterMangapark(
    page: Page,
    url: string,
) {

    page.setCacheEnabled(false)
    await page.goto(url)
    await page.waitForSelector('div#viewer .item')

    await page.select('select#select-load', 'f')
    await page.reload()
    await page.waitForSelector('div#viewer .item')

    const pages = await page.$$eval('#viewer .item img', (imgs) => {
        return imgs.map(img => img.src)
    })

    const data: PageModel = { pages }

    return Promise.resolve(data)

}