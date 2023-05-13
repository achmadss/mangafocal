import { Browser } from "puppeteer"

export enum AsurascansSelector {
    // homepage
    POPULAR = `.bixbox.hothome .bs`,
    LASTEST = `.bixbox:last-of-type .utao`,
}

export async function getPageAsurascans(
    browser: Browser,
    selector: AsurascansSelector,
    pageNumber: number | 1,
) {
    const url = `https://www.asurascans.com/page/${pageNumber}/`
    const data: Array<{ title: string, img: string, url: string }> = []

    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('.bixbox')

    const items = await page.$$(selector)
    for (const item of items) {
        const title = await item.$eval("a", (a) => a.title)
        const url = await item.$eval("a", (a) => a.href)
        const img = await item.$eval("img", (img) => img.src);
        data.push({ title, img, url });
    }

    await page.close()

    return Promise.resolve(data)

}

export async function getMangaAsurascans(
    browser: Browser,
    url: string,
) {
    const page = await browser.newPage()
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
    let rating = await bigContentDiv.$eval('.num', (num) => num.innerHTML);
    let [status, type] = await Promise.all([
        bigContentDiv.$eval('.imptdt i', (i) => i.innerText),
        bigContentDiv.$eval('.imptdt a', (a) => a.innerText)
    ]);

    const chapters: { chapterTitle: string, chapterUrl: string }[] = []

    const chaptersLi = await page.$$('.bixbox.bxcl.epcheck .eplister .clstyle li')
    for (const li of chaptersLi) {
        const chapterTitle = "Chapter " + await li.evaluate((el) => el.getAttribute('data-num'))
        const chapterUrl = await li.$eval('.chbox .eph-num a', a => a.href)
        chapters.push({ chapterTitle, chapterUrl })
    }

    let data = {
        cover: bigCover,
        thumbnail,
        title,
        altTitles,
        description,
        rating,
        status,
        type,
        genres,
        chapters,
    }

    await page.close()

    return Promise.resolve(data)

}

export async function getChapterAsurascans(
    browser: Browser,
    url: string,
) {
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('div#readerarea.rdminimal')

    const chapterPages = await page.$$eval('.rdminimal p img', (elements) => {
        return elements.map(el => el.src)
    })

    let data = {
        data: chapterPages
    }

    await page.close()

    return Promise.resolve(data)

}