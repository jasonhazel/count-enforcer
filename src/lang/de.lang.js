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
        "BANANENBROT, BRUDER, AUF DER VERDAMMTEN ARBEIT, ALTER!!!! HÖLLE JA!!",
    
    // GiveSave command translations
    givesave_owner_only: 'Dieser Befehl kann nur vom Serverbesitzer verwendet werden.',
    givesave_usage: 'Bitte gib einen Benutzernamen an. Verwendung: !givesave <Benutzername>',
    givesave_user_not_found: username => `Benutzer "${username}" wurde in der Datenbank nicht gefunden.`,
    givesave_success: (username, saves) => `Erfolgreich einen Retter an ${username} gegeben. Sie haben jetzt ${saves} Retter.`,
    
    // Guild welcome messages
    guild_welcome: guildName => `Danke, dass du mich zu ${guildName} hinzugefügt hast! 🎉`,
    guild_missing_permissions: permissions => `Mir fehlen einige erforderliche Berechtigungen. Bitte stelle sicher, dass ich die folgenden Berechtigungen habe:\n${permissions.map(p => `- ${p}`).join('\n')}`,
    guild_permissions_instructions: `Du kannst diese Berechtigungen wie folgt erteilen:\n1. Gehe zu Servereinstellungen\n2. Klicke auf "Rollen"\n3. Finde meine Rolle\n4. Aktiviere die fehlenden Berechtigungen\n5. Speichere die Änderungen`,
    guild_role_created: 'Ich habe automatisch die "counter" Rolle mit den notwendigen Berechtigungen erstellt. Diese Rolle wird Benutzern automatisch zugewiesen, wenn sie sich beim Bot registrieren.',
    guild_role_instructions: botRole => `Wichtiger Hinweis zu Berechtigungen:
- Meine Rolle (${botRole}) muss über der "counter" Rolle in der Hierarchie stehen
- Wenn du vorhandene Rollen hast, die vom Bot verwaltet werden sollen, sollten diese unter meiner Rolle stehen
- Wenn du rollenbasierte Berechtigungen in deinen Kanälen verwendest, stelle sicher, dass du sie anpasst, damit die "counter" Rolle auf die notwendigen Kanäle zugreifen kann`,
    guild_role_permissions: 'Die "counter" Rolle hat grundlegende Berechtigungen (Kanal anzeigen, Nachrichten senden, Nachrichtenverlauf lesen), damit Benutzer mit dem Bot interagieren können',
    guild_role_position_error: botRole => `Ich bemerke, dass die "counter" Rolle derzeit über meiner höchsten Rolle steht. Um sicherzustellen, dass ich diese Rolle richtig verwalten kann, bitte:\n\n1. Gehe zu Servereinstellungen\n2. Klicke auf "Rollen"\n3. Ziehe meine Rolle (${botRole}) über die "counter" Rolle\n4. Speichere die Änderungen`,
    
    // Role management error messages
    role_error_not_found: 'Fehler: Counter-Rolle nicht gefunden. Bitte kontaktiere einen Administrator.',
    role_error_missing_permission: 'Fehler: Bot hat keine Berechtigung zum Verwalten von Rollen. Bitte kontaktiere einen Administrator.',
    role_error_hierarchy: 'Fehler: Die Rolle des Bots ist in der Hierarchie nicht hoch genug. Bitte kontaktiere einen Administrator.',
    
    // User command translations
    user_stats_title: 'Benutzerstatistiken',
    user_stats_description: username => `Statistiken für ${username}`,
    user_stats_language: 'Sprache',
    user_stats_failed_counts: 'Fehlgeschlagene Zählungen',
    user_stats_successful_counts: 'Erfolgreiche Zählungen',
    user_stats_current_streak: 'Aktuelle Serie',
    user_stats_highest_streak: 'Höchste Serie',
    
    // Rules command translations
    rules_title: '🎲 Zählspiel-Regeln',
    rules_description: 'So funktioniert das Zählspiel:',
    rules_basic_title: '📝 Grundregeln',
    rules_basic_content: '• Zähle von 1 an, eine Zahl nach der anderen\n• Jede Person darf nur einmal hintereinander zählen',
    rules_how_to_title: '🎯 Spielanleitung',
    rules_how_to_content: '• Nutze `!register` zum Beitreten und `!lang` für die Spracheinstellung\n• Erhalte die "counter"-Rolle, um mit dem Zählen zu beginnen',
    rules_mistakes_title: '❌ Fehler',
    rules_mistakes_content: '• Bei einem Fehler wird der Zähler auf 0 zurückgesetzt\n• Deine Serie wird zurückgesetzt und die Fehlerzahl erhöht sich',
    rules_saves_title: '💾 Rettungen',
    rules_saves_content: '• Nutze `!saves` um zu sehen, wie Rettungen funktionieren\n• Jede Rettung verhindert, dass ein Fehler den Zähler zurücksetzt',
    rules_stats_title: '📊 Statistiken',
    rules_stats_content: '• Nutze `!user` für deine Statistiken\n• Nutze `!server` für Server-Statistiken',
    rules_footer: username => `Angefordert von ${username}`,
    
    // Commands list translations
    commands_title: 'Verfügbare Befehle',
    commands_description: 'Hier sind alle Befehle, die du nutzen kannst:',
    commands_footer: username => `Angefordert von ${username}`,
    
    // Console messages for administrators
    console_invite_link: 'Füge diesen Bot mit dem folgenden Link zu deinem Server hinzu:'
};

module.exports = translations; 