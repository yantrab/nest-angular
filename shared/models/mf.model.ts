import { DateRangeComboFilter, Filter, UserFilter } from './filter.model';
import { Entity } from './Entity';
import { ValidateNested, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

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
// a
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
    @IsString()
    name: string;
    @IsString()
    path: string;
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
    @IsOptional()
    @IsNumber()
    percent?: number;
}

export class CustomizeParameterGroup {
    @IsString()
    name: string;
    @IsOptional()
    @IsNumber()
    percent?: number;
    @IsOptional()
    previous?: number;
    @IsOptional()
    @ValidateNested({ each: true })
    parameters?: CustomizeParameter[];

    constructor(data?: Partial<CustomizeParameterGroup>) {
        Object.assign(this, data);
    }

    get activeParameters() {
        return this.parameters.filter(p => p.isActive);
    }
}

export class SimulationSettings {
    @ValidateNested()
    excludeFilter: Filter;
    @ValidateNested({ each: true })
    customizeParameters: CustomizeParameterGroup[];
    constructor(data: Partial<SimulationSettings>) {
        if (data) {
            Object.assign(this, data);
            if (data.excludeFilter) {
                this.excludeFilter = new DateRangeComboFilter(data.excludeFilter);
            }
            this.customizeParameters = data.customizeParameters.map(c => Object.assign(new CustomizeParameterGroup(), c));

            this.customizeParameters.forEach(cp => {
                if (!cp.percent) {
                    cp.percent = 25;
                    cp.activeParameters.forEach(p => (p.percent = 100 / cp.activeParameters.length));
                }
            });
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
export class Fund {
    [key: string]: any;
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
    @ValidateNested()
    gridSettings: GridSettings;
    @ValidateNested()
    simlulationSettings: SimulationSettings;
    tableSettings: { columns: string[] };
}
