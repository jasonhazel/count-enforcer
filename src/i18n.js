const translations = {
    en: {
        registered: 'You have been registered!',
        updated: 'Your information has been updated and you are now registered!',
        unregistered: 'You have been unregistered. Use !register to register again.',
        not_registered: 'You are not registered in the system.',
        error_register: 'There was an error registering you. Please try again later.',
        error_unregister: 'There was an error unregistering you. Please try again later.',
        lang_set: 'Your language has been set to English.',
        lang_invalid: 'Invalid language code. Supported: en, es, de, fr, zh',
        pong: latency => `Pong! Latency: ${latency}ms`,
        echo: msg => msg,
        echo_missing: 'Please provide a message to echo!',
        owner_only_command: 'This command can only be used by the server owner.',
        setcount_usage: 'Please provide a number to set the count to. Usage: !setcount [number]',
        setcount_invalid_number: 'Please provide a valid number.',
        setcount_negative: 'The count cannot be negative.',
        setcount_success: ({ count }) => `Count has been set to ${count}.`,
        setcount_error: 'There was an error setting the count. Please try again later.',
        incorrect_count_warning: ({ expected, current }) => 
            `Warning: You said ${current}, but the next number should be ${expected}. No penalty since count is below 10.`,
        incorrect_count_with_save: ({ expected, current }) => 
            `Incorrect count! You said ${current}, but the next number should be ${expected}. Using one of your saves!`,
        incorrect_count_no_save: ({ expected, current }) => 
            `Incorrect count! You said ${current}, but the next number should be ${expected}. No saves left - count reset to 0!`,
        bananabread: "dude i got some fucking banana bread at work today dude? hell yeah. " +
            "my mom told me if i wait for things, like, good things will happen to me dude and " +
            "fucking i waited for some things and i got some banana bread at work today dude? hell yeah. " +
            "so it just goes to show that waiting for things is, like, worth it. " +
            "but there's a lot of bad things in this world, dude. " +
            "like fucking skunks dude? hell no. " +
            "Scratching you're eye, but it's STILL fucking ITCHY dude?! HELL no. " +
            "The fucking CUBS, DUDE? HELL NO!! " +
            "LIKE GETTING PAID NOT A LOT OF MONEY, DUDE?! FOR FUCKING WORKING?! HELL NO!!!! " +
            "BUT BANANA BREAD?! AT FUCKING WORK, DUDE?! HELL YEAH!!!!!! " +
            "HELL YEAH, BRO!!!! HELL YEAH!! " +
            "BANANA BREAD, BRO, AT FUCKING WORK, DUDE!!!! HELL YEAH!!"
    },
    es: {
        registered: '¡Te has registrado!',
        updated: '¡Tu información ha sido actualizada y ahora estás registrado!',
        unregistered: 'Has sido dado de baja. Usa !register para registrarte de nuevo.',
        not_registered: 'No estás registrado en el sistema.',
        error_register: 'Hubo un error al registrarte. Por favor, inténtalo más tarde.',
        error_unregister: 'Hubo un error al darte de baja. Por favor, inténtalo más tarde.',
        lang_set: 'Tu idioma ha sido cambiado a Español.',
        lang_invalid: 'Código de idioma inválido. Soportados: en, es, de, fr, zh',
        pong: latency => `¡Pong! Latencia: ${latency}ms`,
        echo: msg => msg,
        echo_missing: '¡Por favor proporciona un mensaje para repetir!',
        owner_only_command: 'Este comando solo puede ser usado por el propietario del servidor.',
        setcount_usage: 'Por favor, proporcione un número para establecer la cuenta en. Uso: !setcount [número]',
        setcount_invalid_number: 'Por favor, proporcione un número válido.',
        setcount_negative: 'La cuenta no puede ser negativa.',
        setcount_success: ({ count }) => `La cuenta se ha establecido en ${count}.`,
        setcount_error: 'Hubo un error al establecer la cuenta. Por favor, inténtelo más tarde.',
        incorrect_count_warning: ({ expected, current }) => 
            `Advertencia: Dijiste ${current}, pero el siguiente número debería ser ${expected}. Sin penalización ya que la cuenta está por debajo de 10.`,
        incorrect_count_with_save: ({ expected, current }) => 
            `¡Cuenta incorrecta! Dijiste ${current}, pero el siguiente número debería ser ${expected}. ¡Usando uno de tus salvados!`,
        incorrect_count_no_save: ({ expected, current }) => 
            `¡Cuenta incorrecta! Dijiste ${current}, pero el siguiente número debería ser ${expected}. ¡No quedan salvados - cuenta reiniciada a 0!`,
        bananabread: "tío, hoy conseguí un puto pan de plátano en el trabajo, tío? ¡joder sí! " +
            "mi madre me dijo que si espero las cosas, bueno, cosas buenas me pasarán, tío, y " +
            "joder, esperé algunas cosas y conseguí un pan de plátano en el trabajo hoy, tío? ¡joder sí! " +
            "así que esto demuestra que esperar las cosas vale la pena. " +
            "pero hay muchas cosas malas en este mundo, tío. " +
            "como putos zorrillos, tío? ¡joder no! " +
            "¡¿Rascarte el ojo, pero SIGUE picando, tío?! ¡JODER NO! " +
            "¡¿Los putos CUBS, TÍO?! ¡JODER NO!! " +
            "¡¿COMO GANAR POCO DINERO, TÍO?! ¡¿POR TRABAJAR?! ¡JODER NO!!!! " +
            "¡¿PERO PAN DE PLÁTANO?! ¡¿EN EL PUTO TRABAJO, TÍO?! ¡JODER SÍ!!!!!! " +
            "¡JODER SÍ, TÍO!!!! ¡JODER SÍ!! " +
            "¡PAN DE PLÁTANO, TÍO, EN EL PUTO TRABAJO, TÍO!!!! ¡JODER SÍ!!"
    },
    de: {
        registered: 'Du wurdest registriert!',
        updated: 'Deine Informationen wurden aktualisiert und du bist jetzt registriert!',
        unregistered: 'Du wurdest abgemeldet. Benutze !register, um dich erneut zu registrieren.',
        not_registered: 'Du bist nicht im System registriert.',
        error_register: 'Beim Registrieren ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
        error_unregister: 'Beim Abmelden ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
        lang_set: 'Deine Sprache wurde auf Deutsch gesetzt.',
        lang_invalid: 'Ungültiger Sprachcode. Unterstützt: en, es, de, fr, zh',
        pong: latency => `Pong! Latenz: ${latency}ms`,
        echo: msg => msg,
        echo_missing: 'Bitte gib eine Nachricht zum Wiederholen an!',
        owner_only_command: 'Diese Befehl kann nur vom Serverbesitzer verwendet werden.',
        setcount_usage: 'Bitte geben Sie eine Zahl ein, um die Zählung festzulegen. Verwendung: !setcount [Zahl]',
        setcount_invalid_number: 'Bitte geben Sie eine gültige Zahl ein.',
        setcount_negative: 'Die Zählung kann nicht negativ sein.',
        setcount_success: ({ count }) => `Die Zählung wurde auf ${count} gesetzt.`,
        setcount_error: 'Es gab einen Fehler beim Festlegen der Zählung. Bitte versuchen Sie es später erneut.',
        incorrect_count_warning: ({ expected, current }) => 
            `Warnung: Du hast ${current} gesagt, aber die nächste Zahl sollte ${expected} sein. Keine Strafe, da der Zähler unter 10 ist.`,
        incorrect_count_with_save: ({ expected, current }) => 
            `Falsche Zahl! Du hast ${current} gesagt, aber die nächste Zahl sollte ${expected} sein. Ein Retter wird verwendet!`,
        incorrect_count_no_save: ({ expected, current }) => 
            `Falsche Zahl! Du hast ${current} gesagt, aber die nächste Zahl sollte ${expected} sein. Keine Retter übrig - Zähler auf 0 zurückgesetzt!`,
        bananabread: "Alter, ich hab heute verdammtes Bananenbrot auf der Arbeit bekommen, Alter? Hölle ja! " +
            "meine Mutter hat mir gesagt, wenn ich auf Dinge warte, werden gute Dinge passieren, Alter, und " +
            "verdammt, ich hab auf ein paar Dinge gewartet und hab heute Bananenbrot auf der Arbeit bekommen, Alter? Hölle ja! " +
            "also zeigt das, dass es sich lohnt, auf Dinge zu warten. " +
            "aber es gibt viele schlechte Dinge auf dieser Welt, Alter. " +
            "wie verdammte Stinktiere, Alter? Hölle nein! " +
            "Dir das Auge kratzen, aber es juckt IMMER NOCH, Alter?! HÖLLE NEIN! " +
            "Die verdammten CUBS, ALTER?! HÖLLE NEIN!! " +
            "WIE WENIG GELD BEKOMMEN, ALTER?! FÜR VERDAMMTE ARBEIT?! HÖLLE NEIN!!!! " +
            "ABER BANANENBROT?! AUF DER VERDAMMTEN ARBEIT, ALTER?! HÖLLE JA!!!!!! " +
            "HÖLLE JA, BRUDER!!!! HÖLLE JA!! " +
            "BANANENBROT, BRUDER, AUF DER VERDAMMTEN ARBEIT, ALTER!!!! HÖLLE JA!!"
    },
    fr: {
        registered: 'Vous avez été enregistré !',
        updated: 'Vos informations ont été mises à jour et vous êtes maintenant enregistré !',
        unregistered: 'Vous avez été désinscrit. Utilisez !register pour vous inscrire à nouveau.',
        not_registered: 'Vous n\'êtes pas enregistré dans le système.',
        error_register: 'Une erreur s\'est produite lors de votre inscription. Veuillez réessayer plus tard.',
        error_unregister: 'Une erreur s\'est produite lors de votre désinscription. Veuillez réessayer plus tard.',
        lang_set: 'Votre langue a été définie sur le français.',
        lang_invalid: 'Code de langue invalide. Pris en charge : en, es, de, fr, zh',
        pong: latency => `Pong ! Latence : ${latency}ms`,
        echo: msg => msg,
        echo_missing: 'Veuillez fournir un message à répéter !',
        owner_only_command: 'Ce commande ne peut être utilisée que par le propriétaire du serveur.',
        setcount_usage: 'Veuillez fournir un nombre pour définir le compte. Usage: !setcount [nombre]',
        setcount_invalid_number: 'Veuillez fournir un nombre valide.',
        setcount_negative: 'Le compte ne peut être négatif.',
        setcount_success: ({ count }) => `Le compte a été défini sur ${count}.`,
        setcount_error: 'Il y a eu une erreur lors de la définition du compte. Veuillez réessayer plus tard.',
        incorrect_count_warning: ({ expected, current }) => 
            `Attention : Vous avez dit ${current}, mais le prochain nombre devrait être ${expected}. Pas de pénalité car le compte est inférieur à 10.`,
        incorrect_count_with_save: ({ expected, current }) => 
            `Compte incorrect ! Vous avez dit ${current}, mais le prochain nombre devrait être ${expected}. Utilisation d'une sauvegarde !`,
        incorrect_count_no_save: ({ expected, current }) => 
            `Compte incorrect ! Vous avez dit ${current}, mais le prochain nombre devrait être ${expected}. Plus de sauvegardes - compte réinitialisé à 0 !`,
        bananabread: "mec, j'ai eu du putain de pain aux bananes au boulot aujourd'hui, mec? putain oui! " +
            "ma mère m'a dit que si j'attendais les choses, comme, de bonnes choses m'arriveraient, mec, et " +
            "putain, j'ai attendu quelques trucs et j'ai eu du pain aux bananes au boulot aujourd'hui, mec? putain oui! " +
            "donc ça prouve que ça vaut le coup d'attendre les choses. " +
            "mais il y a beaucoup de mauvaises choses dans ce monde, mec. " +
            "comme les putains de mouffettes, mec? putain non! " +
            "Se gratter l'œil, mais ça gratte TOUJOURS, mec?! PUTAIN NON! " +
            "Les putains de CUBS, MEC?! PUTAIN NON!! " +
            "COMME ÊTRE MAL PAYÉ, MEC?! POUR TRAVAILLER?! PUTAIN NON!!!! " +
            "MAIS DU PAIN AUX BANANES?! AU PUTAIN DE BOULOT, MEC?! PUTAIN OUI!!!!!! " +
            "PUTAIN OUI, FRÈRE!!!! PUTAIN OUI!! " +
            "PAIN AUX BANANES, FRÈRE, AU PUTAIN DE BOULOT, MEC!!!! PUTAIN OUI!!"
    },
    zh: {
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
    }
};

function t(key, lang, ...args) {
    const l = translations[lang] ? lang : 'en';
    const value = translations[l][key];
    return typeof value === 'function' ? value(...args) : value;
}

// Export the list of supported language codes
const supportedLanguages = Object.keys(translations);

module.exports = { t, supportedLanguages }; 