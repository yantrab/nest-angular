
import { IsString, ValidateNested, IsDate } from 'class-validator';
export class Category {
    @IsString()
    NameHebrew: string;
    @IsString()
    NameEnglish: string;
    @ValidateNested({ each: true })
    children: Category[] = [];
    @IsString()
    CatgID: string;
}

export class Series {
    @IsString()
    id: string;
    @IsString()
    hebName: string;
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
}

export class DataRequest {
    @IsString({ each: true })
    seriasIds: string[];
    @IsDate()
    from: Date;
    @IsDate()
    to: Date;
}
export class DataResult {
    @IsString()
    id: string;
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
