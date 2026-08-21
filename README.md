# GSDock

Protótipo operacional para estoque físico e separação diária de vendas centralizadas no Bling.

## Protótipo atual

- dashboard operacional;
- separação diária consolidada por SKU;
- pesquisa de estoque por SKU, nome ou código de barras;
- múltiplas localizações por produto;
- estados demonstráveis de carregamento, vazio e erro.

Todos os dados da interface são fictícios. Não há integração, credencial ou escrita no Bling.

## Desenvolvimento

Requer Node.js 24 ou superior.

```bash
npm install
npm run dev
```

## Qualidade

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

Consulte `AGENTS.md` antes de implementar qualquer mudança.
