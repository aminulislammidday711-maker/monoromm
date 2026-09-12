import { User } from '../models/User.js';
import { UserData } from '../models/UserData.js';
import { ActivityEvent } from '../models/ActivityEvent.js';
import { EmergencyAlert } from '../models/EmergencyAlert.js';
export async function dashboard(req,res){
 const users=await User.find({role:'user'}).select('-passwordHash').sort({name:1}).lean();
 const ids=users.map(u=>u._id);
 const [data,events,alerts]=await Promise.all([UserData.find({userId:{$in:ids}}).lean(),ActivityEvent.find({userId:{$in:ids}}).sort({createdAt:-1}).limit(500).lean(),EmergencyAlert.find({userId:{$in:ids}}).sort({createdAt:-1}).limit(200).lean()]);
 const by={}; for(const u of users) by[String(u._id)]={user:{id:u._id,name:u.name,mobile:u.mobile,email:u.email,language:u.language,lastSeenAt:u.lastSeenAt},data:{},activities:[],emergencies:[]};
 for(const d of data) if(by[String(d.userId)]) by[String(d.userId)].data[d.key]={value:d.value,updatedAt:d.updatedAt};
 for(const e of events) if(by[String(e.userId)]) by[String(e.userId)].activities.push({type:e.type,data:e.data,createdAt:e.createdAt});
 for(const a of alerts) if(by[String(a.userId)]) by[String(a.userId)].emergencies.push(a);
 res.json({users:Object.values(by),count:users.length,serverTime:new Date().toISOString()});
}
