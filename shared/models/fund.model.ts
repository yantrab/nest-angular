// import { Poly } from './Entity';
// import { Yeilds, DailyData } from './security.model';
//
// export class FundManager {}
// export class Trustee {}
//
// export abstract class Fund extends Poly {
//     manager: FundManager;
//     yeilds: Yeilds;
//     fee: number;
//
//     /**
//      * שווי נכסים במיליוני ש"ח
//      */
//     numeralValue: number;
//
//     /**
//      * Only if fund have bonds.
//      */
//     duration: number;
//
//     /**
//      * מחיר קנייה
//      */
//     purchasePrice: number;
//
//     /**
//      * מחיר פדיון
//      */
//     redemptionPrice: number;
//
//     trustee: Trustee;
//
//     /**
//      * חשיפה
//      */
//     exposureProfile: string;
//
//     policy: string;
// }
//
// /**
//  * קרנות נאמנות
//  */
// export abstract class MF extends Fund {}
//
// /**
//  * קרנות נאמנות מחקות
//  */
// export class MTF extends MF {
//     /**
//      * מדיניות השקעה
//      */
//     policy = 'fullCommitment';
// }
//
// /**
//  * קרנות נאמנות לא מחקות
//  */
// export class NMTF extends MF {
//     /**
//      * מדיניות השקעה
//      */
//     policy = 'bestEffort';
// }
//
// /**
//  * קרנות סל נסחרות כל היום
//  */
// export class ETF extends MTF {
//     dailyData: DailyData;
// }
