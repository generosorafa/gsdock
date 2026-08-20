# GSDock — contexto e regras permanentes

Este arquivo é o contexto canônico do projeto. Todo agente, de qualquer modelo ou ferramenta, deve lê-lo integralmente antes de analisar, planejar ou implementar mudanças.

## Identidade do projeto

O GSDock é uma plataforma operacional própria para integrar vendas dos marketplaces centralizadas no Bling com estoque físico, endereçamento, separação, conferência, relatórios e indicadores.

O GSDock não é o GSCommerce. Não misture repositórios, escopos, credenciais, dados, Issues ou decisões dos dois projetos.

## Fase atual

Estamos na fase de fundação e descoberta do MVP. O primeiro produto deve resolver:

1. Integração segura com a API v3 do Bling.
2. Sincronização de produtos, SKUs, depósitos, saldos e pedidos elegíveis.
3. Cadastro da localização física de cada SKU.
4. Consolidação das vendas do período em uma lista de separação por SKU e endereço.
5. Execução, conferência, divergências, relatório e dashboard operacional básico.

Loja virtual, checkout, precificação avançada, fiscal, financeiro, anúncios e inteligência comercial são evoluções futuras. Não antecipar esses módulos sem Issue aprovada e evidência de prioridade.

## Fontes da verdade

| Entidade | Fonte da verdade inicial | Observação |
|---|---|---|
| Produto, SKU e vínculo operacional | Bling | O GSDock mantém réplica local sincronizada e IDs externos. |
| Depósito e saldo oficial | Bling | Não corrigir saldo real automaticamente. |
| Endereço físico detalhado | GSDock | Depósito, setor, corredor/fileira, estante, prateleira, caixa e posição. |
| Pedido de venda | Bling | O GSDock controla somente o fluxo interno de separação. |
| Onda, picking, conferência e divergência | GSDock | Manter histórico e auditoria. |
| Conteúdo visual e UX | GSDock | Identidade própria; referências não devem ser copiadas. |

Se uma nova entidade admitir mais de uma fonte editável, a Issue e o PR devem definir precedência, reconciliação e auditoria antes da implementação.

## Fluxo obrigatório de trabalho

Toda alteração deve seguir esta sequência:

1. Inspecionar o estado atual e preservar o que funciona.
2. Relacionar a tarefa a uma Issue existente ou criar uma nova Issue antes de implementar.
3. Classificar a Issue como **Correção**, **Melhoria** ou **Nova função**.
4. Registrar problema, evidência, escopo, critérios de aceite, validação, riscos e dependências.
5. Criar uma branch específica a partir da branch principal atualizada.
6. Implementar somente o escopo da Issue.
7. Validar proporcionalmente ao risco.
8. Revisar o diff e garantir que não há arquivos ou mudanças não relacionados.
9. Entregar por Pull Request; não implementar diretamente na branch principal.
10. Fazer deploy somente após o PR aprovado, validações concluídas e autorização correspondente.

Não agrupar mudanças sem relação no mesmo PR. Uma Issue pode ter mais de um PR quando a entrega for incremental, mas cada PR deve declarar claramente o recorte entregue.

### Classificações

- **Correção:** defeito comprovado ou regressão. Deve conter reprodução, comportamento esperado e evidência da causa.
- **Melhoria:** aprimora desempenho, segurança, qualidade, manutenção, observabilidade, UX ou processo existente.
- **Nova função:** adiciona capacidade que ainda não existe. Deve explicitar valor, usuário, escopo e fora de escopo.

Não criar Issues artificiais de Correção sem defeito observado.

### Branches

Use nomes curtos e rastreáveis:

- `fix/<numero>-<resumo>`
- `improvement/<numero>-<resumo>`
- `feature/<numero>-<resumo>`
- `docs/<numero>-<resumo>`

## Requisitos de todo Pull Request

Todo PR deve conter obrigatoriamente:

- Issue relacionada; use `Closes #N` somente quando o PR realmente concluir a Issue.
- Classificação da entrega.
- Resumo do problema e do resultado.
- Explicação objetiva do que mudou.
- Como foi validado e o nível de verificação alcançado.
- Evidências relevantes, como testes, capturas ou saídas de comandos.
- Riscos e efeitos adversos possíveis.
- Limitações conhecidas.
- Próximos passos.
- Plano de deploy, quando aplicável.
- Plano de rollback ou reversão.

