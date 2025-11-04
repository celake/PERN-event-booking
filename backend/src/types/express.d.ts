import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number; // JWT user ID injected by protectRoute
  }
}