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
        "香蕉面包，兄弟，在他妈的工作的地方，兄弟！！！！太棒了！！",
    
    // GiveSave command translations
    givesave_owner_only: '此命令仅限服务器所有者使用。',
    givesave_usage: '请提供用户名。用法：!givesave <用户名>',
    givesave_user_not_found: username => `在数据库中未找到用户"${username}"。`,
    givesave_success: (username, saves) => `成功给予${username}一个存档。他们现在有${saves}个存档。`,
    
    // Guild welcome messages
    guild_welcome: guildName => `感谢将我添加到${guildName}！🎉`,
    guild_missing_permissions: permissions => `我注意到缺少一些必需的权限。请确保我有以下权限：\n${permissions.map(p => `- ${p}`).join('\n')}`,
    guild_permissions_instructions: `您可以通过以下步骤授予这些权限：\n1. 进入服务器设置\n2. 点击"角色"\n3. 找到我的角色\n4. 启用缺失的权限\n5. 保存更改`,
    guild_role_created: '我已自动创建带有必要权限的"counter"角色。用户注册机器人时将自动分配此角色。',
    guild_role_instructions: botRole => `关于权限的重要说明：
- 我的角色（${botRole}）需要在"counter"角色之上
- 如果您有需要由机器人管理的现有角色，它们应该在我的角色之下
- 如果您在频道中使用基于角色的权限，请确保调整它们以允许"counter"角色访问必要的频道`,
    guild_role_permissions: '"counter"角色具有基本权限（查看频道、发送消息、读取消息历史记录）以确保用户可以与机器人互动',
    guild_role_position_error: botRole => `我注意到"counter"角色当前在我的最高角色之上。为确保我能正确管理此角色，请：\n\n1. 进入服务器设置\n2. 点击"角色"\n3. 将我的角色（${botRole}）拖到"counter"角色之上\n4. 保存更改`,
    
    // Role management error messages
    role_error_not_found: '错误：未找到计数角色。请联系管理员。',
    role_error_missing_permission: '错误：机器人没有管理角色的权限。请联系管理员。',
    role_error_hierarchy: '错误：机器人的角色在层级中不够高。请联系管理员。',
    
    // User command translations
    user_stats_title: '用户统计',
    user_stats_description: username => `${username}的统计信息`,
    user_stats_language: '语言',
    user_stats_failed_counts: '失败计数',
    user_stats_successful_counts: '成功计数',
    user_stats_current_streak: '当前连续计数',
    user_stats_highest_streak: '最高连续计数',
    
    // Rules command translations
    rules_title: '🎲 计数游戏规则',
    rules_description: '以下是计数游戏的玩法：',
    rules_basic_title: '📝 基本规则',
    rules_basic_content: '• 从1开始计数，每次增加一个数字\n• 每个人每次只能计数一次',
    rules_how_to_title: '🎯 如何参与',
    rules_how_to_content: '• 使用 `!register` 加入游戏，使用 `!lang` 设置语言\n• 获得"counter"角色后即可开始计数',
    rules_mistakes_title: '❌ 错误处理',
    rules_mistakes_content: '• 如果计数错误，计数将重置为0\n• 你的连续计数将重置，失败次数增加',
    rules_saves_title: '💾 存档',
    rules_saves_content: '• 使用 `!saves` 查看存档机制\n• 每个存档可以防止一次错误导致的计数重置',
    rules_stats_title: '📊 统计信息',
    rules_stats_content: '• 使用 `!user` 查看个人统计\n• 使用 `!server` 查看服务器统计',
    rules_footer: username => `由 ${username} 请求`,
    
    // Commands list translations
    commands_title: '可用命令',
    commands_description: '以下是您可以使用的所有命令：',
    commands_footer: username => `由${username}请求`,
    
    // Console messages for administrators
    console_invite_link: '使用以下链接将此机器人添加到您的服务器：',
    cannot_count_twice: '你不能连续数两次！',
    error_updating_count: '更新计数时发生错误。请稍后再试。',
    incorrect_count_with_save: '数字错误！应该是 {expected}，但你输入了 {current}。使用一个保存点继续！'
};

module.exports = translations; 