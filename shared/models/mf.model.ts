import { UserFilter } from './filter.model';
import { Entity } from './Entity';
import { ValidateNested } from 'class-validator';
export class UserSettings extends Entity {
    @ValidateNested({ each: true })
    userFilters: UserFilter[];
}

export class InitialData {
    @ValidateNested()
    userSetting: UserSettings;
}

export class MFSettings extends Entity {
    @ValidateNested()
    defaultUserFilter: UserFilter;
}
