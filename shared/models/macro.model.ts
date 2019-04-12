
import { Entity } from './Entity';
import { IsString, ValidateNested, IsDate } from 'class-validator';
export class Category extends Entity {
    @IsString()
    NameEnglish: string;
    @ValidateNested({ each: true })
    children: Category[] = [];
}

export class Series extends Entity  {
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
    categoryId:string;
}

export class DataRequest {
    @IsString({ each: true })
    seriasIds: string[];
    @IsDate()
    from: Date;
    @IsDate()
    to: Date;
}
export class Data extends Entity {
    data: { date: Date, value: number };
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
