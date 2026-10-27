# SisVTR — Dashboard + Entrada de Dados + CRUD

Este projeto integra o dashboard atual (`public/index.html`) a uma base central no Supabase e cria uma página pública separada (`public/entrada.html`) para novos cadastros.

## Arquitetura
- `/` → dashboard administrativo, protegido por sessão de servidor.
- `/entrada.html?chave=SEU_TOKEN` → página exclusiva de entrada; não consulta nem mostra os dados existentes.
- `/api/login` → autenticação do gestor.
- `/api/logout` → encerra sessão.
- `/api/items` → listar, editar e excluir, somente para sessão autenticada.
- `/api/public-entry` → somente INSERT, protegido pelo token do link.
- `supabase.sql` → tabela e RLS.
- `scripts_import_excel.py` → importa a planilha atual para o Supabase sem colocar os dados no GitHub.

## 1. Supabase
1. Crie um projeto no Supabase.
2. Abra SQL Editor e execute `supabase.sql`.
3. Em Project Settings > API, copie a URL e a `service_role` key.
4. A `service_role` key NÃO deve ser colocada em `public/` nem no GitHub.

## 2. Variáveis na Vercel
Configure:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET` — segredo aleatório longo.
- `ADMIN_USER` — ex.: `gestao`.
- `ADMIN_PASSWORD` — senha forte do gestor.
- `ENTRY_TOKEN` — token longo para o link de entrada.
- `PUBLIC_ORIGIN` — URL do site, ex.: `https://sisvtr.vercel.app`.

## 3. Importar a base atual
Na sua máquina, mantenha `arquivo_pronto_para_dashboard.xlsx` fora do GitHub e execute:

```bash
pip install -r requirements.txt
set SUPABASE_URL=https://SEU-PROJETO.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
python scripts_import_excel.py arquivo_pronto_para_dashboard.xlsx
```

No PowerShell, use `$env:SUPABASE_URL=...` e `$env:SUPABASE_SERVICE_ROLE_KEY=...`.

## 4. GitHub
Suba o conteúdo deste projeto para um repositório privado no GitHub. NÃO envie `.env`, `service_role key` nem a planilha original.

## 5. Vercel
1. Vercel → Add New Project → Import Git Repository.
2. Selecione o repositório.
3. Não é necessário build command para esta estrutura.
4. Configure as Environment Variables.
5. Deploy.

## 6. Link de entrada
Depois do deploy, compartilhe SOMENTE:

`https://SEU-DOMINIO/entrada.html?chave=SEU_ENTRY_TOKEN`

Quem tiver esse link poderá enviar novos cadastros, mas não terá endpoint de leitura, edição ou exclusão.

## 7. Gestão
O gestor acessa `/`, faz login com `ADMIN_USER` + `ADMIN_PASSWORD`, filtra a base e pode editar/excluir os registros pelo painel de gerenciamento.

## Segurança
A senha e a chave do Supabase ficam no servidor da Vercel. A base central não é exposta ao navegador para leitura pública. O RLS bloqueia SELECT/UPDATE/DELETE para `anon`; o backend usa a service role exclusivamente no servidor.

Para uma publicação institucional, recomendo adicionar CAPTCHA/rate limiting no endpoint público e, posteriormente, migrar o login para SSO/Supabase Auth.
