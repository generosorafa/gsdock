## Issue relacionada

<!-- Use "Closes #N" apenas quando este PR concluir integralmente a Issue. -->

Related to #

## Classificação

- [ ] Correção
- [ ] Melhoria
- [ ] Nova função

## Resumo

<!-- Qual problema foi tratado e qual resultado este PR entrega? -->

## O que mudou

-

## Como foi validado

- [ ] Lido no código
- [ ] Conferido em arquivo
- [ ] Simulado
- [ ] Testado manualmente
- [ ] Coberto por teste automatizado
- [ ] Confirmado em homologação
- [ ] Confirmado em produção
- [ ] Ainda não verificado

### Evidências

<!-- Comandos, resultados, capturas, cenários e dados de teste sem informações sensíveis. -->

## Critérios de aceite

- [ ] Os critérios aplicáveis da Issue foram atendidos.
- [ ] Estados de erro, vazio, carregamento e recuperação foram considerados quando aplicáveis.
- [ ] O contexto permanente foi atualizado quando a decisão afetou o projeto.

### Interface, carregamento e movimento

<!-- Para PR sem interface, marque "Não aplicável" e explique nas evidências. -->

- [ ] Não aplicável: este PR não cria nem altera interface.
- [ ] Lazy loading foi aplicado onde reduz custo sem atrasar a tarefa principal.
- [ ] Skeletons preservam a geometria do conteúdo durante esperas perceptíveis.
- [ ] Ações assíncronas possuem progresso, bloqueio de duplicidade e feedback de sucesso ou erro.
- [ ] Entradas, saídas e transições são consistentes e proporcionais à frequência de uso.
- [ ] A experiência funciona por teclado e com `prefers-reduced-motion: reduce`.
- [ ] A interface foi revisada com a skill Design Motion Principles antes de sair de draft.
- [ ] Elementos bruscos, travados, genéricos, inconsistentes ou amadores encontrados na revisão foram corrigidos ou registrados como limitação.

### Evidências da revisão de interface

<!-- Informe navegadores/viewports, cenários, relatório de audit, capturas ou "Não aplicável". -->

## Esteira de qualidade

- [ ] O check de governança do PR passou.
- [ ] Build e typecheck passaram, quando aplicáveis.
- [ ] Lint e formatação passaram, quando aplicáveis.
- [ ] Testes unitários e de integração passaram, quando aplicáveis.
- [ ] Testes end-to-end dos fluxos afetados passaram, quando aplicáveis.
- [ ] Cobertura do patch e mutação foram avaliadas proporcionalmente ao risco.
- [ ] Contratos arquiteturais, código sem uso e dependências foram verificados quando as ferramentas estiverem habilitadas.
- [ ] Performance budget foi respeitado ou o impacto foi aprovado explicitamente.
- [ ] Segurança, rate limit, observabilidade e rollback foram avaliados.

### Reutilização e arquitetura

<!-- Quais componentes, hooks, serviços e utilitários existentes foram pesquisados? Por que criar algo novo foi necessário? -->

- [ ] Frontend e backend mantêm a fronteira de segurança e de responsabilidades.
- [ ] Não foi introduzida abstração, serviço, fila, cache ou dependência sem necessidade demonstrada.
- [ ] Componentes existentes foram reutilizados, compostos ou estendidos antes de criar equivalentes.
- [ ] Duplicação remanescente ou abstração adiada foi uma decisão consciente e registrada.

### Exceções temporárias

<!-- Se algum check aplicável não passou, informe Issue, justificativa, risco, controle compensatório, responsável e prazo. Não use esta seção para omitir falhas. -->

## Riscos

<!-- Possíveis efeitos adversos, impacto operacional, financeiro, técnico, de segurança ou privacidade. -->

## Limitações conhecidas

-

## Deploy

<!-- Dependências, ordem, migrações, variáveis e verificações pós-deploy. Use "Não aplicável" quando for o caso. -->

## Reversão

<!-- Como desfazer com segurança. -->

## Próximos passos

-

## Checklist final

- [ ] O diff contém somente mudanças relacionadas à Issue.
- [ ] Nenhum segredo ou dado pessoal foi incluído.
- [ ] Compatibilidade, migração e rollback foram avaliados.
- [ ] Riscos e itens ainda não verificados estão explícitos.
