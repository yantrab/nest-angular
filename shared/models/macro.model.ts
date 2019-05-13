import { Entity } from './Entity';
import { IsString, ValidateNested, IsNumber, IsArray } from 'class-validator';
export class Category extends Entity {
    @IsString()
    NameEnglish: string;
    @ValidateNested({ each: true })
    children: Category[] = [];
    constructor(data?: Partial<Category>) {
        super(data);
        if (data && data.children) {
            this.children = data.children.map(c => new Category(c));
        }
    }
}

export class Series extends Entity {
    @IsString()
    hebTypeName: string;
    @IsNumber()
    startDate: number;
    @IsNumber()
    endDate: number;
    @IsNumber()
    lastUpdate: number;
    @IsString()
    sourceEnName: string;
    @IsString()
    unitEnName: string;
    @IsString()
    catalogPath: string;

    get title() {
        return this.name + ', ' + this._id;
    }
}

export class DataRequest {
    @IsString({ each: true })
    seriesIds: string[];
    @IsNumber()
    from: number;
    @IsNumber()
    to: number;
    constructor(data: Partial<DataRequest>) {
        if (data.from) {
            this.from = data.from;
        }
        if (data.to) {
            this.to = data.to;
        }
        this.seriesIds = data.seriesIds;
    }
}
export class DataItem {
    @IsNumber()
    timeStamp: number;
    @IsNumber()
    value: number;
}

export class Data extends Entity {
    @ValidateNested()
    data: DataItem[];
}
export class SeriesGroup extends Entity {
    @IsString({ each: true })
    seriesIds: string[];
}
export class UserSettings extends Entity {
    @ValidateNested({ each: true })
    userTemplates: SeriesGroup[];
    // constructor(data?) {
    //     super(data);
    //     if (data) {
    //         if (data.userTemplates) {
    //             this.userTemplates = data.userTemplates.map(t => new SeriesGroup(t));
    //         }
    //     }
    // }
}

export class InitialData {
    @ValidateNested({ each: true })
    categories: Category[];
    @ValidateNested({ each: true })
    series: Series[];
    @ValidateNested()
    userSettings: UserSettings;
    constructor(data?) {
        if (data) {
            if (data.categories) {
                this.categories = data.categories.map(c => new Category(c));
            }
            if (data.series) {
                this.series = data.series.map(c => new Series(c));
            }
            if (data.userSettings) {
                this.userSettings = new UserSettings(data.userSettings);
            }
        }
    }
}
