📊 Testes de Performance de API com K6
📌 Descrição do Projeto

Este projeto tem como objetivo implementar testes automatizados de performance utilizando o K6, conforme solicitado no Trabalho de Conclusão da Disciplina.
A API utilizada para os testes foi a ReqRes (https://reqres.in
), uma API pública amplamente usada para fins educacionais e testes.

Os testes exercitam o fluxo de login do usuário seguido de uma operação simulada de checkout, aplicando todos os conceitos exigidos no desafio.

📂 Estrutura do Projeto
test/
 └─ k6/
    ├─ data/
    │  └─ users.json
    ├─ helpers/
    │  └─ auth.helper.js
    └─ tests/
       └─ api.performance.test.js


data/ → dados utilizados no Data-Driven Testing

helpers/ → funções reutilizáveis (login)

tests/ → scripts de teste de performance

🚀 Execução dos Testes

O teste pode ser executado informando a URL da API via variável de ambiente:

k6 run -e BASE_URL=https://reqres.in/api test/k6/tests/api.performance.test.js

🧪 Conceitos Aplicados
✅ 1. Groups

O conceito de Groups é utilizado para organizar o teste em etapas lógicas, facilitando a leitura dos resultados e do fluxo de execução.

📍 Arquivo: test/k6/tests/api.performance.test.js

group('Login do usuário', () => {
    const token = login(user.email, user.password);

    group('Checkout', () => {
        // requisição de checkout
    });
});


Neste exemplo, o teste é dividido em dois grupos:

Login do usuário

Checkout

✅ 2. Helpers

O Helper é utilizado para encapsular a lógica de login em um arquivo separado, promovendo reutilização de código.

📍 Arquivo: test/k6/helpers/auth.helper.js

export function login(email, password) {
    const res = http.post(`${__ENV.BASE_URL}/login`, JSON.stringify({
        email,
        password
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    return res.json('token');
}


O helper é importado e utilizado no teste principal:

import { login } from '../helpers/auth.helper.js';

✅ 3. Variável de Ambiente

A URL da API é definida por meio de variável de ambiente, permitindo flexibilidade entre diferentes ambientes.

`${__ENV.BASE_URL}/login`


Execução via terminal:

k6 run -e BASE_URL=https://reqres.in/api ...

✅ 4. Data-Driven Testing

O conceito de Data-Driven Testing é aplicado utilizando o SharedArray, permitindo que múltiplos usuários sejam usados durante a execução.

📍 Arquivo: test/k6/tests/api.performance.test.js

const users = new SharedArray('users', function () {
    return JSON.parse(open('../data/users.json'));
});

const user = users[Math.floor(Math.random() * users.length)];


Os dados estão armazenados no arquivo:

📍 test/k6/data/users.json

✅ 5. Uso de Token de Autenticação

Após o login, a API retorna um token, que é utilizado para autenticar as requisições seguintes.

const token = login(user.email, user.password);


Esse token é enviado no header da requisição de checkout:

headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
}

✅ 6. Reaproveitamento de Resposta

O token retornado na resposta da API de login é reaproveitado nas requisições subsequentes, evitando a necessidade de realizar um novo login a cada chamada.

const token = login(user.email, user.password);


Esse reaproveitamento melhora a performance e simula um cenário real de uso da API.

✅ 7. Faker

A biblioteca Faker é utilizada para gerar dados dinâmicos durante o teste.

const payload = {
    product: faker.commerce.productName(),
    price: faker.commerce.price()
};


Isso evita dados fixos e torna o teste mais realista.

✅ 8. Checks

Os Checks validam se as respostas da API estão corretas.

📍 Arquivo: auth.helper.js

check(res, {
    'login retornou 200': r => r.status === 200,
    'token presente': r => r.status === 200 && r.json('token')
});


📍 Arquivo: api.performance.test.js

check(res, {
    'checkout com sucesso': r => r.status === 201
});

✅ 9. Thresholds

Os Thresholds definem critérios mínimos de performance para aprovação do teste.

thresholds: {
    http_req_duration: ['p(95)<800'],
    response_time_checkout: ['avg<500']
}

✅ 10. Trends

O conceito de Trends é utilizado para coletar métricas personalizadas de tempo de resposta do checkout.

export const responseTimeTrend = new Trend('response_time_checkout');


Registro do tempo da requisição:

responseTimeTrend.add(res.timings.duration);

✅ 11. Stages

Os Stages controlam o aumento e redução gradual da carga.

stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 }
]

📊 Relatório de Execução do Teste

O teste foi executado utilizando o Web Dashboard do K6, que apresenta métricas detalhadas de performance em tempo real.

k6 run --out web-dashboard -e BASE_URL=https://reqres.in/api test/k6/tests/api.performance.test.js


📍 Durante a execução, o dashboard ficou disponível em:

http://127.0.0.1:566