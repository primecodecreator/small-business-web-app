import {  Button,  Card,  CardImg,  Form,  ToggleButtonGroup,  ToggleButton,} from "react-bootstrap";
import { productDetails } from "../models/data-models/product-details";
import { orderItem } from "../models/data-models/order-item";
import { currencyFormatter } from "../helpers/currency-formater";
import { useShoppingCart } from "../context/shopping-cart-context";
import { ProductType } from "../models/enums/product-type";
import { addOns } from "../models/data-models/product-addons";
import React from "react";
import { v4 as uuidv4 } from 'uuid';

export function ShopItemComponent(prop: any) {
  /**properties */
  let _productDetails: productDetails;
  let _selectedQuantity: number;
  let selectedAddOnId: string;

  const [isAddonChoosed, setisAddonChoosed] = React.useState(false);

  const {
    getItemSelectedQuantityInCart,
    addItemToCart,
    removeOneOutOfManyItemFromCart,
    removeItemFromCart,addOrderItemToCart,addOrderItemAddOnsToCart,removeOneOutOfManyOrderItemFromCart,getOrderSelectedQuantityInCart
  } = useShoppingCart();

  _productDetails = prop;

  let _orderItem: orderItem = {
    orderID: uuidv4(),
    productId:_productDetails.productId,
    product: _productDetails,
    orderPrice: _productDetails.price,
    orderAddons: [],
    ordertax: undefined,
    orderTotalPrice: 0,
    orderDate: Date.now.toString(),
    orderExtraInfoObjec: "", // stringify json
    orderSize: 0,
    perUnitPrice: 0,
  };
  const [currentOrderItem, setOrderItem] = React.useState<orderItem>(_orderItem);
  // setOrderItem(_orderItem);

  //_selectedQuantity = getItemSelectedQuantityInCart(_productDetails.productId);
  _selectedQuantity=getOrderSelectedQuantityInCart(_productDetails.productId)

  function addItemToOrder(product: productDetails) 
  {
    if (_selectedQuantity < product.maxOrderSize) 
    {
      addItemToCart(product.productId);
      let _orderItem: orderItem = {
        orderID: uuidv4(),
        productId:_productDetails.productId,
        product: _productDetails,
        orderPrice: _productDetails.price,
        orderAddons: [],
        ordertax: _productDetails.productTaxDetail,
        orderTotalPrice: 0,
        orderDate: Date.now.toString(),
        orderExtraInfoObjec: "", // stringify json
        orderSize: 0,
        perUnitPrice: 0,
      };
      addOrderItemToCart({..._orderItem});
    }
  }
  function removeOneItemFromOrder(product: productDetails) {
    removeOneOutOfManyItemFromCart(product.productId);
    removeOneOutOfManyOrderItemFromCart(product.productId)
  }
  function removeItemFromOrder(product: productDetails) {
    removeItemFromCart(product.productId);
  }

  /**private functions */
  function getPrice(): string {
    return currencyFormatter(_productDetails.price);
  }

  function getProductImagePath(): string {
    let imagePath = _productDetails.imageDetail!.thumbNailImg
      ? _productDetails.imageDetail!.thumbNailImg
      : _productDetails.productId;
    imagePath = `./img/productimg/${imagePath}.png`;
    return imagePath;
  }
  function setAddOnSelected(addOnId: string) {
    selectedAddOnId = addOnId;
  }
  function isAddOnselectedOnChange() {
    setisAddonChoosed(!isAddonChoosed);
  }

  function updateOrderItemByAddOn(addOnId: string): void {
    selectedAddOnId = addOnId;
    let _selectedAddOn = _productDetails.addOns?.find(
      (i) => i.addOnId == selectedAddOnId
    );
    if (_selectedAddOn) {
      currentOrderItem.orderAddons =[];
      currentOrderItem.orderAddons.push({..._selectedAddOn})
      //currentOrderItem?.orderAddons?.push(_selectedAddOn);
      currentOrderItem!.orderAddonPrice = _selectedAddOn.addOnPrice;
      currentOrderItem!.orderTotalPrice =
        currentOrderItem!.orderPrice + currentOrderItem!.orderAddonPrice;
    }
    setOrderItem({ ...currentOrderItem });
    addOrderItemAddOnsToCart({ ...currentOrderItem });
  }
  return (
    <>
      <Card>
        <Card.Img variant="top" src={getProductImagePath()} height="200px" />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
            <span className="ms-4">{_productDetails.productName}</span>
            <span className="d-flex justify-content-between align-items-baseline ms-4 text-muted">
              {getPrice()}
            </span>
          </Card.Title>
          <Card.Subtitle className="d-flex justify-content-between align-items-baseline mb-4 text-muted">
            <span className="ms-4">{_productDetails.productName}</span>
            <span className="d-flex justify-content-between align-items-baseline ms-4 text-muted">
              {getPrice()}
            </span>
          </Card.Subtitle>
          <Card.Subtitle className="d-flex justify-content-between align-items-baseline mb-4 text-muted">
            {currentOrderItem.orderAddons?.map((addon) => (
              <Card.Subtitle className="d-flex justify-content-between align-items-baseline mb-4 text-muted">
                <span className="ms-4"> {addon.addOnName} </span>
                <span className="d-flex justify-content-between align-items-baseline ms-4 text-muted">
                  {(currentOrderItem.orderAddonPrice?currencyFormatter( currentOrderItem.orderAddonPrice):null)}
                </span>
              </Card.Subtitle>
            ))}
          </Card.Subtitle>
          <div className="mt-auto">
            {_productDetails.maxOrderSize === 1 ? (
              <>
                <div className="d-flex justify-content-between align-items-baseline mb-8">
                  <Button
                    className="w-10 ms-4"
                    onClick={() => addItemToOrder(_productDetails)}
                  >
                    +Add To Cart
                  </Button>

                  <span className="ms-4">
                    <div className="fs-4">{_selectedQuantity}</div> in cart
                  </span>
                </div>
              </>
            ) : (
              <div
                className="d-flex align-items-center flex-column"
                style={{ gap: ".5rem" }}
              >
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ gap: ".5rem" }}
                >
                  <Button
                    onClick={() => removeOneItemFromOrder(_productDetails)}
                  >
                    -
                  </Button>
                  <div>
                    <span className="fs-4">{_selectedQuantity}</span> in cart
                  </div>
                  <Button onClick={() => addItemToOrder(_productDetails)}>
                    +
                  </Button>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeItemFromOrder(_productDetails)}
                >
                  Remove
                </Button>
                <span
                  className="fs-12"
                  color="red"
                  hidden={_productDetails.maxOrderSize > _selectedQuantity}
                >
                  maximum item can add {_productDetails.maxOrderSize}{" "}
                </span>
                <>
                  {_productDetails.prodctType == ProductType.Physical &&
                  _selectedQuantity > 0 ? (
                    <Form>
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="What to gift wrapp"
                        onChange={isAddOnselectedOnChange}
                      />
                      <>
                        {isAddonChoosed
                          ? _productDetails.addOns?.map((addon) => (
                              <>
                                <Form.Check
                                  inline
                                  label={`${
                                    addon.addOnName
                                  } ${currencyFormatter(addon.addOnPrice)}`}
                                  name="group1"
                                  type="radio"
                                  id="inline-radio-1"
                                  value={addon.addOnId}
                                  onChange={() =>
                                    updateOrderItemByAddOn(addon.addOnId)
                                  }

                                  //onChange={() => updateOrderItemBy_AddOn(addon.addOnId)}
                                />
                              </>
                            ))
                          : null}
                      </>
                    </Form>
                  ) : null}
                </>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>      
    </>
  );
}
