// Terminal copilot. GROQ_API_KEY=xxx node cli/ask-repo.mjs owner/repo "How does token refresh work?"  (Node 18+)
import {pathToFileURL} from 'node:url';
export async function ask(repo,q){
const gh=p=>fetch('https://api.github.com/repos/'+repo+p,{headers:{...(process.env.GH_TOKEN&&{Authorization:'Bearer '+process.env.GH_TOKEN})}}).then(r=>r.json());
const tree=(await gh('/git/trees/HEAD?recursive=1')).tree.filter(f=>f.type=='blob'&&f.size<50000&&/\.(js|ts|py|go|rs|java|md)$/i.test(f.path));
const words=q.toLowerCase().match(/[a-z0-9_]{3,}/g)||[];
const scored=tree.map(f=>({f,s:words.filter(w=>f.path.toLowerCase().includes(w)).length+(/readme/i.test(f.path)?1:0)})).sort((a,b)=>b.s-a.s).slice(0,4);
const files=await Promise.all(scored.map(async({f})=>`# ${f.path}\n`+(await(await fetch(`https://raw.githubusercontent.com/${repo}/HEAD/${f.path}`)).text()).slice(0,3000)));
const commits=(await gh('/commits?per_page=10')).map(c=>`${c.sha.slice(0,7)} ${c.commit.message.split('\n')[0]}`).join('\n');
const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+process.env.GROQ_API_KEY},body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'system',content:'Answer from the repo context only; cite file paths or commit hashes.'},{role:'user',content:files.join('\n\n')+'\n\nRecent commits:\n'+commits+'\n\nQuestion: '+q}]})});
return (await r.json()).choices[0].message.content}
if(import.meta.url===pathToFileURL(process.argv[1]).href){const [repo,...rest]=process.argv.slice(2);console.log(await ask(repo,rest.join(' ')))}
