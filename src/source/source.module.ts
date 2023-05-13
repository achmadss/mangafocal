import { Module } from '@nestjs/common';
import { AsurascansController } from './asurascans/asurascans.controller';
import { AsurascansService } from './asurascans/asurascans.service';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';

@Module({
    controllers: [AsurascansController, SourceController],
    providers: [AsurascansService, SourceService]
})
export class SourceModule { }