O PR deve permanecer como draft enquanto houver implementação, validação ou documentação obrigatória pendente.

## Validação e qualidade

Diferencie explicitamente:

- Lido no código.
- Conferido em arquivo.
- Simulado.
- Testado manualmente.
- Coberto por teste automatizado.
- Confirmado em homologação.
- Confirmado em produção.
- Ainda não verificado.

Fluxos críticos devem testar casos normais, duplicidade, reprocessamento, cancelamento, dados ausentes, concorrência, timeout e recuperação.

Nenhum dashboard está concluído sem fórmula, fonte, frequência, responsável, estado de dado desatualizado e ação esperada para cada indicador.

## Integração com o Bling

- Usar API v3, OAuth 2.0 e JWT conforme documentação oficial atual.
- Fazer troca e renovação de tokens exclusivamente no backend.
- Nunca expor `client_secret`, access token ou refresh token no frontend, repositório ou logs.
- Solicitar apenas os escopos necessários.
- Respeitar limites atuais da API e tratar `429` com backoff.
- Preferir webhooks com validação HMAC, processamento assíncrono, idempotência e reconciliação periódica.
- Tratar eventos duplicados e fora de ordem.
- Não considerar uma integração concluída apenas porque uma chamada isolada funcionou.
- Não escrever estoque, pedido, financeiro ou fiscal real sem autorização explícita, plano de teste e reversão.

Antes de implementar, reconfirmar na documentação oficial qualquer limite, endpoint, campo, regra ou disponibilidade por plano que possa ter mudado.

## Regras operacionais iniciais

- O fuso operacional padrão é `America/Sao_Paulo`.
- A lista de separação deve usar somente pedidos em situações explicitamente configuradas como elegíveis.
- Pedidos cancelados, devolvidos ou já processados não podem entrar novamente sem ação auditada.
- A consolidação deve ser reproduzível e matematicamente reconciliável com os itens de origem.
- SKU ausente, duplicado, sem localização ou com saldo insuficiente deve ser tratado como exceção visível.
- O Bling controla saldo por depósito; o endereço de estante, prateleira e caixa pertence ao GSDock.
- Não executar baixa de estoque por duas fontes diferentes.

## Segurança e privacidade

- Privilégio mínimo e segregação entre operador e administrador.
- Dados pessoais de pedidos devem ser minimizados, protegidos e retidos apenas pelo necessário.
- Fixtures e testes não devem usar dados pessoais ou credenciais reais.
- Logs devem permitir correlação sem revelar segredos ou dados pessoais desnecessários.
- Ações críticas precisam de autor, horário, contexto e antes/depois.
- Toda automação deve possuir pausa, reprocessamento e reversão proporcional ao risco.

## UX e referência visual

A primeira referência visual aprovada é [CargoOS](https://cargoos.com.br/), pelos seguintes princípios:

- interface clara, profissional e tecnológica;
- fundo leve com grade discreta;
- tipografia legível e boa hierarquia;
- cards com bordas finas, pouco sombreado e cantos arredondados;
- cor de destaque usada com moderação;
- dados densos apresentados com espaço e explicação;
- estados e ações muito claros.

O GSDock deve ter identidade própria. A área operacional precisa ser mais rápida e densa que uma landing page e deve priorizar leitura, comparação, teclado, repetição e prevenção de erro.

Telas iniciais previstas: Dashboard, Separação do dia, Endereçamento, Produtos, Divergências e Integrações.

## Priorização

- **P0:** perda de dados, fraude, invasão, ilegalidade ou operação crítica parada.
- **P1:** falha importante, risco operacional relevante ou bloqueio do MVP.
- **P2:** ganho importante de produtividade, controle ou qualidade.
- **P3:** refinamento ou experimento.
- **P4:** hipótese futura sem evidência suficiente.

Cada ciclo deve ter no máximo três objetivos principais, com responsáveis, critérios de aceite, testes, métricas e reversão.

## Manutenção deste contexto

Atualize este arquivo no mesmo PR quando a mudança alterar visão, escopo, arquitetura, fontes da verdade, processo, riscos, segurança ou decisões permanentes. Mudanças apenas documentais também precisam de Issue e PR.

Em caso de conflito, registre a decisão na Issue e no PR. Não silencie incertezas nem transforme hipótese em fato.
