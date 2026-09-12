import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},type:{type:String,required:true},data:{type:mongoose.Schema.Types.Mixed,default:{}},createdAt:{type:Date,default:Date.now}},{timestamps:true});
export const ActivityEvent=mongoose.model('ActivityEvent',schema);
