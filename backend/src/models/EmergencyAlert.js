import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},status:{type:String,default:'triggered'},location:{type:mongoose.Schema.Types.Mixed,default:null},createdAt:{type:Date,default:Date.now}},{timestamps:true});
export const EmergencyAlert=mongoose.model('EmergencyAlert',schema);
