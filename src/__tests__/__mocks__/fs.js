const fs = jest.createMockFromModule('fs');

// Mock implementation of readdirSync
fs.readdirSync = jest.fn((dir) => {
    const dirStr = String(dir);
    if (dirStr.includes('commands')) {
        return ['test.command.js'];
    }
    if (dirStr.includes('events')) {
        return ['test.event.js'];
    }
    return [];
});

module.exports = fs; 