import { authorized } from './_auth.js';
function auth(req){return authorized(req)}
async function supa(path,opts={}){return fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`,{...opts,headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json',...(opts.headers||{})}})}
export default async function handler(req,res){
 if(!auth(req)) return res.status(401).json({ok:false,error:'Não autorizado'});
 try{
  if(req.method==='GET'){const r=await supa('frota_itens?select=*&order=created_at.desc');const data=await r.json();return res.status(r.status).json(data)}
  if(req.method==='POST'){const r=await supa('frota_itens',{method:'POST',body:JSON.stringify(req.body),headers:{Prefer:'return=representation'}});const d=await r.json();return res.status(r.status).json(d)}
  if(req.method==='PATCH'){const id=encodeURIComponent(req.query.id);const r=await supa(`frota_itens?id=eq.${id}`,{method:'PATCH',body:JSON.stringify(req.body),headers:{Prefer:'return=representation'}});const d=await r.json();return res.status(r.status).json(d)}
  if(req.method==='DELETE'){const id=encodeURIComponent(req.query.id);const r=await supa(`frota_itens?id=eq.${id}`,{method:'DELETE'});return res.status(r.status).json({ok:r.ok})}
  return res.status(405).json({ok:false,error:'Método não permitido'})
 }catch(e){return res.status(500).json({ok:false,error:String(e)})}
}