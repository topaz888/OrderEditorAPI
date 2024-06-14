import { shopify } from './app.js';


async function createDraftOrder(_draftOrder){
    try {
        const draftOrder = await shopify.draftOrder.create(_draftOrder); // Creating the product.
        return draftOrder; // Return the created product.
    } catch(error) {
        console.error(error); // Log any errors encountered.
        return error
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

async function removeItemFromOrder(_orderId, _lineItemId, user){
    try{
        const filterOrder = await filterLineItem(_orderId, _lineItemId, user);
        const updatedOrder = await shopify.order.update(_orderId, {
            note:"Customer contacted us about a custom engraving on this iPod"
          });
          console.log(updatedOrder)
          console.log("update")
        return updatedOrder;
    } catch(error) {
        console.error("Cancel Order: " + error)
        return error
    }
}

async function filterLineItem(_orderId, _lineItemId, user) {
    try{
        const order = await viewOrder(_orderId)
        if (order.customer.id !== user.customerId) {
            const error = new Error("Forbidden");
            error.status = 403;
            throw error;
        }
        const updatedLineItems = order.line_items.map(item => {
            if (item.id == _lineItemId) {
              return { ...item, quantity: 2 };
            }
            return item;
        })
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