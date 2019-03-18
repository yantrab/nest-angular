import { Entity, Poly } from "./Entity";

export enum AssetLevelType {
  level1,
  level2
}

export class AssetType extends Entity{
    level:AssetLevelType;
    parent:AssetType;
}

export class Yeilds {
    daily: number;
    monthly: number;
    quarterly: number;
    yearly: number;
    threeYears: number;
    fiveYearsYield: number;
    max: number;
}

export class DailyData {
    base: number;
    opening: number;
    high: number;
    low: number;
    value: number;
}

export enum Currency {
    SHEKEL,
    DULAR
}

export class Market extends Entity {
    currency: Currency
}

export abstract class Asset extends Poly {

    yeilds?: Yeilds;
    dailyData?: DailyData;
    assetSummary: string;

    markets?: {market: Market, lastValue: number, lastDate:Date}[];

    get isNegotiable() {
        return this.markets && this.markets.length > 0;
    }

    get isDual() {
        return this.isNegotiable &&
            this.markets.find(m => m.market.currency === Currency.SHEKEL) &&
            this.markets.find(m => m.market.currency != Currency.SHEKEL);

    }

    type:AssetType;
}

export class Security extends Asset {}

export class Bond extends Asset {
    duration: number;
}

export class Option extends Asset {
    experationDate: Date;
}




export class FundManager { }
export class Trustee { }