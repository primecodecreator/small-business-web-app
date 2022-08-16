import { ProductType } from '../enums/product-type';
import { IProductBase } from './product-base';
import { addOns } from './product-addons';
import { productDiscountDetail } from './product-discount';
import { promoCode } from './product-promo-code';
import { imageDetail } from './image-detail';
import { productTaxDetail } from './product-tax-detail';

export interface productDetails extends IProductBase {
    productDescription: string;
    prodctType: ProductType;
    addOns?: addOns[];
    discount?: productDiscountDetail;
    maxDiscount: number;
    promoCode?: promoCode;
    imageDetail: imageDetail;
    minOrderSize: number;
    maxOrderSize: number;
    productTaxDetail: productTaxDetail;
}
