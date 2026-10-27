create table if not exists public.frota_itens (
 id text primary key,
 prefixo text,
 situacao text,
 segmentacao text,
 ano_chegada integer,
 valor numeric(14,2),
 tipo text,
 segmento text,
 tipo_vtr text,
 marca text,
 modelo text,
 ano_fabricacao integer,
 ano_modelo integer,
 cor text,
 obm text,
 classificacao text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.frota_itens enable row level security;
-- Publico: somente INSERT. O dashboard nunca consulta diretamente esta tabela.
create policy "entrada_publica_insert" on public.frota_itens for insert to anon with check (true);
-- Não crie políticas anon de SELECT/UPDATE/DELETE.
