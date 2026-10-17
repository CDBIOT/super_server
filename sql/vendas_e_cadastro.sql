-- ============================================================================
-- Migração: vendas, fechamento de caixa e cadastro de produtos
-- Rode UMA vez no SQL Editor do Neon. É seguro rodar de novo (idempotente):
-- só cria/adiciona o que ainda não existe e não apaga nem altera dados.
-- ============================================================================

-- 1) Produtos: índice para a busca por código de barras (leitor do caixa)
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products (barcode);

-- 2) Vendas: a tabela e as colunas que a API usa
CREATE TABLE IF NOT EXISTS vendas (
  vendas_id       SERIAL PRIMARY KEY,
  caixa_id        INTEGER,
  itens           JSONB,
  total           NUMERIC(12,2) DEFAULT 0,
  forma_pagamento TEXT,
  criado_em       TIMESTAMPTZ DEFAULT NOW()
);

-- Se a tabela já existia com menos colunas, completa:
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS caixa_id        INTEGER;
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS itens           JSONB;
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS total           NUMERIC(12,2) DEFAULT 0;
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS forma_pagamento TEXT;
ALTER TABLE vendas ADD COLUMN IF NOT EXISTS criado_em       TIMESTAMPTZ DEFAULT NOW();

-- 3) Caixa: colunas usadas no fechamento
ALTER TABLE IF EXISTS caixa ADD COLUMN IF NOT EXISTS data_fechamento TIMESTAMPTZ;
ALTER TABLE IF EXISTS caixa ADD COLUMN IF NOT EXISTS valor_final     NUMERIC(12,2);

-- 4) Colunas antigas de 'vendas' (de um modelo anterior, 1 linha por produto)
--    que sejam NOT NULL e sem valor padrão travariam o INSERT novo. Torna-as
--    opcionais. Não apaga nada. Colunas que não puderem ser alteradas são ignoradas.
DO $$
DECLARE c RECORD;
BEGIN
  FOR c IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'vendas'
      AND is_nullable = 'NO'
      AND column_default IS NULL
      AND is_identity = 'NO'
      AND column_name NOT IN ('vendas_id', 'caixa_id', 'itens', 'total')
  LOOP
    BEGIN
      EXECUTE format('ALTER TABLE vendas ALTER COLUMN %I DROP NOT NULL', c.column_name);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

-- 5) Garante que o id gere valor sozinho (se a coluna não tiver DEFAULT, o INSERT
--    do cadastro de produto/venda falharia). Só age quando falta o DEFAULT.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = current_schema() AND table_name = 'products'
               AND column_name = 'id' AND column_default IS NULL AND is_identity = 'NO') THEN
    CREATE SEQUENCE IF NOT EXISTS products_id_seq OWNED BY products.id;
    PERFORM setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 0) + 1, false);
    ALTER TABLE products ALTER COLUMN id SET DEFAULT nextval('products_id_seq');
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = current_schema() AND table_name = 'vendas'
               AND column_name = 'vendas_id' AND column_default IS NULL AND is_identity = 'NO') THEN
    CREATE SEQUENCE IF NOT EXISTS vendas_vendas_id_seq OWNED BY vendas.vendas_id;
    PERFORM setval('vendas_vendas_id_seq', COALESCE((SELECT MAX(vendas_id) FROM vendas), 0) + 1, false);
    ALTER TABLE vendas ALTER COLUMN vendas_id SET DEFAULT nextval('vendas_vendas_id_seq');
  END IF;
END $$;

-- 6) Conferência: mostra as colunas finais das 3 tabelas
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = current_schema()
  AND table_name IN ('products', 'vendas', 'caixa')
ORDER BY table_name, ordinal_position;
