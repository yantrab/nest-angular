import { Injectable } from '@nestjs/common';
import { MFSettings, UserSettings, UserFilter } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
@Injectable()
export class MFService {
    private mfSettingsRepo: Repository<MFSettings>;
    private mfUserSettingsRepo: Repository<UserSettings>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.mfSettingsRepo = this.repositoryFactory.getRepository<MFSettings>(MFSettings, 'DBMF');
        this.mfUserSettingsRepo = this.repositoryFactory.getRepository<UserSettings>(UserSettings, 'DBMF');
        this.mfSettingsRepo.saveOrUpdateOne({
            defaultUserFilter: new UserFilter({
                filterGroups: [],
                name: 'Default',
                isDefualt: true,
            }),
        });

        //   this.mfUserSettingsRepo.saveOrUpdateOne({
        //     _id: 'admin@admin.com',
        //     userFilters: [
        //       new UserFilter({
        //         _id: '1',
        //         filterGroups: [],
        //         name: 'Default',
        //         isDefualt: true,
        //       }),
        //       new UserFilter({ _id: '2', filterGroups: [], name: 'bla bla' }),
        //     ],
        //   });
    }

    async getUserSettings(id: string): Promise<UserSettings> {
        return this.mfUserSettingsRepo.findOne({ _id: id });
    }

    async getSettings(): Promise<MFSettings> {
        return this.mfSettingsRepo.findOne({});
    }
}
