'use client';
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || 'your-secret-key';

export const signToken = (payload: object) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export function isTokenValid(token: string) {
    const decodedToken = jwt.decode(token, { complete: true });
    const payload = decodedToken?.payload;
    let isValid = false;

    if (payload) {
        const exp = typeof payload === 'object' && 'exp' in payload ? payload.exp : undefined;
        const currentTime = Math.floor(Date.now() / 1000);
        isValid = typeof exp === 'number' && exp > currentTime;
    }
    return isValid
}