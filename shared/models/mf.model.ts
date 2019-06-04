import { UserFilter } from './filter.model';
import { Entity } from './Entity';
import { ValidateNested, IsString } from 'class-validator';
// import { Fund } from './fund.model';

export class TableSettings {
    @IsString({ each: true })
    columns: string[];
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class GridSettings {
    @IsString()
    groupBy: string;
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class UserSettings extends Entity {
    @ValidateNested({ each: true }) userFilters: UserFilter[];
    @ValidateNested() tableSettings: TableSettings;
    @ValidateNested() gridSettings: GridSettings;
    @IsString() email: string;
    constructor(data?: Partial<UserSettings>) {
        super(data);
        if (data) {
            if (data.userFilters) {
                this.userFilters = data.userFilters.map(userFilter => new UserFilter(userFilter));
            }
            if (data.tableSettings) {
                this.tableSettings = new TableSettings(data.tableSettings);
            }
            if (data.gridSettings) {
                this.gridSettings = new GridSettings(data.gridSettings);
            }
        }
    }
}

export class InitialData {
    @ValidateNested()
    userSetting: UserSettings;
    @ValidateNested({ each: true })
    funds: any[];
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
    gridSettings;
    tableSettings: { columns: string[] };
}
