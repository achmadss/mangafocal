import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class SourceService {

    getSourcesBasedOnFolders() {

        const dir = fs.readdirSync(__dirname);
        const folders = dir.filter(f => fs.statSync(__dirname + '/' + f).isDirectory());
        return folders

    }

}
