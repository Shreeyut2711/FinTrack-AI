import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, ENV.JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(403).json({ success: false, error: 'Invalid or expired token' });
      }
      req.userId = decoded.id;
      req.userEmail = decoded.email;
      next();
    });
  } else {
    res.status(401).json({ success: false, error: 'Authorization token required' });
  }
};
