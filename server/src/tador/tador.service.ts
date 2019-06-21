import { Injectable } from '@nestjs/common';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { NPPanel, Panel } from 'shared/models/tador/tador.model';

@Injectable()
export class TadorService {
    panelRepo: Repository<Panel>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.panelRepo = this.repositoryFactory.getRepository<Panel>(Panel, 'tador');
        this.panelRepo.findMany().then(result => {
            if (result.length) {
                return;
            }
            const panels = Array(10)
                .fill(0)
                .map((_, i) => new NPPanel({ address: 'חולון 24', name: 'בניין ' + i }));
            this.panelRepo.saveOrUpdateMany(panels);
        });
    }
}
