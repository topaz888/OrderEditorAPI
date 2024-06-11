import Jwt from 'jsonwebtoken';
import { shopify } from './app.js';

const createToken = async (_customerId) => {
  try {
    console.log("createToken")
      // Fetch customer details from Shopify Storefront API
      const response = await shopify.customer.get(_customerId);
      const payload = { customerId: response.id, email: response.email };
      const token = Jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15m' });
      return token;
    } catch (error) {
      console.log(error)
      return error
    }
}


  const verifyCustomerToken = (customerId, token) => {
    try {
      Jwt.verify(token, process.env.API_SECRET, {
        subject: customerId,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("get token: "+ token)
    if (!token) {
      return res.sendStatus(403);
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  };

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);
  // console.log("get token: "+ token)

  Jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

  export { verifyCustomerToken, authenticateJWT, createToken, authenticateToken }