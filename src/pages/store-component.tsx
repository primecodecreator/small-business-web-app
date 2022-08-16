import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { ShopItemComponent } from "../components/shop-item-component";
import { productDetails } from "../models/data-models/product-details";
//import productList from "../data/product-list.json";
export function StoreComponent() {
  
//var productList:Array<productDetails>=[];
const[productList,setProductList]=useState<Array<productDetails>>([])
  /** fetch data */
useEffect(()=>{
  const getProductListURL='http://localhost:1337/smallbusiness/getallproduct';
  fetch(getProductListURL).then(
    res=>res.json()).then(
      (jsonRes)=>{setProductList( jsonRes)}
      )
},[]);

  return (
    <>
      
      <Row className='g-3' lg={4} md={3} xs={1}  >
        {productList.map((productItem) => (
          <Col id={productItem.productId}>
          <ShopItemComponent {...productItem}></ShopItemComponent>
          </Col>
        ))}
      </Row>
    </>
  );
}
