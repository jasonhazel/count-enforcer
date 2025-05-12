const translations = {
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
    setsaves_usage: 'Bitte geben Sie eine Zahl ein, um die Retter festzulegen. Verwendung: !setsaves [Zahl]',
    setsaves_invalid_number: 'Bitte geben Sie eine gültige Zahl ein.',
    setsaves_negative: 'Die Retter können nicht negativ sein.',
    setsaves_success: ({ saves }) => `Die Retter wurden auf ${saves} gesetzt.`,
    setsaves_error: 'Es gab einen Fehler beim Festlegen der Retter. Bitte versuchen Sie es später erneut.',
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
};

module.exports = translations; 