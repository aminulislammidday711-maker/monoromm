import mongoose from 'mongoose';
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},key:{type:String,required:true},value:{type:mongoose.Schema.Types.Mixed},updatedAt:{type:Date,default:Date.now}},{timestamps:true});
schema.index({userId:1,key:1},{unique:true});
export const UserData=mongoose.model('UserData',schema);
