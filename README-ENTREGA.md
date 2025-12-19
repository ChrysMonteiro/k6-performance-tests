# ENTREGA - PGATS Automação Web (Preparado para submissão)

Este pacote foi preparado a partir do repositório base do professor e contém ajustes para execução em CI e instruções de entrega.

## Alterações realizadas
- Adicionados scripts em `package.json`:
  - `npm run cy:run` — Executa os testes headless com o reporter mochawesome, gravando resultados em `reports/`.
  - `npm run test` — Alias para `cy:run`.
  - `npm run posttest` — Mescla e gera HTML (usa `npx mochawesome-merge` e `npx marge`).

- Adicionado workflow GitHub Actions em `.github/workflows/ci.yml` para:
  - Instalar dependências (`npm ci`).
  - Executar `npm run cy:run`.
  - Fazer upload de artifacts: `reports/**`, `cypress/videos/**`, `cypress/screenshots/**`.

- Configuração Cypress ajustada (`cypress.config.js`) para ativar `video: true` e `screenshotOnRunFailure: true`.

- Adicionados arquivos de documentação:
  - `README-ENTREGA.md` (este arquivo).
  - `TEST_CASE_MAPPING.md` (mapeamento automático entre spec files e Test Cases requisitados).
