import app from './app.js'; import {connectDB} from './config/database.js'; import {env} from './config/env.js';
try{await connectDB(); app.listen(env.port,()=>console.log(`Monorom API listening on ${env.port}`));}catch(err){console.error(err); process.exit(1);}
