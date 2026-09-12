import { EmergencyAlert } from '../models/EmergencyAlert.js';
export async function createAlert(req,res){const a=await EmergencyAlert.create({userId:req.auth.sub,status:req.body.status||'triggered',location:req.body.location||null}); res.status(201).json({id:a.id,createdAt:a.createdAt});}
