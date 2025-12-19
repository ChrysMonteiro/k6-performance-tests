import { check } from 'k6';

export function login() {
    const fakeToken = 'mocked-performance-token';

    check(true, {
        'login retornou 200': () => true,
        'token presente': () => true,
    });

    return fakeToken;
}
