import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},mobile:{type:String,required:true,unique:true,index:true},email:{type:String,default:''},passwordHash:{type:String,required:true},role:{type:String,enum:['user','admin'],default:'user'},language:{type:String,enum:['en','bn','hi','as'],default:'en'},lastSeenAt:Date},{timestamps:true});
export const User=mongoose.model('User',schema);
