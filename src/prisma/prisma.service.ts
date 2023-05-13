import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(
        configService: ConfigService
    ) {
        super({
            datasources: {
                db: {
                    // url: 'postgresql://postgres:password@localhost:5434/nest?schema=public'
                    url: configService.get('DATABASE_URL')
                },
            },
        })
    }

    cleanDb() {
        return this.$transaction([
            this.category.deleteMany(),
            this.user.deleteMany(),
        ])
    }

}
