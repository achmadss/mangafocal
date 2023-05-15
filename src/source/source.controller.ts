import { Controller, Get } from '@nestjs/common';
import { SourceService } from './source.service';

@Controller()
export class SourceController {

    constructor(
        private service: SourceService,
    ) { }

    @Get()
    getSourcesBasedOnFolders() {
        const modules = this.service.getSourcesBasedOnFolders()
        return {
            modules
        }
    }

}
