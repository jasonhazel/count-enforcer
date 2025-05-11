const { t, supportedLanguages } = require('../i18n');

describe('i18n', () => {
    test('translates static keys in all supported languages', () => {
        const key = 'registered';
        const expected = {
            en: 'You have been registered!',
            es: '¡Te has registrado!',
            de: 'Du wurdest registriert!',
            fr: 'Vous avez été enregistré !',
            zh: '您已注册！'
        };
        for (const lang of supportedLanguages) {
            expect(t(key, lang)).toBe(expected[lang]);
        }
    });

    test('translates dynamic keys (functions) with arguments', () => {
        expect(t('pong', 'en', 123)).toBe('Pong! Latency: 123ms');
        expect(t('pong', 'es', 456)).toBe('¡Pong! Latencia: 456ms');
        expect(t('pong', 'de', 789)).toBe('Pong! Latenz: 789ms');
        expect(t('pong', 'fr', 321)).toBe('Pong ! Latence : 321ms');
        expect(t('pong', 'zh', 654)).toBe('Pong！延迟：654毫秒');
    });

    test('translates dynamic keys (object argument)', () => {
        const args = { expected: 5, current: 3 };
        expect(t('incorrect_count_warning', 'en', args)).toContain('You said 3, but the next number should be 5');
        expect(t('incorrect_count_with_save', 'es', args)).toContain('Dijiste 3, pero el siguiente número debería ser 5');
        expect(t('incorrect_count_no_save', 'de', args)).toContain('Du hast 3 gesagt, aber die nächste Zahl sollte 5 sein');
    });

    test('falls back to English for unsupported languages', () => {
        expect(t('registered', 'xx')).toBe('You have been registered!');
        expect(t('pong', 'xx', 42)).toBe('Pong! Latency: 42ms');
    });

    test('supportedLanguages export contains all language codes', () => {
        expect(supportedLanguages.sort()).toEqual(['de', 'en', 'es', 'fr', 'zh'].sort());
    });
}); 