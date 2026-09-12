import bcrypt from 'bcryptjs'; import {connectDB} from '../config/database.js'; import {User} from '../models/User.js'; import {UserData} from '../models/UserData.js'; import {ActivityEvent} from '../models/ActivityEvent.js';
const names=['Ananya Das','Riya Sen','Arjun Dutta','Mitali Roy','Rahul Ghosh','Suman Chakraborty','Priya Bora','Debashish Sharma','Nandita Paul','Subhajit Mitra'];
await connectDB();
for(let i=0;i<names.length;i++){
 const mobile=String(9000000001+i), password=`User@${1000+i}`, language=['en','bn','hi','as'][i%4];
 const u=await User.findOneAndUpdate({mobile},{name:names[i],mobile,email:`user${i+1}@monorom.demo`,passwordHash:await bcrypt.hash(password,12),role:'user',language,lastSeenAt:new Date()},{upsert:true,new:true,setDefaultsOnInsert:true});
 await UserData.findOneAndUpdate({userId:u._id,key:'profile'},{value:{age:60+i,city:'Kolkata',demo:true},updatedAt:new Date()},{upsert:true});
 await UserData.findOneAndUpdate({userId:u._id,key:'routine_activities'},{value:{day:new Date().toISOString().slice(0,10),completed:[i%12,(i+2)%12]},updatedAt:new Date()},{upsert:true});
 await UserData.findOneAndUpdate({userId:u._id,key:'routine_water'},{value:{on:true,freqMinutes:60,nextDue:null},updatedAt:new Date()},{upsert:true});
 await ActivityEvent.create({userId:u._id,type:'demo_seed',data:{message:'Initial Monorom demo data created',language}});
 console.log(`${u.name}: ${mobile} / ${password}`);
}
console.log('10 demo users with initial stored data are ready'); process.exit(0);
