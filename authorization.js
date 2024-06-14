import Jwt from 'jsonwebtoken';
import { shopify } from './app.js';

const createTokens = async (_customerId) => {
  try {
    // console.log("createTokens")
      // Fetch customer details from Shopify Storefront API
      const response = await shopify.customer.get(_customerId);
      const payload = { customerId: response.id, email: response.email };
      const accessToken = Jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15m' });
      const refreshToken = Jwt.sign(payload, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' });
      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error)
      return error
    }
}

const createAccessToken = async (_customerId) => {
  try {
    // console.log("createToken")
      // Fetch customer details from Shopify Storefront API
      const response = await shopify.customer.get(_customerId);
      const payload = { customerId: response.id, email: response.email };
      const accessToken = Jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '15m' });
      // console.log("create token: ")
      return { accessToken };
    } catch (error) {
      console.log(error)
      return error
    }
}


  const verifyRefreshToken = (refreshToken) => {
    try {
      // console.log("verifyRefreshToken")
      Jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) return err
        const payload = { customerId: user.customerId, email: user.email };
        const tokens = createAccessToken(payload);
        return tokens
      });
    } catch (error) {
      return error;
    }
    
  }

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);
  Jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user;
    next();
  });
}

  export { verifyRefreshToken, createTokens, createAccessToken, authenticateToken }