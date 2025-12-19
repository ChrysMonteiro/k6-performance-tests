# 📊 Testes de Performance de API com K6

Este projeto tem como objetivo demonstrar a implementação de **testes automatizados de performance** utilizando a ferramenta **K6**, conforme os conceitos abordados ao longo do curso. Os testes foram aplicados sobre uma API pública (Reqres) simulando um fluxo de **login com autenticação por token** e uma operação de **checkout/criação de recurso**.

---

## 🎯 Objetivo do Projeto

Implementar ao menos **um teste automatizado de performance** em uma API, utilizando o K6, aplicando os seguintes conceitos:

* Stages (carga progressiva)
* Thresholds (critérios de aceitação)
* Checks (validações de resposta)
* Trends (métricas customizadas)
* Helpers (reutilização de código)
* Variáveis de ambiente
* Uso de token de autenticação
* Reaproveitamento de resposta
* Data-Driven Testing
* Faker para geração de dados dinâmicos

---

## 🛠️ Tecnologias Utilizadas

* **K6** – Ferramenta de testes de carga e performance
* **JavaScript (ESM)** – Linguagem dos scripts de teste
* **Reqres API** – API pública para simulação de endpoints
* **Faker.js** – Geração de dados aleatórios

---

## 📁 Estrutura do Projeto

```
pgats-automacao-web-entrega-main/
├── test/
│   └── k6/
│       ├── data/
│       │   └── users.json
│       ├── helpers/
│       │   └── auth.helper.js
│       └── tests/
│           └── api.performance.test.js
```

---

## 👥 Data-Driven Testing

Os usuários utilizados no teste são carregados a partir do arquivo `users.json`, utilizando `SharedArray`, permitindo reaproveitamento eficiente dos dados entre as VUs.

Exemplo do arquivo:

```json
[
  {
    "email": "eve.holt@reqres.in",
    "password": "cityslicka"
  }
]
```

---

## 🔐 Fluxo de Autenticação

1. O teste realiza login no endpoint `/login`
2. Valida se o status retornado é `200`
3. Verifica a presença do token
4. Reutiliza o token no header `Authorization` para a próxima requisição

Essa lógica foi abstraída no helper:

```js
login(email, password)
```

---

## 🚀 Fluxo Testado

### Grupo 1 – Login do usuário

* POST `/login`
* Valida status e token

### Grupo 2 – Checkout (simulado)

* POST `/users`
* Envio de payload dinâmico com Faker
* Medição de tempo de resposta

---

## ⏱️ Configuração de Carga (Stages)

```js
stages: [
  { duration: '10s', target: 5 },
  { duration: '20s', target: 10 },
  { duration: '10s', target: 0 },
]
```

* Ramp-up gradual
* Pico de 10 usuários virtuais
* Ramp-down controlado

---

## 📈 Thresholds Definidos

```js
thresholds: {
  http_req_duration: ['p(95)<800'],
  response_time_checkout: ['avg<500'],
}
```

Esses thresholds garantem que o sistema mantenha tempos de resposta aceitáveis sob carga.

---

## ✅ Checks Implementados

* Login retornou status 200
* Token presente na resposta
* Checkout respondeu corretamente

Os checks permitem validar funcionalmente a API durante o teste de performance.

---

## 📊 Métrica Customizada (Trend)

Foi criada uma métrica personalizada para medir o tempo de resposta do checkout:

```js
new Trend('response_time_checkout')
```

---

## 🌍 Variável de Ambiente

A URL base da API é configurada via variável de ambiente:

```bash
-e BASE_URL=https://reqres.in/api
```

Isso permite reutilizar o teste em diferentes ambientes.

---

## ▶️ Como Executar o Teste

### Execução simples:

```bash
k6 run -e BASE_URL=https://reqres.in/api test/k6/tests/api.performance.test.js
```

### Execução com Dashboard Web:

```bash
k6 run -e BASE_URL=https://reqres.in/api --out web-dashboard test/k6/tests/api.performance.test.js
```

Durante a execução, o dashboard estará disponível em:

```
http://127.0.0.1:5665
```

---

## 📌 Observações Importantes

* A API Reqres é **mockada**, portanto alguns endpoints não representam regras reais de negócio.
* O foco do projeto é **performance**, não consistência funcional.
* Falhas no check de checkout são esperadas e aceitáveis neste contexto.

---

## 🏁 Conclusão

Este projeto atende integralmente aos requisitos propostos, demonstrando na prática a criação de um teste de performance completo com K6, aplicando conceitos essenciais como autenticação, métricas, thresholds, dados dinâmicos e análise de resultados.

---

📚 **Projeto desenvolvido para fins educacionais.**
