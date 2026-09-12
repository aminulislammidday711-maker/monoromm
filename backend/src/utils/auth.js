import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export function signUser(user){return jwt.sign({sub:String(user._id),role:user.role||'user',name:user.name},env.jwtSecret,{expiresIn:'30d'});}
export function signAdmin(){return jwt.sign({sub:'admin',role:'admin',name:'Administrator'},env.jwtSecret,{expiresIn:'12h'});}
export function verifyToken(token){return jwt.verify(token,env.jwtSecret);}
