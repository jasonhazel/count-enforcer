const translations = {
    registered: '您已注册！',
    updated: '您的信息已更新，您现在已注册！',
    unregistered: '您已注销。请使用 !register 重新注册。',
    not_registered: '您尚未在系统中注册。',
    error_register: '注册时发生错误。请稍后再试。',
    error_unregister: '注销时发生错误。请稍后再试。',
    lang_set: '您的语言已设置为中文。',
    lang_invalid: '无效的语言代码。支持：en, es, de, fr, zh',
    pong: latency => `Pong！延迟：${latency}毫秒`,
    echo: msg => msg,
    echo_missing: '请提供要重复的消息！',
    owner_only_command: '此命令只能由服务器所有者使用。',
    setcount_usage: '请提供要设置的数字。用法：!setcount [数字]',
    setcount_invalid_number: '请提供有效的数字。',
    setcount_negative: '计数不能为负。',
    setcount_success: ({ count }) => `计数已设置为${count}。`,
    setcount_error: '设置计数时发生错误。请稍后再试。',
    setsaves_usage: '请提供要设置的存档数量。用法：!setsaves [数字]',
    setsaves_invalid_number: '请提供有效的数字。',
    setsaves_negative: '存档数量不能为负。',
    setsaves_success: ({ saves }) => `存档数量已设置为${saves}。`,
    setsaves_error: '设置存档数量时发生错误。请稍后再试。',
    incorrect_count_warning: ({ expected, current }) => 
        `警告：您说了${current}，但下一个数字应该是${expected}。由于计数低于10，不进行惩罚。`,
    incorrect_count_with_save: ({ expected, current }) => 
        `计数错误！您说了${current}，但下一个数字应该是${expected}。使用一个存档！`,
    incorrect_count_no_save: ({ expected, current }) => 
        `计数错误！您说了${current}，但下一个数字应该是${expected}。没有存档了 - 计数重置为0！`,
    bananabread: "兄弟，我今天在工作的地方得到了他妈的香蕉面包，兄弟？太棒了！" +
        "我妈妈告诉我，如果我等待事情，好的事情会发生在我身上，兄弟，而且" +
        "他妈的，我等了一些事情，今天在工作的地方得到了香蕉面包，兄弟？太棒了！" +
        "所以这证明等待是值得的。" +
        "但这个世界有很多坏事，兄弟。" +
        "比如他妈的臭鼬，兄弟？不！" +
        "挠你的眼睛，但它还是他妈的痒，兄弟？！不！" +
        "他妈的芝加哥小熊队，兄弟？！不！！" +
        "像他妈的工资低，兄弟？！为了工作？！不！！！！" +
        "但是香蕉面包？！在他妈的工作的地方，兄弟？！太棒了！！！！！！" +
        "太棒了，兄弟！！！！太棒了！！" +
        "香蕉面包，兄弟，在他妈的工作的地方，兄弟！！！！太棒了！！"
};

module.exports = translations; 