import crypto from 'crypto';
function sign(payload){const b=Buffer.from(JSON.stringify(payload)).toString('base64url');const sig=crypto.createHmac('sha256',process.env.SESSION_SECRET).update(b).digest('base64url');return b+'.'+sig}
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({ok:false});
 const {user,pass}=req.body||{};
 if(user!==(process.env.ADMIN_USER||'gestao') || pass!==process.env.ADMIN_PASSWORD) return res.status(401).json({ok:false});
 const token=sign({u:user,exp:Date.now()+8*60*60*1000});
 res.setHeader('Set-Cookie',`sisvtr_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`);
 return res.status(200).json({ok:true});
}
