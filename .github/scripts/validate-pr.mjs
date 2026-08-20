import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const issueReference = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?|related to)\s+#\d+\b/i;

const requiredSections = [
  ["Issue relacionada", /^#{2,3}\s+issues? relacionadas?\s*$/im],
  ["O que mudou", /^#{2,3}\s+o que mudou\s*$/im],
  ["Como foi validado", /^#{2,3}\s+como foi validado\s*$/im],
  ["Riscos", /^#{2,3}\s+riscos\s*$/im],
  ["Limitações conhecidas", /^#{2,3}\s+limita(?:ç|c)(?:ões|oes) conhecidas\s*$/im],
  ["Próximos passos", /^#{2,3}\s+pr(?:ó|o)ximos passos\s*$/im],
];

function validatePullRequest(pullRequest) {
  const failures = [];
  const body = pullRequest?.body ?? "";

  if (!body.trim()) {
    failures.push("A descrição do Pull Request está vazia.");
    return failures;
  }

  if (!issueReference.test(body)) {
    failures.push("Use 'Closes #N' ou 'Related to #N' para vincular uma Issue.");
  }

  for (const [label, pattern] of requiredSections) {
    if (!pattern.test(body)) {
      failures.push(`Seção obrigatória ausente: ${label}.`);
    }
  }

  const checkedClassifications = [...body.matchAll(
    /^- \[x\]\s+(Correção|Melhoria|Nova função)\s*$/gim,
  )];

  if (checkedClassifications.length !== 1) {
    failures.push("Marque exatamente uma classificação: Correção, Melhoria ou Nova função.");
  }

  return failures;
}

function runSelfTest() {
  const validBody = `
## Issue relacionada
Related to #17
## Classificação
- [ ] Correção
- [x] Melhoria
- [ ] Nova função
## O que mudou
Validador criado.
## Como foi validado
Autoteste.
## Riscos
Baixo.
## Limitações conhecidas
Somente metadados.
## Próximos passos
Ativar checks da stack.
`;

  assert.deepEqual(validatePullRequest({ body: validBody }), []);
  assert.ok(validatePullRequest({ body: "" }).length > 0);
  assert.ok(validatePullRequest({ body: validBody.replace("Related to #17", "Sem issue") }).length > 0);
  assert.ok(validatePullRequest({ body: validBody.replace("- [x] Melhoria", "- [ ] Melhoria") }).length > 0);
  console.log("Self-test do validador de PR concluído com sucesso.");
}

function main() {
  const argument = process.argv[2];

  if (argument === "--self-test") {
    runSelfTest();
    return;
  }

  if (!argument) {
    throw new Error("Informe o caminho do evento do GitHub ou use --self-test.");
  }

  const event = JSON.parse(readFileSync(argument, "utf8"));
  const failures = validatePullRequest(event.pull_request);

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`::error title=Governança do PR::${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Governança do Pull Request validada com sucesso.");
}

main();
