import os, sys, math
import pandas as pd
import requests

EXCEL = sys.argv[1] if len(sys.argv)>1 else 'arquivo_pronto_para_dashboard.xlsx'
url=os.environ['SUPABASE_URL'].rstrip('/')
key=os.environ['SUPABASE_SERVICE_ROLE_KEY']
df=pd.read_excel(EXCEL)

def sv(r,c):
    v=r.get(c,'')
    return None if pd.isna(v) or str(v).strip()=='' else str(v)
def nv(r,c):
    v=r.get(c,'')
    try:
        if pd.isna(v) or str(v).strip()=='' or str(v).upper()=='INVALID': return None
        return float(v)
    except: return None

rows=[]
for _,r in df.iterrows():
    ident=sv(r,'IdSanitized')
    if not ident: continue
    rows.append({'id':ident,'prefixo':sv(r,'PrefixoSanitized'),'situacao':sv(r,'SituacaoSanitized'),'segmentacao':sv(r,'SegmentacaoSanitized'),'ano_chegada':int(nv(r,'AnoChegadaSanitized')) if nv(r,'AnoChegadaSanitized') is not None else None,'valor':nv(r,'ValorSanitized'),'tipo':sv(r,'TipoSanitized'),'segmento':sv(r,'SegmentoSanitized'),'tipo_vtr':sv(r,'TipoVtrSanitized'),'marca':sv(r,'MarcaSanitized'),'modelo':sv(r,'ModeloSanitized'),'ano_fabricacao':int(nv(r,'AnoFabricacaoSanitized')) if nv(r,'AnoFabricacaoSanitized') is not None else None,'ano_modelo':int(nv(r,'AnoModeloSanitized')) if nv(r,'AnoModeloSanitized') is not None else None,'cor':sv(r,'CorSanitized'),'obm':sv(r,'ObmSanitized'),'classificacao':sv(r,'ClassificacaoSanitized')})

for i in range(0,len(rows),200):
    batch=rows[i:i+200]
    r=requests.post(url+'/rest/v1/frota_itens',headers={'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'},json=batch,timeout=30)
    r.raise_for_status(); print(f'Importados {min(i+200,len(rows))}/{len(rows)}')
print('Concluído.')
