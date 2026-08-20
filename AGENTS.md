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

### Esteira obrigatória antes da branch principal

Nenhum código entra na branch principal sem Pull Request e sem os checks obrigatórios aplicáveis aprovados. A referência detalhada é [`docs/quality-gates.md`](docs/quality-gates.md).

A esteira cresce com o projeto, sem instalar ferramentas sem código para analisar:

- **Agora:** validar governança do PR, Issue vinculada, classificação, seções obrigatórias e integridade do diff.
- **Ao criar a stack:** build, typecheck, Biome, Commitlint, testes unitários e de integração tornam-se bloqueantes.
- **Com arquitetura TypeScript definida:** adotar `arch-contract` para dependências, camadas e ciclos, sem duplicar o papel do linter.
- **Com entrypoints estáveis:** ativar Knip para código, exports e dependências sem uso; corrigir configuração antes de suprimir achados.
- **Com fluxos web executáveis:** Playwright cobre smoke e jornadas críticas; Endtest só complementa cross-browser, no-code ou monitoramento quando houver benefício demonstrado.
- **Com cobertura real:** Codecov protege cobertura do patch; cobertura percentual não substitui qualidade das asserções.
- **Com suíte madura:** Stryker mede a capacidade dos testes encontrarem defeitos, preferencialmente em módulos críticos e execução agendada para não tornar todo PR lento.

OpenTelemetry é a base preferencial de instrumentação no backend. Sentry, Datadog e New Relic são backends ou plataformas sobrepostos: escolher um por ADR, custo, sinais necessários e operação; não instalar todos por padrão. Nenhuma telemetria pode expor segredos ou dados pessoais desnecessários.

Checks bloqueantes não podem ser ignorados silenciosamente. Exceção temporária exige Issue, justificativa, risco, controle compensatório, responsável, prazo de remoção e aprovação explícita no PR. Proteção da branch deve exigir PR e os checks estáveis assim que estiverem disponíveis na branch principal.

### Arquitetura e reutilização

- Separar frontend e backend por fronteira de segurança, responsabilidades, variáveis e artefatos de deploy; o navegador nunca acessa segredos ou tokens do Bling.
- Começar com a arquitetura mais simples que cumpra os requisitos atuais. Nova fila, serviço, banco, cache ou abstração precisa de gargalo medido ou risco concreto.
- Definir budgets numéricos de performance para interface, API, jobs e sincronização antes da primeira entrega executável e medi-los na esteira.
- Componentizar por responsabilidade e domínio desde o início, mantendo contratos pequenos e testáveis.
- Aplicar DRY quando houver repetição estável e semanticamente igual; não generalizar apenas porque dois trechos parecem semelhantes.
- Antes de criar componente, hook, serviço, utilitário ou padrão visual, pesquisar o repositório e o catálogo do design system. Estender ou compor o existente quando ele atender ao contrato.
- Não reconstruir componente existente com pequenas diferenças visuais. Se o componente atual não servir, documentar no PR por que composição, variante ou extensão não resolvem.
- Evitar módulos centrais que concentrem toda leitura, escrita ou integração. Medir latência, throughput, filas, concorrência, N+1, payload e limites externos antes de otimizar.

### Segurança, operação e requisitos legais

- Aplicar rate limit no backend por identidade, rota e risco, com limites específicos para autenticação, webhooks, exportações e operações caras; nunca confiar em limitação apenas no frontend.
- Mudanças em autenticação, autorização, segredos, dados pessoais, webhooks, estoque ou integrações externas exigem revisão de segurança e testes negativos.
- Termos de uso e política de privacidade precisam refletir o tratamento real de dados e ser revisados e aprovados por profissional jurídico qualificado antes de usuários reais ou produção. Agentes e desenvolvedores não podem declarar aprovação jurídica.
- Deploy exige observabilidade mínima, rollback, correlação, alertas acionáveis e responsável pela resposta.

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

### Movimento, carregamento e feedback

Toda interface nova ou alterada deve aplicar a skill **Design Motion Principles** em dois momentos:

1. **Create:** durante a implementação, para decidir se cada interação deve animar e como fazê-lo.
2. **Audit:** antes de retirar o PR de draft, para revisar a experiência como designer de produto sênior e corrigir tudo que parecer brusco, travado, genérico, inconsistente ou amador.

O GSDock é uma ferramenta operacional de alta frequência. A ponderação padrão é Emil Kowalski como perspectiva principal, Jakub Krehel como secundária e Jhey Tompkins somente em onboarding, estados vazios ou momentos raros de descoberta. A Issue deve justificar qualquer ponderação diferente.

Requisitos obrigatórios para interfaces:

- usar lazy loading em rotas, módulos pesados, mídia e dados não críticos quando reduzir o carregamento inicial sem atrasar a tarefa principal;
- manter navegação e controles críticos de separação disponíveis sem depender de carregamento tardio desnecessário;
- exibir skeleton screens que preservem a geometria aproximada do conteúdo final quando o carregamento tiver duração perceptível; não substituir todo carregamento por spinner genérico;
- oferecer entrada e saída suaves para telas, cards, modais, listas e estados condicionais quando isso comunicar continuidade; saídas devem ser mais discretas que entradas;
- aplicar o gate de frequência: ações repetidas muitas vezes por sessão devem ter movimento mínimo ou instantâneo, e ações iniciadas por teclado não devem ser animadas;
- mostrar progresso no próprio elemento que iniciou uma ação assíncrona, preservar sua largura, impedir envio duplicado e expor estado acessível com `aria-busy` ou equivalente;
- fornecer feedback visual inequívoco para sucesso, erro, aviso, seleção, foco, indisponibilidade, vazio, offline e tentativa de repetição;
- manter tokens consistentes de duração e easing no design system, normalmente entre 120 ms e 250 ms na área operacional e abaixo de 300 ms, salvo componente que justifique outro comportamento;
- usar spring sem bounce ou curva `cubic-bezier` deliberada; não usar `ease` ou `ease-in-out` genérico como padrão de produção;
- animar preferencialmente `transform`, `opacity`, `filter` ou `clip-path`; não animar `width`, `height`, `top`, `left`, margem ou padding quando houver alternativa sem reflow;
- garantir que transições acionadas repetidamente sejam interrompíveis e não formem filas ou saltos;
- respeitar `prefers-reduced-motion` em toda animação e manter tarefas plenamente compreensíveis e executáveis com movimento desativado;
- evitar parallax, zoom amplo, rotação, loops de atenção, pulsos contínuos, bounce decorativo, hover-scale em tudo e stagger excessivo;
- usar skeleton, progresso e animação para comunicar estado real; nunca simular avanço ou prolongar artificialmente uma espera.

Antes de considerar uma interface concluída, testar ao menos: carregamento lento, resposta vazia, erro e nova tentativa, operação rápida, cliques repetidos, navegação por teclado, viewport desktop e móvel e `prefers-reduced-motion: reduce`. O PR deve anexar evidência da revisão de motion e listar os problemas encontrados e corrigidos. Se ainda não existir interface executável, registrar **não aplicável** em vez de afirmar que ela foi auditada.

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
