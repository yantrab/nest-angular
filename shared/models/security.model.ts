// import { Entity, Poly } from './Entity';
//
// export enum AssetLevelType {
//     level1,
//     level2,
// }
//
// export class AssetType extends Entity {
//     @IsEnum(AssetLevelType)
//     level: AssetLevelType;
//     @ValidateNested()
//     parent: AssetType;
// }
//
// export class Yeilds {
//     @IsNumber()
//     daily: number;
//     @IsNumber()
//     monthly: number;
//     @IsNumber()
//     quarterly: number;
//     @IsNumber()
//     yearly: number;
//     @IsNumber()
//     threeYears: number;
//     @IsNumber()
//     fiveYearsYield: number;
//     @IsNumber()
//     max: number;
// }
//
// export class DailyData {
//     @IsNumber()
//     base: number;
//     @IsNumber()
//     opening: number;
//     @IsNumber()
//     high: number;
//     @IsNumber()
//     low: number;
//     @IsNumber()
//     value: number;
// }
//
// export enum Currency {
//     SHEKEL,
//     DULAR,
// }
//
// export class Market extends Entity {
//     @IsEnum(Currency)
//     currency: Currency;
// }
//
// export abstract class Asset extends Poly {
//     @IsOptional()
//     @ValidateNested()
//     yeilds?: Yeilds;
//     @IsOptional()
//     @ValidateNested()
//     dailyData?: DailyData;
//     @IsString()
//     assetSummary: string;
//
//     markets?: { market: Market; lastValue: number; lastDate: Date }[];
//
//     get isNegotiable() {
//         return this.markets && this.markets.length > 0;
//     }
//
//     get isDual() {
//         return (
//             this.isNegotiable &&
//             this.markets.find(m => m.market.currency === Currency.SHEKEL) &&
//             this.markets.find(m => m.market.currency != Currency.SHEKEL)
//         );
//     }
//
//     @ValidateNested()
//     type: AssetType;
// }
//
// export class Security extends Asset {}
//
// export class Bond extends Asset {
//     @IsNumber()
//     duration: number;
// }
//
// export class Option extends Asset {
//     @IsDate()
//     experationDate: Date;
// }
//
// export class FundManager {}
// export class Trustee {}
