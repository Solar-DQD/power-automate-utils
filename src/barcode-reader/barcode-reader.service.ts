import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from './entities/paneles.entity';
import { Repository } from 'typeorm';
import { PanelesEscaneados } from './barcode-reader.controller';

@Injectable()
export class BarcodeReaderService {

    constructor(
        @InjectRepository(Panel)
        private panelesRepository: Repository<Panel>
    ) { }

    async createPanel(params: PanelesEscaneados): Promise<void> {
        const paneles = params.paneles.map(scan =>
            this.panelesRepository.create({
                panel: scan,
                tracker: params.tracker,
                parque: params.parque
            })
        );
        await this.panelesRepository.save(paneles);
    };
};
