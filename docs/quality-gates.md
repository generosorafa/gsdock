# Esteira de qualidade do GSDock

Este documento define os gates que uma mudança deve atravessar antes de entrar na branch principal. Ele complementa o `AGENTS.md`; em caso de divergência, ambos devem ser atualizados no mesmo PR.

## Princípios

1. Todo código entra por Pull Request vinculado a uma Issue.
2. Checks aplicáveis são bloqueantes e devem terminar com sucesso antes do merge.
3. A esteira começa rápida e cresce quando existe algo real para medir.
4. Ferramentas sobrepostas exigem uma escolha documentada, não instalação simultânea.
5. Falha intermitente é defeito da esteira ou do produto, não motivo para apertar “retry” até passar.
6. Segurança, privacidade, performance e recuperação fazem parte da definição de pronto.

## Gates por fase

| Gate | Quando ativa | Frequência | Bloqueante no PR |
|---|---|---|---|
| Governança do PR e integridade do diff | Agora | Todo PR | Sim |
| Build e typecheck | Primeiro código compilável | Todo PR | Sim |
| Biome | Projeto JavaScript/TypeScript | Todo PR | Sim |
| Commitlint | Primeiro `package.json` e convenção definida | Todo PR | Sim |
| Testes unitários | Primeira regra de negócio | Todo PR | Sim |
| Testes de integração | Primeiro banco, fila ou API externa | Todo PR | Sim nos módulos afetados |
| `arch-contract` | Camadas TypeScript e contratos estabilizados | Todo PR | Sim |
| Knip | Entrypoints e geração de código configurados | Todo PR | Sim após baseline confiável |
| Playwright smoke | Primeira interface executável | Todo PR | Sim nos fluxos críticos |
| Codecov | Relatório de cobertura disponível | Todo PR | Sim para cobertura do patch acordada |
| Stryker | Suíte unitária madura | Agendado e em módulos críticos | Gradual; bloqueante apenas onde estável |
| Playwright completo | Ambiente de homologação confiável | Agendado e pré-release | Sim para release |
| Endtest | Necessidade comprovada de cross-browser, no-code ou monitor sintético | Agendado e pré-release | Conforme ADR |
| Performance budget | Primeiro frontend/backend executável | Todo PR ou pré-release | Sim nos limites aprovados |
| Revisão de segurança | Superfície sensível alterada | Todo PR aplicável | Sim |

## Observabilidade

### Base

- Instrumentar backend, workers e integrações com OpenTelemetry para traces, métricas e logs correlacionáveis.
- Definir IDs de correlação que permitam investigar pedido, SKU, onda e sincronização sem registrar dado pessoal desnecessário.
- Medir latência, taxa de erro, throughput, backlog, retries, webhooks rejeitados e idade da última sincronização.
- Cada alerta deve possuir limite, janela, severidade, ação esperada e responsável.

OpenTelemetry gera e exporta telemetria, mas não substitui um backend de armazenamento e visualização. A escolha entre Sentry, Datadog e New Relic deve ser registrada em ADR considerando:

- erros de frontend e backend;
- traces, métricas, logs e experiência do usuário;
- suporte a OTLP e portabilidade;
- retenção, residência e mascaramento de dados;
- custo por volume e previsibilidade;
- esforço operacional e qualidade dos alertas.

Padrão: OpenTelemetry no backend e somente um provedor principal. Sentry pode ser escolhido quando error tracking e experiência de frontend forem prioritários; Datadog ou New Relic podem ser escolhidos quando uma suíte APM/infra mais ampla justificar custo e operação. Não enviar o mesmo sinal para três plataformas sem caso de uso aprovado.

## Qualidade estática

- **Biome:** formatação e lint de JavaScript, TypeScript, JSX, TSX, JSON, CSS e demais formatos suportados pelo projeto.
- **Commitlint:** padrão verificável de commits; ativar com a criação do workspace Node e validar o intervalo de commits do PR.
- **`arch-contract`:** limites entre domínio, aplicação, infraestrutura e apresentação; não substitui Biome.
- **Knip:** arquivos, exports e dependências sem uso. Corrigir entrypoints e plugins antes de adicionar ignores.
- **Stryker:** mutation testing para avaliar se as asserções detectam defeitos; limitar inicialmente a regras críticas para controlar duração e custo.

## Estratégia de testes

- **Unitários:** regras puras, cálculos, estados e idempotência.
- **Integração:** persistência, filas, adaptadores Bling, autenticação, webhooks e contratos internos.
- **End-to-end:** login, sincronização controlada, lista de separação, picking, conferência, divergência e recuperação.
- **Playwright:** automação versionada dos fluxos web críticos, com trace preservado na primeira repetição de falha em CI.
- **Codecov:** tendência e cobertura do patch; percentual não autoriza testes fracos.
- **Endtest:** complemento opcional para testes gerenciados, cross-browser ou monitoramento sintético. Não duplicar toda a suíte Playwright.

Fixtures não podem conter credenciais nem dados pessoais reais. Integração com Bling deve usar mocks contratuais ou ambiente seguro até existir autorização para escrita real.

## Segurança e operação

- Rate limit obrigatório no backend, com chave e limite adequados ao risco de cada rota.
- Autenticação, recuperação de conta e operações caras devem ter proteção mais restritiva.
- Webhooks precisam de autenticação, idempotência, limite de payload, timeout e proteção contra replay conforme o provedor permitir.
- Revisão de segurança é obrigatória para autenticação, autorização, sessão, segredos, PII, uploads, exportações, webhooks, estoque e integrações.
- Frontend e backend possuem configurações e deploys separados; segredo nunca entra no bundle do navegador.
- Performance budgets devem incluir pelo menos peso inicial do frontend, Core Web Vitals definidos, latência p95 de APIs críticas, duração de jobs e atraso máximo de sincronização.
- Termos de uso e política de privacidade precisam ser revisados e aprovados pelo jurídico antes da produção com usuários reais.

## Arquitetura sem desperdício

Antes de criar uma abstração ou componente:

1. Pesquisar componentes, hooks, serviços, utilitários e padrões existentes.
2. Verificar se composição, variante ou extensão resolve o caso.
3. Confirmar que a repetição possui a mesma semântica, não apenas código parecido.
4. Criar a menor unidade com responsabilidade clara e teste útil.
5. Registrar no PR por que uma nova peça foi necessária.

Não adotar microserviços, filas adicionais, cache, event sourcing, CQRS ou bancos extras sem volume, isolamento, resiliência ou risco que os justifique. Também não concentrar tudo em um módulo central sem limites: acompanhar N+1, payloads sem paginação, operações síncronas longas, contenção, backlog e limites do Bling.

## Exceções

Uma exceção temporária precisa conter:

- Issue vinculada;
- check afetado e motivo técnico;
- impacto e probabilidade;
- controle compensatório;
- responsável;
- prazo explícito;
- aprovação no PR.

Não existe exceção tácita. Falha de segurança crítica, segredo exposto, migração sem rollback ou risco de perda de dados bloqueiam o merge.

## Referências oficiais

- [OpenTelemetry](https://opentelemetry.io/docs/)
- [Biome](https://biomejs.dev/)
- [Commitlint](https://commitlint.js.org/)
- [ArchContract](https://github.com/leofmarciano/arch-contract)
- [Knip](https://knip.dev/)
- [StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/)
- [Playwright em CI](https://playwright.dev/docs/ci)
- [Codecov e GitHub Checks](https://docs.codecov.com/docs/github-checks)
- [Endtest](https://docs.endtest.io/introduction)
