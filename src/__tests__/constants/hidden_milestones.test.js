const { HIDDEN_MILESTONES } = require('../../constants/hidden_milestones');

describe('HIDDEN_MILESTONES', () => {
    test('should be an object', () => {
        expect(typeof HIDDEN_MILESTONES).toBe('object');
    });

    test('should have expected milestone numbers', () => {
        const expectedMilestones = [42, 69, 256, 420, 512, 640, 666, 1024];
        expect(Object.keys(HIDDEN_MILESTONES).map(Number)).toEqual(expectedMilestones);
    });

    test('each milestone should have required properties', () => {
        Object.entries(HIDDEN_MILESTONES).forEach(([milestone, data], index) => {
            expect(data).toHaveProperty('message');
            expect(data).toHaveProperty('points');
            expect(typeof data.message).toBe('string');
            expect(typeof data.points).toBe('number');
            expect(data.points).toBe((index + 1) / 10); // Position in list divided by 10
        });
    });

    test('should have expected emojis in messages', () => {
        Object.values(HIDDEN_MILESTONES).forEach(data => {
            expect(data.message).toMatch(/[\u{1F300}-\u{1F9FF}]/u);
        });
    });
}); 