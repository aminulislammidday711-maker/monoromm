import dotenv from 'dotenv';
dotenv.config();

function toOrigin(raw){
  try{ const u=new URL(raw); return `${u.protocol}//${u.host}`; }
  catch{ return raw.trim().replace(/\/$/,''); }
}

// GitHub Pages is the production frontend. FRONTEND_URL can still contain
// additional comma-separated origins for local/staging environments.
const configuredOrigins=(process.env.FRONTEND_URL||'')
  .split(',').map(s=>s.trim()).filter(Boolean).map(toOrigin);

const productionOrigins=[
  'https://aminulislammidday711-maker.github.io',
  'https://aminulislammiday711-maker.github.io'
];

export const env={
  port:Number(process.env.PORT||5000),
  mongoUri:process.env.MONGODB_URI||'',
  jwtSecret:process.env.JWT_SECRET||'dev-only-change-me',
  adminUsername:process.env.ADMIN_USERNAME||'admin',
  adminPassword:process.env.ADMIN_PASSWORD||'Aminul@1',
  frontendOrigins:[...new Set([...productionOrigins,...configuredOrigins,'http://localhost:5000','http://127.0.0.1:5000'])],
  nodeEnv:process.env.NODE_ENV||'development',
  smtpHost:process.env.SMTP_HOST||'',
  smtpPort:Number(process.env.SMTP_PORT||587),
  smtpUser:process.env.SMTP_USER||'',
  smtpPass:process.env.SMTP_PASS||'',
  smtpSecure:String(process.env.SMTP_SECURE||'false').toLowerCase()==='true',
  smtpFrom:process.env.SMTP_FROM||process.env.SMTP_USER||'',
};
