import { productDiscountType } from '../enums/product-discount-type';
export interface productDiscountDetail {
    discountType: productDiscountType;
    discountRatePercentage?: number;
    discountFlatePrice?: number;
}
