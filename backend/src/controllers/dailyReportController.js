import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import { UserData } from '../models/UserData.js';
import { ActivityEvent } from '../models/ActivityEvent.js';
import { DailyReport } from '../models/DailyReport.js';
import { env } from '../config/env.js';

function localDateFromISO(iso){
  const d=new Date(iso);
  if(Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
}
function dayEvents(events,date){
  return events.filter(e=>String(e.data?.date||'')===date);
}
function uniqueEmails(data,key){
  const arr=data.find(x=>x.key===key)?.value;
  if(!Array.isArray(arr)) return [];
  return [...new Set(arr.map(x=>String(x?.email||'').trim().toLowerCase()).filter(Boolean))];
}
function buildReport(user,date,events,data){
  const day=dayEvents(events,date);
  const games=day.filter(e=>e.type==='game_completed');
  const medsTaken=day.filter(e=>e.type==='medicine_taken');
  const medsMissed=day.filter(e=>e.type==='medicine_missed');
  const hydration=day.filter(e=>e.type==='hydration_acknowledged');
  const routine=day.filter(e=>e.type==='routine_activity');
  const appts=day.filter(e=>e.type==='appointment_added');
  const completedRoutine=routine.filter(e=>e.data?.done===true).length;
  const routineTotal=Math.max(completedRoutine,12);
  const lines=[
    `Monorom daily routine report`,
    `User: ${user.name}`,
    `Date: ${date}`,
    ``,
    `My Daily Routine`,
    `• Routine activities completed: ${completedRoutine}`,
    `• Medicines taken: ${medsTaken.length}`,
    `• Medicines missed: ${medsMissed.length}`,
    `• Hydration acknowledgements: ${hydration.length}`,
    `• Appointments added: ${appts.length}`,
    ``,
    `Brain exercises`,
    `• Game sessions completed: ${games.length}`,
  ];
  if(games.length){
    for(const g of games.slice(0,30)) lines.push(`  - ${g.data?.game||'Brain exercise'}${g.data?.score!=null?` (score ${g.data.score})`:''}`);
  }
  lines.push('',`Overall recorded events: ${day.length}`,'',`This report was generated automatically by Monorom.`);
  return {text:lines.join('\n'),html:lines.map(x=>`<div>${x?x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'): '&nbsp;'}</div>`).join('')};
}
export async function finalizeDay(req,res){
  const date=String(req.body?.date||'').trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({error:'Invalid report date'});
  const user=await User.findById(req.auth.sub).select('name email').lean();
  if(!user) return res.status(404).json({error:'User not found'});
  const data=await UserData.find({userId:req.auth.sub,key:{$in:['famdoc_family','famdoc_doctors']}}).lean();
  const recipients=[...new Set([...uniqueEmails(data,'famdoc_family'),...uniqueEmails(data,'famdoc_doctors')])];
  const events=await ActivityEvent.find({userId:req.auth.sub}).sort({createdAt:1}).lean();
  const day=dayEvents(events,date);
  if(!day.length) return res.json({ok:true,sent:false,reason:'no-data',date});
  if(!recipients.length) return res.json({ok:true,sent:false,reason:'no-recipients',date});
  if(!env.smtpHost||!env.smtpUser||!env.smtpPass||!env.smtpFrom) return res.json({ok:true,sent:false,reason:'smtp-not-configured',date,recipients:recipients.length});
  const report=await DailyReport.findOneAndUpdate({userId:req.auth.sub,reportDate:date},{$setOnInsert:{userId:req.auth.sub,reportDate:date},$set:{updatedAt:new Date()}},{upsert:true,new:true});
  const pending=recipients.filter(e=>!report.sentTo.includes(e));
  if(!pending.length) return res.json({ok:true,sent:true,reason:'already-sent',date});
  const transporter=nodemailer.createTransport({host:env.smtpHost,port:env.smtpPort,secure:env.smtpSecure,auth:{user:env.smtpUser,pass:env.smtpPass}});
  const built=buildReport(user,date,events,data);
  const sent=[];
  for(const to of pending){
    try{
      await transporter.sendMail({from:env.smtpFrom,to,subject:`Monorom daily routine report — ${date}`,text:built.text,html:`<div style="font-family:Arial,sans-serif;line-height:1.6">${built.html}</div>`});
      sent.push(to);
      report.sentTo.push(to);
      await report.save();
    }catch(err){console.warn(`Daily report failed for ${to}:`,err.message);}
  }
  return res.json({ok:true,sent:sent.length>0,date,sentTo:sent,remaining:recipients.filter(e=>!report.sentTo.includes(e)).length});
}
