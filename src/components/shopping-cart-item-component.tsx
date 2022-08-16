import { Card, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/shopping-cart-context";
import { currencyFormatter } from "../helpers/currency-formater";
import { orderItem } from "../models/data-models/order-item";

export function ShoppingCartItem(probs: any) {
  let _orderItem: orderItem = probs as orderItem;
  const {openShoppingCart,productCountInCart}=  useShoppingCart()
  function getOrderImagePath(item: orderItem): string {
    let imagePath = item.productId;
    imagePath = `./img/productimg/${imagePath}.png`;
    return imagePath;
  }

  return (
    <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
      <img
        src={getOrderImagePath(_orderItem)}
        style={{ width: "125px", height: "75px", objectFit: "cover" }}
      ></img>
      <div className="me-auto">
        <div>
          <h6>{`${_orderItem.product?.productName}   ${currencyFormatter(_orderItem.orderPrice)} x ${_orderItem.orderSize}`}`</h6>
        </div>
        <div className="me-auto d-flex align-items-center">
          Tax per item  { _orderItem.ordertax!.taxPercentage}
        </div>
        <div className="me-auto d-flex align-items-center">
            {currencyFormatter( _orderItem.orderPrice*_orderItem.orderSize + (_orderItem.orderPrice*_orderItem.orderSize)*((_orderItem.ordertax)?(_orderItem.ordertax.taxPercentage):(0)))}
        </div>
      </div>
    </Stack>
  );
}
