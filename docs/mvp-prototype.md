# Protótipo operacional do MVP

## Objetivo

Validar a linguagem visual e os três fluxos mais importantes antes da integração real com o Bling:

1. entender a operação do dia no Dashboard;
2. separar as vendas consolidadas por SKU e quantidade;
3. localizar um produto por SKU, nome ou código de barras.

Os dados são integralmente fictícios. Este protótipo não contém credenciais, backend, persistência ou chamadas ao Bling.

## Telas e decisões

### Dashboard

- mostra pedidos, unidades, SKUs e exceções;
- evidencia o progresso da onda e problemas acionáveis;
- informa explicitamente que a sincronização é demonstrativa;
- encaminha cada indicador para a ação operacional correspondente.

### Separação do dia

- consolida pedidos em uma linha por SKU;
- mostra quantidade a pegar, endereço inicial e situação;
- confirma o item no próprio card, com bloqueio contra clique duplicado, progresso e feedback acessível;
- mantém exceções visíveis para estoque insuficiente e SKU sem endereço.

### Localização de estoque

- pesquisa SKU, nome, variante e código de barras;
- mostra saldo físico, reservado e disponível;
- lista estante, prateleira, caixa e posição em ordem de coleta;
- diferencia endereço de picking e reserva;
- explica a separação de responsabilidade: saldo por depósito no Bling e endereço detalhado no GSDock.

## Estados e movimento

- `Dados prontos`: conteúdo normal;
- `Carregando`: skeletons com geometria próxima do conteúdo final;
- `Sem dados`: orientação objetiva, sem animação decorativa;
- `Com erro`: recuperação no próprio botão, com largura estável e `aria-busy`;
- transições operacionais usam 160–220 ms e curva de saída deliberada;
- interações por teclado e `prefers-reduced-motion: reduce` desativam movimento não essencial;
- não há parallax, bounce, stagger, zoom amplo ou animações contínuas de atenção.

## Limites atuais

- não existe autenticação ou persistência;
- a confirmação da separação é mantida apenas em memória;
- leitura por câmera/leitor é apenas sinalizada como evolução;
- indicadores não representam dados reais e ainda não têm conexão com fórmulas de produção;
- backend e integração OAuth 2.0 com o Bling serão entregas independentes.

## Budget inicial de performance

O build falha quando ultrapassa qualquer limite abaixo, sempre medido comprimido com gzip:

- JavaScript inicial: 100 KiB;
- CSS inicial: 20 KiB;
- cada chunk JavaScript carregado sob demanda: 25 KiB.

Os limites cobrem o custo controlável neste protótipo. Métricas de rede e experiência, como LCP e INP, serão adicionadas quando houver ambiente publicado e backend representativo.
