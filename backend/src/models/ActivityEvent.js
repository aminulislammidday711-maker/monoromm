import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},eventId:{type:String,index:true,sparse:true},type:{type:String,required:true},data:{type:mongoose.Schema.Types.Mixed,default:{}},createdAt:{type:Date,default:Date.now}},{timestamps:true});
schema.index({userId:1,eventId:1},{unique:true,sparse:true});
export const ActivityEvent=mongoose.model('ActivityEvent',schema);
