import dotenv from 'dotenv';
dotenv.config();

// A CORS Origin header is always just scheme+host+port, never a path.
// If someone pastes a FRONTEND_URL with a trailing path or slash (e.g.
// "https://user.github.io/repo"), normalize it down to the bare origin
// ("https://user.github.io") so it still matches correctly instead of
// silently failing every CORS check.
function toOrigin(raw){
  try{ const u=new URL(raw); return `${u.protocol}//${u.host}`; }
  catch{ return raw.trim(); }
}

export const env={
  port:Number(process.env.PORT||5000),
  mongoUri:process.env.MONGODB_URI||'',
  jwtSecret:process.env.JWT_SECRET||'dev-only-change-me',
  adminUsername:process.env.ADMIN_USERNAME||'admin',
  adminPassword:process.env.ADMIN_PASSWORD||'Aminul@1',
  frontendOrigins:(process.env.FRONTEND_URL||'http://localhost:5000').split(',').map(s=>s.trim()).filter(Boolean).map(toOrigin),
  nodeEnv:process.env.NODE_ENV||'development'
};
