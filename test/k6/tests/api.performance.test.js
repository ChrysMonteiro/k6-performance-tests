import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { login } from '../helpers/auth.helper.js';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker/+esm';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
    return JSON.parse(open('../data/users.json'));
});


export const responseTimeTrend = new Trend('response_time_checkout');

export const options = {
    stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<800'],
        response_time_checkout: ['avg<500']
    }
};

export default function () {

    const user = users[Math.floor(Math.random() * users.length)];

    group('Login do usuário', () => {
        const token = login();

        group('Checkout', () => {
            const payload = {
                product: faker.commerce.productName(),
                price: faker.commerce.price(),
                userType: user.type
            };

            const res = http.post(
                `${__ENV.BASE_URL}/users`,
                JSON.stringify(payload),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            responseTimeTrend.add(res.timings.duration);

            check(res, {
                'checkout com sucesso': r => r.status === 201
            });
        });
    });
}
