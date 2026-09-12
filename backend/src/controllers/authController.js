import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signUser, signAdmin } from '../utils/auth.js';
import { env } from '../config/env.js';
import { loginSchema,registerSchema } from '../utils/validation.js';
export async function register(req,res){const p=registerSchema.parse(req.body); if(await User.findOne({mobile:p.mobile})) return res.status(409).json({error:'Mobile number already registered'}); const u=await User.create({name:p.name,mobile:p.mobile,email:p.email||'',passwordHash:await bcrypt.hash(p.password,12)}); res.status(201).json({token:signUser(u),user:{id:u.id,name:u.name,mobile:u.mobile,email:u.email,language:u.language}});}
export async function login(req,res){const p=loginSchema.parse(req.body); const u=await User.findOne({mobile:p.mobile}); if(!u||!(await bcrypt.compare(p.password,u.passwordHash))) return res.status(401).json({error:'Incorrect mobile number or password'}); u.lastSeenAt=new Date(); await u.save(); res.json({token:signUser(u),user:{id:u.id,name:u.name,mobile:u.mobile,email:u.email,language:u.language}});}
export async function adminLogin(req,res){const {username,password}=req.body||{}; if(username!==env.adminUsername||password!==env.adminPassword) return res.status(401).json({error:'Incorrect admin credentials'}); res.json({token:signAdmin(),admin:{name:'Administrator',username:env.adminUsername}});}
