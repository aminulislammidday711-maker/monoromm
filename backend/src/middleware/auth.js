import { verifyToken } from '../utils/auth.js';
export function requireAuth(req,res,next){
  try{const h=req.headers.authorization||''; if(!h.startsWith('Bearer ')) return res.status(401).json({error:'Authentication required'}); req.auth=verifyToken(h.slice(7)); next();}
  catch{return res.status(401).json({error:'Invalid or expired session'});}
}
export function requireAdmin(req,res,next){ if(req.auth?.role!=='admin') return res.status(403).json({error:'Admin access required'}); next(); }
