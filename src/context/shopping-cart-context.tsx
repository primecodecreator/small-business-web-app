import { type } from "@testing-library/user-event/dist/type";
import { createContext, ReactNode, useContext, useState } from "react";
import { orderItem } from "../models/data-models/order-item";
import { orderSummary } from "../models/data-models/order-summary";
import { addOns } from "../models/data-models/product-addons";
import { productDetails } from "../models/data-models/product-details";
import { productTaxDetail } from "../models/data-models/product-tax-detail";
import {taxType} from '../models/enums/tax-type';
import {productDiscountType} from '../models/enums/product-discount-type';
import { ShoppingCartComponent } from "../components/shopping-cart-component";
type shoppingCartProviderProps={children:ReactNode};

type ShoppingCartContext={
    getItemSelectedQuantityInCart:(id:string)=>number
    
    addItemToCart:(id:string)=>void
    removeOneOutOfManyItemFromCart:(id:string)=>void
    removeItemFromCart:(id:string)=>void

    openShoppingCart:()=>void
    closeShoppingCart:()=>void
    isShoppingCartOpen:boolean
    productCountInCart:number
    orderItemCountInCart:number
    cartItems:CartItem[]
    currentCartOrderItems:orderItem[]
    addOrderItemToCart:(_orderItem:orderItem)=>void
    addOrderItemAddOnsToCart:(_orderItem:orderItem)=>void
    removeOneOutOfManyOrderItemFromCart:(_productId:string)=>void
    getOrderSelectedQuantityInCart:(_productId:string)=>number
}

type CartItem={ 
    productId:string
    selectedQuantity:number
}
type OrderItem= {
    orderID: string;
    productId:string;
    product?: productDetails;
    orderPrice: number;
    orderAddons?: addOns[];
    ordertax?: productTaxDetail;
    orderTotalPrice?: number;
    orderDate?: string;
    orderExtraInfoObjec?: string; // stringify json
    orderSize:number;
    perUnitPrice?:number;
}
const shoppingCartContext=createContext({} as ShoppingCartContext);

export function useShoppingCart()
{
    return useContext(shoppingCartContext);
}

export function ShoppingCartProvider({children}:shoppingCartProviderProps)
{
    const [cartItems,setCartItems] = useState<CartItem[]>([]);
    const [currentCartOrderItems,setCartOrderItems] = useState<OrderItem[]>([]);
    const [isShoppingCartOpen,setIsShoppingCartOpen]=useState(false);
    //const [isShoppingCartClose,setIsCartOpen]=useState(false);
    const productCountInCart=cartItems.reduce((quantity,item)=>item.selectedQuantity+quantity,0)
    const orderItemCountInCart=currentCartOrderItems.reduce((quantity,item)=>item.orderSize+quantity,0)
    function openShoppingCart(){
        return setIsShoppingCartOpen(true);
    }
    function closeShoppingCart(){
        return setIsShoppingCartOpen(false);
    }

    function getItemSelectedQuantityInCart(id:string)
    {
        return cartItems.find(item=>item.productId===id)?.selectedQuantity||0;
    }

    function addItemToCart(id:string)
    {
        setCartItems(currentCartItems=>{
        if(currentCartItems.find(item=>item.productId===id)==null)
        {
            return [...currentCartItems,{productId:id,selectedQuantity:1 }]
        }
        else
        {
            return currentCartItems.map(item=>{
                if(item.productId===id){
                   return {...item,selectedQuantity:item.selectedQuantity++} 
                }
                else{
                   return item;
                }
            });
            
        }
        });
        
    }
    function removeOneOutOfManyItemFromCart(id:string){
       
        setCartItems(currentCartItems=>{
        if(currentCartItems.find(item=>item.productId===id)?.selectedQuantity===1)
        {
            return currentCartItems.filter(item=>item.productId!==id)
        }
        else
        {
            return currentCartItems.map(item=>{
                if(item.productId===id){
                   return {...item,selectedQuantity:item.selectedQuantity--} 
                }
                else{
                    return item;
                }
            });
            
        }
        });
        
    }

    
    function getOrderSelectedQuantityInCart(_productId:string)
    {
        return currentCartOrderItems.find(item=>item.productId===_productId)?.orderSize||0;
    }
    function addOrderItemToCart(_orderItem:orderItem)
    {
        setCartOrderItems(currentCartOrderItems=>{
        if(currentCartOrderItems.find(item=>item.productId===_orderItem.productId)==null)
        {
            return [...currentCartOrderItems,{..._orderItem,orderSize:_orderItem.orderSize++,orderAddons:_orderItem.orderAddons,orderAddonPrice:_orderItem.orderAddonPrice}];
        }
        else
        {
            return currentCartOrderItems.map(item=>{
                if(item.productId===_orderItem.productId){
                   return {...item,orderSize:item.orderSize++,orderAddons:_orderItem.orderAddons,orderAddonPrice:_orderItem.orderAddonPrice} 
                }
                else{
                   return item;
                }
            });
            
        }
        });
        
    }
    
    function addOrderItemAddOnsToCart(_orderItem:orderItem)
    {
        setCartOrderItems(currentCartOrderItems=>{
        if(currentCartOrderItems.find(item=>item.productId===_orderItem.productId)==null)
        {
            return [...currentCartOrderItems,{..._orderItem,orderAddons:_orderItem.orderAddons,orderAddonPrice:_orderItem.orderAddonPrice}];
        }
        else
        {
            return currentCartOrderItems.map(item=>{
                if(item.productId===_orderItem.productId){
                   return {...item,orderAddons:_orderItem.orderAddons,orderAddonPrice:_orderItem.orderAddonPrice} 
                }
                else{
                   return item;
                }
            });
            
        }
        });
        
    }
    function removeOneOutOfManyOrderItemFromCart(_productId:string){
       
        setCartOrderItems(currentCartOrderItems=>{
            if(currentCartOrderItems.find(item=>item.productId===_productId)?.orderSize===1)
            {
                return currentCartOrderItems.filter(item=>item.productId!=_productId)
            }
            else
            {
                return currentCartOrderItems.map(item=>{
                    if(item.productId===_productId){
                       return {...item,selectedQuantity:item.orderSize--} 
                    }
                    else{
                        return item;
                    }
                });
                
            }
            });
        
    }

    function removeItemFromCart(id:string){

        setCartItems(currentCartItems=>{
            
            return currentCartItems.filter(item=>item.productId!=id)
        
    })
    }

    function updateOrderSummary(_productDetails:productDetails){


    }

return (
    <shoppingCartContext.Provider value={{
        getItemSelectedQuantityInCart,
        addItemToCart,
        removeOneOutOfManyItemFromCart,
        removeItemFromCart,
        cartItems,
        productCountInCart,
        openShoppingCart,
        closeShoppingCart,
        isShoppingCartOpen,
        addOrderItemToCart,addOrderItemAddOnsToCart,
        removeOneOutOfManyOrderItemFromCart,
        currentCartOrderItems,getOrderSelectedQuantityInCart,orderItemCountInCart
        }}>
        {children}
        <ShoppingCartComponent></ShoppingCartComponent>
    </shoppingCartContext.Provider>
)

}