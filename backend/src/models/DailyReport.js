import mongoose from 'mongoose';
const schema=new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
  reportDate:{type:String,required:true},
  sentTo:{type:[String],default:[]},
  createdAt:{type:Date,default:Date.now},
  updatedAt:{type:Date,default:Date.now}
},{timestamps:true});
schema.index({userId:1,reportDate:1},{unique:true});
export const DailyReport=mongoose.model('DailyReport',schema);
