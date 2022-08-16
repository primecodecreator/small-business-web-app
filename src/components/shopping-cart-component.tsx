import React, { useEffect } from "react";
import { Button, Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/shopping-cart-context";
import { orderItem } from "../models/data-models/order-item";
import { orderSummary } from "../models/data-models/order-summary";
import { ShoppingCartItem } from "./shopping-cart-item-component";
import { orderSaveStatus } from "../models/request-response-models/order-save-response";
export function ShoppingCartComponent() {
  const {
    closeShoppingCart,
    isShoppingCartOpen,
    cartItems,
    currentCartOrderItems,
  } = useShoppingCart();
  const [checkOutOrderStatus, setCheckoutStatus] = React.useState<string>();
  let totalItemPrice: number = 0;
  let totalAddOnsTotalPrice: number = 0;
  function getTotalOrderPrice() {
    currentCartOrderItems.map((i) => {
      totalItemPrice = totalItemPrice + i.orderPrice;
    });
    currentCartOrderItems.map((i) => {
      totalAddOnsTotalPrice = totalAddOnsTotalPrice + (i.orderAddonPrice ?? 0);
    });
  }

  function checkoutOrder() {
    let productPrices = currentCartOrderItems.reduce(
      (totalItemPrice, orderItem) => {
        return totalItemPrice + orderItem.orderPrice * orderItem.orderSize + (orderItem.orderPrice * orderItem.orderSize) * (orderItem.ordertax?orderItem.ordertax.taxPercentage:0);
      },
      0
    );
    let AddOnsItemsPrices = currentCartOrderItems.reduce((sum, orderItem) => {
      return sum + (orderItem.orderAddonPrice ?? 0);
    }, 0);
    let tax = 0;
    let _orderSummary: orderSummary = {
      orderAddonsPrice: AddOnsItemsPrices,
      orderDate: Date.now.toString(),
      orderItem: currentCartOrderItems,
      orderPrice: productPrices,
      ordertaxPrice: tax,
      orderTotalPrice: productPrices + AddOnsItemsPrices + tax,
    };

    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentCartOrderItems),
    };
    fetch("http://localhost:1337/smallbusiness/saveorder/", requestOptions)
      .then((response) => response.json())
      .then((data) => setCheckoutStatus(data.message));
  }

  return (
    <>
      <Offcanvas
        placement="end"
        show={isShoppingCartOpen}
        onHide={closeShoppingCart}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Items Shopping List</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack gap={2}>
            {currentCartOrderItems.map((items, index) => (
              <ShoppingCartItem key={index} {...items}></ShoppingCartItem>
            ))}
            <div className="ms-auto  fs-8">
              Total Cost:{" "}
              {currentCartOrderItems.reduce((totalItemPrice, orderItem) => {
                return (
                  totalItemPrice + ((orderItem.orderPrice * orderItem.orderSize)+((orderItem.orderPrice * orderItem.orderSize) * (orderItem.ordertax?(orderItem.ordertax.taxPercentage):(0))))
                );
              }, 0)}
            </div>
            <div className="ms-auto  fs-8">
              Total Addon Cost:{" "}

      
              {currentCartOrderItems.reduce(
                (totalAddOnsTotalPrice, orderItem) => {
                  return (
                    totalAddOnsTotalPrice + (orderItem.orderAddonPrice ?? 0)
                  );
                },
                0
              )}
            </div>
            <div className="ms-auto fw-bold fs-5">
              Amount to Pay{" "}
              {currentCartOrderItems.reduce((totalItemPrice, orderItem) => {
                return (
                  totalItemPrice +
                  (orderItem.orderPrice * orderItem.orderSize +((orderItem.orderPrice*orderItem.orderSize) * (orderItem.ordertax?(orderItem.ordertax.taxPercentage):(0))) +
                    (orderItem.orderAddonPrice ?? 0))
                );
              }, 0)}
            </div>
            <div className="ms-auto fw-bold fs-5">
              <Button onClick={() => checkoutOrder()}>Check-Out to Pay</Button>
            </div>
            <div className="ms-auto fw-bold fs-5">{checkOutOrderStatus}</div>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
