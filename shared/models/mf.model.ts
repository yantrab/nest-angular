import { UserFilter } from './filter.model';
import { Entity } from './Entity';
import { ValidateNested } from 'class-validator';
import { Fund } from './fund.model';
export class UserSettings extends Entity {
    @ValidateNested({ each: true })
    userFilters: UserFilter[];
}

export class InitialData {
    @ValidateNested()
    userSetting: UserSettings;
    @ValidateNested({ each: true })
    funds: Fund[];
    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class MFSettings extends Entity {
    @ValidateNested()
    defaultUserFilter: UserFilter;
}
