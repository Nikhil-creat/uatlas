// Slack slash command: /askrepo owner/repo your question. Verifies Slack signatures. Env: SLACK_SIGNING_SECRET, GROQ_API_KEY
import http from 'node:http';import crypto from 'node:crypto';import {ask} from '../cli/ask-repo.mjs';
http.createServer((req,res)=>{let b='';req.on('data',d=>b+=d);req.on('end',async()=>{
const ts=req.headers['x-slack-request-timestamp'],got=req.headers['x-slack-signature']||'',sig='v0='+crypto.createHmac('sha256',process.env.SLACK_SIGNING_SECRET||'').update(`v0:${ts}:${b}`).digest('hex');
if(got.length!=sig.length||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(got))||Math.abs(Date.now()/1e3-ts)>300){res.statusCode=401;return res.end()}
const p=new URLSearchParams(b),[repo,...q]=(p.get('text')||'').split(' ');
res.setHeader('Content-Type','application/json');res.end(JSON.stringify({response_type:'in_channel',text:'Searching '+repo+'…'}));
const text=await ask(repo,q.join(' ')).catch(e=>'Error: '+e.message);
await fetch(p.get('response_url'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({response_type:'in_channel',text})})})}).listen(process.env.PORT||3000);
