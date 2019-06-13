import { Injectable } from '@nestjs/common';
import { MFSettings, UserSettings, UserFilter, FilterGroup, DropdownFilter, QuantityFilter, DateRangeComboFilter } from 'shared';
import { Repository, RepositoryFactory } from 'mongo-nest';
@Injectable()
export class MFService {
    private mfSettingsRepo: Repository<MFSettings>;
    private mfUserSettingsRepo: Repository<UserSettings>;

    constructor(private repositoryFactory: RepositoryFactory) {
        this.mfSettingsRepo = this.repositoryFactory.getRepository<MFSettings>(MFSettings, 'DBMF');
        this.mfUserSettingsRepo = this.repositoryFactory.getRepository<UserSettings>(UserSettings, 'DBMF');
        const exp = [
            'expNorthAmerica',
            'expNorthAmericaNone',
            'expSouthAmerica',
            'expSouthAmericaNone',
            'expAfrica',
            'expAfricaNone',
            'expEurope',
            'expEuropeNone',
            'expAsia',
            'expAsiaNone',
            'expIsrael',
            'expAustralia',
            'expGlobal',
            'expGlobalNone',
            'expUSD',
            'expEuro',
            'expOtherCurrencies',
            'expCurrency',
        ];
        this.mfSettingsRepo.findOne().then(data => {
            if (!data) {
                this.mfSettingsRepo.saveOrUpdateOne({
                    defaultUserFilter: new UserFilter({
                        filterGroups: [
                            {
                                name: 'General',
                                filters: [
                                    {
                                        kind: 'AutocompleteFilter',
                                        optionIdPath: 'trusteeID',
                                        optionNamePath: 'trusteeName',
                                        placeholder: 'trustee',
                                    },
                                ],
                            } as FilterGroup,
                            {
                                name: 'Yeilds',
                                filters: [
                                    {
                                        kind: 'QuantityFilter',
                                        optionIdPath: 'dailyYield',
                                        placeholder: 'daily',
                                    },
                                ],
                            } as FilterGroup,
                            {
                                name: 'period',
                                filters: [
                                    {
                                        kind: 'DateRangeComboFilter',
                                        optionIdPath: 'policyChangeDate',
                                        placeholder: 'שינוי מדינייות',
                                        options: [3, 6, 12].map(m => ({ _id: m * 1000 * 60 * 60 * 24 * 30, name: m + ' month' })),
                                    },
                                ],
                            } as FilterGroup,
                            new FilterGroup({
                                name: 'K300',
                                filters: [
                                    new DropdownFilter({
                                        placeholder: 'חשיפות',
                                        options: exp.map(e => ({
                                            _id: e,
                                            name: e,
                                            filter: new QuantityFilter({
                                                placeholder: e,
                                                optionIdPath: e,
                                            }),
                                        })),
                                    }),
                                ],
                            }),
                        ],

                        name: 'Default',
                        isDefualt: true,
                    }),
                    tableSettings: { columns: ['id', 'name', 'symbol'] },
                    gridSettings: { groupBy: 'primeClassification', secondaryGroupBy: 'mainClassification' },
                    simlulationSettings: {
                        excludeFilter: new DateRangeComboFilter({
                            optionIdPath: 'policyChangeDate',
                            placeholder: 'שינוי מדינייות',
                            options: [3, 6, 12].map(m => ({ _id: m * 1000 * 60 * 60 * 24 * 30, name: m + ' month' })),
                        }),
                        customizeParameters: [
                            { groupName: 'exp', parameters: exp.map(e => ({ name: e, path: e })) },
                            { groupName: 'yields', parameters: [{ name: 'dailyYield', path: 'dailyYield' }] },
                            { groupName: 'Quality', parameters: [{ name: 'dailyYield', path: 'dailyYield' }] },
                            { groupName: 'Management', parameters: [{ name: 'dailyYield', path: 'dailyYield' }] },
                        ],
                    },
                });
            }
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

    async getUserSettings(email: string): Promise<UserSettings> {
        return this.mfUserSettingsRepo.findOne({ email });
    }

    async getSettings(): Promise<MFSettings> {
        return this.mfSettingsRepo.findOne({});
    }

    async saveUserSettings(userSettings: UserSettings) {
        if (userSettings.isNew) {
            return this.mfUserSettingsRepo.collection.insertOne(userSettings);
        }
        return this.mfUserSettingsRepo.collection.updateOne(
            { email: userSettings.email },
            { $set: { userFilters: userSettings.userFilters } },
        );
    }
}
