import { Injectable } from '@nestjs/common';
import { MFSettings, UserSettings } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
@Injectable()
export class MFService {
    private mfSettingsRepo: Repository<MFSettings>;
    private mfUserSettingsRepo: Repository<UserSettings>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.mfSettingsRepo = this.repositoryFactory.getRepository<MFSettings>(MFSettings, 'DBMF');
        this.mfUserSettingsRepo = this.repositoryFactory.getRepository<UserSettings>(UserSettings, 'DBMF');
        this.mfSettingsRepo.saveOrUpdate(
            {
                _id: '1',
                defaultUserFilter: { _id: '1', FilterGroup: [], name: 'Default' },
            });
    }

}