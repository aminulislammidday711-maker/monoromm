import { UserData } from '../models/UserData.js';
import { ActivityEvent } from '../models/ActivityEvent.js';
export async function push(req,res){const changes=Array.isArray(req.body?.changes)?req.body.changes:[]; const accepted=[]; for(const c of changes){if(!c?.key)continue; const when=new Date(c.updatedAt||Date.now()); const existing=await UserData.findOne({userId:req.auth.sub,key:c.key}); if(!existing||existing.updatedAt<when){await UserData.findOneAndUpdate({userId:req.auth.sub,key:c.key},{value:c.value,updatedAt:when},{upsert:true,new:true}); accepted.push(c.key);} } const events=Array.isArray(req.body?.events)?req.body.events:[]; for(const e of events.slice(-1200)){
   const eventId=e?.eventId?String(e.eventId):null;
   const payload={userId:req.auth.sub,eventId:eventId||undefined,type:String(e.type||'activity'),data:e.data||{},createdAt:new Date(e.createdAt||Date.now())};
   if(eventId) await ActivityEvent.updateOne({userId:req.auth.sub,eventId},{$setOnInsert:payload},{upsert:true});
   else await ActivityEvent.create(payload);
 } res.json({accepted,serverTime:new Date().toISOString()});}
export async function pull(req,res){const rows=await UserData.find({userId:req.auth.sub}).lean(); res.json({data:rows.map(r=>({key:r.key,value:r.value,updatedAt:r.updatedAt})),serverTime:new Date().toISOString()});}
