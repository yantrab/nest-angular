
import { Entity } from './Entity';
import { IsString, ValidateNested, IsDate, IsNumber } from 'class-validator';
export class Category extends Entity {
    @IsString()
    NameEnglish: string;
    @ValidateNested({ each: true })
    children: Category[] = [];
}

export class Series extends Entity {
    @IsString()
    hebTypeName: string;
    @IsDate()
    startDate: Date;
    @IsDate()
    endDate: Date;
    @IsString()
    sourceEnName: string;
    @IsString()
    unitEnName: string;
    @IsString()
    catalogPath: string;
    @IsString()
    categoryId: string;
}

export class DataRequest {
    @IsString({ each: true })
    seriasIds: string[];
    @IsNumber()
    from: number;
    @IsNumber()
    to: number;
    constructor(data: Partial<DataRequest>) {
        if (data.from) { this.from = data.from; }
        if (data.to) { this.to = data.to; }
        this.seriasIds = data.seriasIds;
    }
}
export class Data extends Entity {
    @ValidateNested()
    data: Array<{ timeStamp: number, value: number }>;
}

export class InitialData {
    @ValidateNested({ each: true })
    categories: Category[];
    @ValidateNested({ each: true })
    serias: Series[];
    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
