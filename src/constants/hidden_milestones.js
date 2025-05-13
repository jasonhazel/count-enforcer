/**
 * Hidden milestones that trigger special messages when reached during counting
 * @constant {Object.<number, {message: string, points: number}>}
 */
const HIDDEN_MILESTONES = {
    42: {
        message: '🎉 The answer to life, the universe, and everything!',
        points: 0.1 // 1st position / 10
    },
    69: {
        message: '😏 Nice...',
        points: 0.2 // 2nd position / 10
    },
    256: {
        message: '💻 A perfect byte!',
        points: 0.3 // 3rd position / 10
    },
    420: {
        message: '🌿 Blaze it!',
        points: 0.4 // 4th position / 10
    },
    512: {
        message: '🎮 Half a kilobyte of pure gaming!',
        points: 0.5 // 5th position / 10
    },
    640: {
        message: '💻 "640K ought to be enough for anybody" - Bill Gates',
        points: 0.6 // 6th position / 10
    },
    666: {
        message: '😈 The number of the beast!',
        points: 0.7 // 7th position / 10
    },
    1024: {
        message: '💾 A full kilobyte!',
        points: 0.8 // 8th position / 10
    }
};

module.exports = {
    HIDDEN_MILESTONES
}; 