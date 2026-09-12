import { ActivityEvent } from '../models/ActivityEvent.js';
export async function logActivity(req,res){const e=await ActivityEvent.create({userId:req.auth.sub,type:String(req.body.type||'activity'),data:req.body.data||{}}); res.status(201).json({id:e.id});}
