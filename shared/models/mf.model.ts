import { DateRangeComboFilter, Filter, UserFilter } from './filter.model';
import { Entity } from './Entity';
import { ValidateNested, IsString } from 'class-validator';
// import { Fund } from './fund.model';

export enum SimulationRankType {
    unified = 'unified',
    group = 'group',
    subGroup = 'subGroup',
    freely = 'freely',
}
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
    @IsString()
    secondaryGroupBy: string;
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
export class CustomizeParameter {
    name: string;
    path: string;
    isActive?: boolean;
    percent?: number;
}

export class CustomizeParameterGroup {
    name: string;
    percent?: number;
    parameters: CustomizeParameter[];
    width?: string;
}

export class SimulationSettings {
    excludeFilter: Filter;
    customizeParameters: CustomizeParameterGroup[];
    constructor(data: Partial<SimulationSettings>) {
        if (data) {
            Object.assign(this, data);
            if (data.excludeFilter) {
                this.excludeFilter = new DateRangeComboFilter(data.excludeFilter);
            }
        }
    }
}

export class UserSettings extends Entity {
    @ValidateNested({ each: true }) userFilters: UserFilter[];
    @ValidateNested() tableSettings: TableSettings;
    @ValidateNested() gridSettings: GridSettings;
    @ValidateNested() simlulationSettings: SimulationSettings;
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
            if (data.simlulationSettings) {
                this.simlulationSettings = new SimulationSettings(data.simlulationSettings);
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
    simlulationSettings: SimulationSettings;
    tableSettings: { columns: string[] };
}
