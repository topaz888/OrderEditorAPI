import { shopify } from './app.js';


async function createDraftOrder(_draftOrder){
    try {
        const draftOrder = await shopify.draftOrder.create(_draftOrder); // Creating the product.
        return draftOrder; // Return the created product.
    } catch(error) {
        console.error(error); // Log any errors encountered.
    }
}

async function viewOrder(_order){
    try{
        const order = await shopify.order.get(_order)
        return order;
    } catch(error) {
        console.error("Retrieve Order: " + error)
        return error
    }
}

async function removeItemFromOrder(_orderId, _lineItemId){
    try{
        const filterOrder = await filterLineItem(_orderId, _lineItemId);
        const updatedOrder = await shopify.order.update(_orderId, {
            line_items: filterOrder
          });
        return updatedOrder;
    } catch(error) {
        console.error("Cancel Order: " + error)
        return error
    }
}

async function filterLineItem(_orderId, _lineItemId) {
    try{
        const order = await viewOrder(_orderId)
        const updatedLineItems = order.line_items.filter(item => item.id !== _lineItemId);
        return updatedLineItems;
    }catch(error) {
        return error
    }
  }

async function cancelOrder(_order){
    try{
        const order = await shopify.order.cancel(_order);
        return order;
    } catch(error) {
        console.error("Cancel Order: " + error)
        return error
    }
}


// Self-invoking async function to execute Shopify API calls.
async function sendAMockOrder(){
    // Create a new draftOrder.
    const draftOrder = await createDraftOrder({line_items:[{variant_id: 44388641079457,quantity:1}]});
    console.log(draftOrder);
}

async function cancelMockOrder(){
    // Create a new draftOrder.
    const order = await cancelOrder(6107465613473);
    console.log(order);
}


export { sendAMockOrder, cancelMockOrder, cancelOrder, viewOrder, removeItemFromOrder }