import { Page } from "puppeteer"
import { ChapterModel, MangaDetailModel, MangaModel, PageModel } from "./model/ScrapingModel"
import { isEmptyOrSpaces } from "../StringUtils"

const BASE_URL = `https://www.asurascans.com`

export enum AsurascansSelector {
    // homepage
    POPULAR = `.bixbox.hothome .bs`,
    LASTEST = `.bixbox:last-of-type .utao`,
    SEARCH = `.bixbox .bs`
}

export async function getPageAsurascans(
    page: Page,
    selector: AsurascansSelector,
    query: string,
    pageNumber: number = 1,
) {
    let url = `${BASE_URL}/page/${pageNumber}/`
    if (!isEmptyOrSpaces(query)) {
        selector = AsurascansSelector.SEARCH
        url = `${BASE_URL}/page/${pageNumber}/?s=${query}`
    }

    await page.goto(url)
    await page.waitForSelector('.bixbox')

    const data: Array<MangaModel> = []

    const items = await page.$$(selector)
    for (const item of items) {
        const title = await item.$eval("a", (a) => a.title)
        const url = await item.$eval("a", (a) => a.href)
        const thumbnail = await item.$eval("img", (img) => img.src);
        data.push({ title, thumbnail, url });
    }

    return Promise.resolve(data)

}

export async function getMangaAsurascans(
    page: Page,
    url: string,
) {
    await page.goto(url)
    await page.waitForSelector('div.bixbox.animefull')
    await page.waitForSelector('div.bixbox.bxcl.epcheck')

    const bigCoverDiv = await page.$('.bixbox.animefull .bigcover');
    const bigContentDiv = await page.$('.bixbox.animefull .bigcontent');
    const thumbnailDiv = await page.$('.bixbox.animefull .bigcontent .thumb');
    const descriptionDiv = await bigContentDiv.$$('.wd-full')
    const titleDiv = await bigContentDiv.$('.infox')

    let bigCover = ""

    if (bigCoverDiv) {
        bigCover = await bigCoverDiv.$eval('img', (img) => img.src);
    }

    const title = await titleDiv.$eval('h1', (h1) => h1.innerHTML)
    const altTitles: string[] = []
    let description = ""
    let descDivIndex = 0
    let genreDivIndex = 1

    if (descriptionDiv.length > 2) {
        const altSpan = await descriptionDiv[descDivIndex].$$eval('span', (span) =>
            span.map((s) => s.innerHTML)
        )
        altTitles.push(...altSpan);
        descDivIndex = 1
        genreDivIndex = 2
    }

    let descDiv = await descriptionDiv[descDivIndex].$('.entry-content')
    try {
        const paragraphs = await descDiv.$$eval('p', (p) =>
            p.map((p) => p.innerText)
        )
        description = paragraphs.join(' ')
    } catch (error) {
        const contentsDiv = await page.$("[class^='contents-']")
        description = await contentsDiv.evaluate(div => div.textContent.trim())
    }

    const genreSpan = await descriptionDiv[genreDivIndex].$('.mgen')
    let genres = await genreSpan.$$eval('a', a => a.map(s => s.innerHTML))

    let thumbnail = await thumbnailDiv.$eval('.thumb img', (img) => img.src);
    let rating: number = +(await bigContentDiv.$eval('.num', (num) => num.innerHTML))
    let [status, type] = await Promise.all([
        bigContentDiv.$eval('.imptdt i', (i) => i.innerText),
        bigContentDiv.$eval('.imptdt a', (a) => a.innerText)
    ]);

    let statusMultiple = [status]

    const chapters: ChapterModel[] = []

    const chaptersLi = await page.$$('.bixbox.bxcl.epcheck .eplister .clstyle li')
    for (const li of chaptersLi) {
        const chapterTitle = "Chapter " + await li.evaluate((el) => el.getAttribute('data-num'))
        const chapterUrl = await li.$eval('.chbox .eph-num a', a => a.href)
        chapters.push({
            title: chapterTitle,
            url: chapterUrl
        })
    }

    let data: MangaDetailModel = {
        cover: bigCover,
        thumbnail,
        title,
        altTitles,
        description,
        rating,
        status: statusMultiple,
        type,
        genres,
        chapters
    }

    return Promise.resolve(data)

}

export async function getChapterAsurascans(
    page: Page,
    url: string,
) {
    await page.goto(url)
    await page.waitForSelector('div#readerarea.rdminimal')

    const pages = await page.$$eval('.rdminimal p img', (elements) => {
        return elements.map(el => el.src)
    })

    let data: PageModel = { pages }

    return Promise.resolve(data)

}
