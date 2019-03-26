import { UserFilter } from './filter.model';
import { Entity } from './Entity';
import { ValidateNested } from 'class-validator';
import { Fund } from './fund.model';
export class UserSettings extends Entity {
    @ValidateNested({ each: true })
    userFilters: UserFilter[];
    constructor(data?: Partial<UserSettings>) {
        super();
        if (data) {
            this.userFilters = data.userFilters.map(userFilter =>  new UserFilter(userFilter));
        }
    }
}

export class InitialData {
    @ValidateNested()
    userSetting: UserSettings;
    @ValidateNested({ each: true })
    funds: Fund[];
    constructor(data?: Partial<InitialData>) {
        if (data) {
            this.userSetting = new UserSettings(data.userSetting);
            this.funds = data.funds;
        }
    }
}

export class MFSettings extends Entity {
    @ValidateNested()
    defaultUserFilter: UserFilter;
}
