import { Module } from '@nestjs/common';
import { AsurascansController } from './asurascans/asurascans.controller';
import { AsurascansService } from './asurascans/asurascans.service';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';
import { MangaparkController } from './mangapark/mangapark.controller';
import { MangaparkService } from './mangapark/mangapark.service';

@Module({
    controllers: [AsurascansController, SourceController, MangaparkController],
    providers: [AsurascansService, SourceService, MangaparkService]
})
export class SourceModule { }
