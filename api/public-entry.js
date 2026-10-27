export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({ok:false,error:'Método não permitido'});
 const allowedOrigin=process.env.PUBLIC_ORIGIN;
 if(allowedOrigin && req.headers.origin && req.headers.origin!==allowedOrigin) return res.status(403).json({ok:false,error:'Origem não autorizada'});
 const b=req.body||{};
 if(b.token !== process.env.ENTRY_TOKEN) return res.status(403).json({ok:false,error:'Link de entrada inválido ou expirado'});
 if(!b.Id) return res.status(400).json({ok:false,error:'ID é obrigatório'});
 const row={
   id:String(b.Id), prefixo:b.Prefixo||null, situacao:b.Situacao||null, segmentacao:b.Segmentacao||null,
   ano_chegada:b.AnoChegada?Number(b.AnoChegada):null, valor:b.Valor?Number(b.Valor):null, tipo:b.Tipo||null,
   segmento:b.Segmento||null, tipo_vtr:b.TipoVtr||null, marca:b.Marca||null, modelo:b.Modelo||null,
   ano_fabricacao:b.AnoFabricacao?Number(b.AnoFabricacao):null, ano_modelo:b.AnoModelo?Number(b.AnoModelo):null,
   cor:b.Cor||null, obm:b.Obm||null, classificacao:b.Classificacao||null
 };
 const r=await fetch(`${process.env.SUPABASE_URL}/rest/v1/frota_itens`,{
   method:'POST',headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(row)
 });
 if(!r.ok){const t=await r.text();return res.status(400).json({ok:false,error:t})}
 return res.status(200).json({ok:true});
}