import { shopify } from './app.js';

// GraphQL query to fetch order details
const ORDER_QUERY = 
`#graphql
  query getOrder($id: ID!) {
    order(id: $id) {
      name,
      id,
	  email,
      totalOutstandingSet{
        presentmentMoney {
          amount
        }
      }
    }
  }
`;

// GraphQL mutation to set line item quantity
const ORDER_EDIT_SET_QUANTITY_MUTATION = 
`#graphql
mutation orderEditSetQuantity($id: ID!, $lineItemId: ID!, $quantity: Int!) {
  orderEditSetQuantity(id: $id, lineItemId: $lineItemId, quantity: $quantity) {
    calculatedLineItem {
      # CalculatedLineItem fields
      id
    }
    calculatedOrder {
      # CalculatedOrder fields
      id
      lineItems(first: 5){
        edges{
          node{
            id
            quantity
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`;

const ORDER_EDIT_BEGIN_MUTATION = 
`#graphql
mutation orderEditBegin($id: ID!) {
    orderEditBegin(id: $id) {
      calculatedOrder {
        # CalculatedOrder fields
        id,
        lineItems(first: 10) {
          nodes {
            id,
            quantity
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ORDER_EDIT_COMMIT_MUTATION = 
`#graphql
mutation orderEditCommit($id: ID!) {
  orderEditCommit(id: $id) {
    order {
      # Order fields
      name,
      id,
	  customer{
        displayName,
        email,
        phone
      },
      totalOutstandingSet{
        presentmentMoney {
          amount
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`;


async function getOrderForGoogleSheet(_orderId) {
	const response = await shopify.graphql(
        ORDER_QUERY,
        {
            id: `gid://shopify/Order/${_orderId}`
        }
      );
      // console.log(response)
      if(response.data.order){
          const error = new Error("Forbidden");
          error.status = 403; 
          throw error
      }
    return response;
}

async function OrderEditBegin(_orderId) {
	const response = await shopify.graphql(
        ORDER_EDIT_BEGIN_MUTATION,
        {
            id: `gid://shopify/Order/${_orderId}`
        }
      );
      // console.log(response)
      const error = response.orderEditBegin.userErrors
      if(error.length){
          const error = new Error("Forbidden OrderEditBegin");
          error.status = 403; 
          throw error
      }
    return response;
}

async function OrderEdit(_calculatedOrderId, _lineItemId) {
    const response = await shopify.graphql(
        ORDER_EDIT_SET_QUANTITY_MUTATION, 
        {
            id: _calculatedOrderId,
            lineItemId: `gid://shopify/CalculatedLineItem/${_lineItemId}`,
            quantity: 0
        }
    );
    // console.log(response)
    const error = response.orderEditSetQuantity.userErrors
    if(error.length){
        const error = new Error("Forbidden");
        error.status = 403; 
        throw error
    }
    return response;
}

export async function OrderEditCommit(_calculatedOrderId) {
    const response = await shopify.graphql(
        ORDER_EDIT_COMMIT_MUTATION, 
        {   
            id: _calculatedOrderId,
        }
    )
    // console.log(response)
    const error = response.orderEditCommit.userErrors
    if(error.length){
        const error = new Error("Forbidden");
        error.status = 403; 
        throw error
    }
    return response;
}

async function OrderLineItemsCancel(_orderId, _lineItemId) {
    try {
        const OrderBegin = await OrderEditBegin(_orderId)
        const calculatedOrderId = OrderBegin.orderEditBegin.calculatedOrder.id
        if(!calculatedOrderId){
            const error = new Error("Forbidden calculatedOrderId");
            error.status = 403; 
            return error
        }
        await OrderEdit(calculatedOrderId, _lineItemId)
        const response = await OrderEditCommit(calculatedOrderId)
        return response
      } catch (error) {
        console.error('Error fetching order:', error);
        return error;
      }
}

export { OrderLineItemsCancel, getOrderForGoogleSheet } 