import crypto from 'crypto';
export function authorized(req){
 const cookie=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('sisvtr_session='));
 if(!cookie)return false; const token=cookie.slice('sisvtr_session='.length);const [b,sig]=token.split('.');if(!b||!sig)return false;
 const expected=crypto.createHmac('sha256',process.env.SESSION_SECRET).update(b).digest('base64url');if(!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(expected)))return false;
 try{return JSON.parse(Buffer.from(b,'base64url').toString()).exp>Date.now()}catch{return false}
}
