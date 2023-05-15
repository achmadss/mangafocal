

export interface MangaDetailModel {
    cover: string
    thumbnail: string
    title: string
    altTitles: Array<string>
    description: string
    rating: number | null
    status: Array<string>
    type: string
    genres: Array<string>
    chapters: Array<ChapterModel>
}

export interface ChapterModel {
    title: string
    url: string
}

export interface PageModel {
    pages: Array<string>
}

export interface MangaModel {
    title: string
    thumbnail: string
    url: string
}