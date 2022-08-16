import { orderItem } from './order-item';
import { addOns } from './product-addons';
import { productDetails } from './product-details';
import { productTaxDetail } from './product-tax-detail';

export interface orderSummary {
    orderItem: orderItem[];
   // product: productDetails;
    orderPrice: number;
    orderAddonsPrice: number;
    ordertaxPrice: number;
    orderTotalPrice: number;
    orderDate: string;
    orderExtraInfoObjec?: string; 
}
