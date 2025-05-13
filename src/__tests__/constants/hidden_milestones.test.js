const { HIDDEN_MILESTONES } = require('../../constants/hidden_milestones');

describe('HIDDEN_MILESTONES', () => {
    test('should be an object', () => {
        expect(typeof HIDDEN_MILESTONES).toBe('object');
    });

    test('should have expected milestone numbers', () => {
        const expectedMilestones = [42, 69, 256, 420, 512, 640, 666, 1024];
        expect(Object.keys(HIDDEN_MILESTONES).map(Number)).toEqual(expectedMilestones);
    });

    test('each milestone should have a message string', () => {
        Object.values(HIDDEN_MILESTONES).forEach(message => {
            expect(typeof message).toBe('string');
            expect(message.length).toBeGreaterThan(0);
        });
    });

    test('should have expected emojis in messages', () => {
        Object.values(HIDDEN_MILESTONES).forEach(message => {
            expect(message).toMatch(/[\u{1F300}-\u{1F9FF}]/u);
        });
    });
}); 