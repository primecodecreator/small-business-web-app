import { taxType } from '../enums/tax-type';
export interface productTaxDetail {
    taxType: taxType;
    taxPercentage: number;
}
