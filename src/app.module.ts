import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { PrismaModule } from './prisma/prisma.module';
import { PuppeteerModule } from 'nestjs-puppeteer';
import { MangaModule } from './manga/manga.module';
import { RouterModule, Routes } from 'nest-router';
import { ChapterModule } from './chapter/chapter.module';
import { SourceModule } from './source/source.module';

const routes: Routes = [
    {
        path: '/auth',
        module: AuthModule,
    },
    {
        path: '/categories',
        module: CategoryModule,
    },
    {
        path: '/users',
        module: UserModule,
    },
    {
        path: '/manga',
        module: MangaModule,
    },
    {
        path: '/sources',
        module: SourceModule,
    },
]

@Module({
    imports: [
        RouterModule.forRoutes(routes),
        PuppeteerModule.forRoot({
            isGlobal: true,
            headless: 'new',
            ignoreHTTPSErrors: true,
        }),
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UserModule,
        CategoryModule,
        PrismaModule,
        MangaModule,
        ChapterModule,
        SourceModule,
    ],
})
export class AppModule { }
