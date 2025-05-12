const translations = {
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
    setsaves_usage: 'Veuillez fournir un nombre pour définir les sauvegardes. Usage: !setsaves [nombre]',
    setsaves_invalid_number: 'Veuillez fournir un nombre valide.',
    setsaves_negative: 'Les sauvegardes ne peuvent être négatives.',
    setsaves_success: ({ saves }) => `Les sauvegardes ont été définies sur ${saves}.`,
    setsaves_error: 'Il y a eu une erreur lors de la définition des sauvegardes. Veuillez réessayer plus tard.',
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
        "PAIN AUX BANANES, FRÈRE, AU PUTAIN DE BOULOT, MEC!!!! PUTAIN OUI!!",
    
    // GiveSave command translations
    givesave_owner_only: 'Cette commande ne peut être utilisée que par le propriétaire du serveur.',
    givesave_usage: 'Veuillez fournir un nom d\'utilisateur. Utilisation : !givesave <nom d\'utilisateur>',
    givesave_user_not_found: username => `Utilisateur "${username}" non trouvé dans la base de données.`,
    givesave_success: (username, saves) => `Une sauvegarde a été donnée à ${username}. Il a maintenant ${saves} sauvegardes.`,
    
    // Guild welcome messages
    guild_welcome: guildName => `Merci de m'avoir ajouté à ${guildName} ! 🎉`,
    guild_missing_permissions: permissions => `Je remarque qu'il me manque certaines permissions nécessaires. Veuillez vous assurer que j'ai les permissions suivantes :\n${permissions.map(p => `- ${p}`).join('\n')}`,
    guild_permissions_instructions: `Vous pouvez accorder ces permissions en :\n1. Allant dans les Paramètres du Serveur\n2. Cliquant sur "Rôles"\n3. Trouvant mon rôle\n4. Activant les permissions manquantes\n5. Sauvegardant les changements`,
    guild_role_created: 'J\'ai automatiquement créé le rôle "counter" avec les permissions nécessaires. Ce rôle sera automatiquement attribué aux utilisateurs lorsqu\'ils s\'inscriront au bot.',
    guild_role_instructions: botRole => `Note Importante sur les Permissions :
- Mon rôle (${botRole}) doit être au-dessus du rôle "counter" dans la hiérarchie
- Si vous avez des rôles existants qui doivent être gérés par le bot, ils doivent être en dessous de mon rôle
- Si vous utilisez des permissions basées sur les rôles dans vos canaux, assurez-vous de les ajuster pour permettre au rôle "counter" d'accéder aux canaux nécessaires`,
    guild_role_permissions: 'Le rôle "counter" a des permissions de base (Voir le Canal, Envoyer des Messages, Lire l\'Historique des Messages) pour s\'assurer que les utilisateurs peuvent interagir avec le bot',
    guild_role_position_error: botRole => `Je remarque que le rôle "counter" est actuellement au-dessus de mon rôle le plus élevé. Pour m'assurer que je peux gérer correctement ce rôle, veuillez :\n\n1. Aller dans les Paramètres du Serveur\n2. Cliquer sur "Rôles"\n3. Faire glisser mon rôle (${botRole}) au-dessus du rôle "counter"\n4. Sauvegarder les changements`,
    
    // Role management error messages
    role_error_not_found: 'Erreur : Rôle counter non trouvé. Veuillez contacter un administrateur.',
    role_error_missing_permission: 'Erreur : Le bot n\'a pas la permission de gérer les rôles. Veuillez contacter un administrateur.',
    role_error_hierarchy: 'Erreur : Le rôle du bot n\'est pas assez haut dans la hiérarchie. Veuillez contacter un administrateur.',
    
    // User command translations
    user_stats_title: 'Statistiques Utilisateur',
    user_stats_description: username => `Statistiques pour ${username}`,
    user_stats_language: 'Langue',
    user_stats_failed_counts: 'Comptages Échoués',
    user_stats_successful_counts: 'Comptages Réussis',
    user_stats_current_streak: 'Série Actuelle',
    user_stats_highest_streak: 'Meilleure Série',
    
    // Rules command translations
    rules_title: '🎲 Règles du Jeu de Comptage',
    rules_description: 'Voici comment jouer au jeu de comptage :',
    rules_basic_title: '📝 Règles de Base',
    rules_basic_content: '• Comptez à partir de 1, un nombre à la fois\n• Chaque personne ne peut compter qu\'une seule fois de suite',
    rules_how_to_title: '🎯 Comment Jouer',
    rules_how_to_content: '• Utilisez `!register` pour rejoindre et `!lang` pour définir votre langue\n• Obtenez le rôle "counter" pour commencer à compter',
    rules_mistakes_title: '❌ Erreurs',
    rules_mistakes_content: '• Si vous faites une erreur, le compte est remis à 0\n• Votre série est réinitialisée et votre nombre d\'échecs augmente',
    rules_saves_title: '💾 Sauvegardes',
    rules_saves_content: '• Utilisez `!saves` pour voir comment fonctionnent les sauvegardes\n• Chaque sauvegarde empêche une erreur de réinitialiser le compte',
    rules_stats_title: '📊 Statistiques',
    rules_stats_content: '• Utilisez `!user` pour voir vos statistiques\n• Utilisez `!server` pour voir les statistiques du serveur',
    rules_footer: username => `Demandé par ${username}`,
    
    // Commands list translations
    commands_title: 'Commandes Disponibles',
    commands_description: 'Voici toutes les commandes que vous pouvez utiliser :',
    commands_footer: username => `Demandé par ${username}`,
    
    // Console messages for administrators
    console_invite_link: 'Ajoutez ce bot à votre serveur en utilisant le lien suivant :',
    cannot_count_twice: 'Vous ne pouvez pas compter deux fois de suite !',
    error_updating_count: 'Une erreur est survenue lors de la mise à jour du compte. Veuillez réessayer plus tard.',
    incorrect_count_with_save: 'Mauvais nombre ! {expected} était attendu, mais vous avez dit {current}. Utilisation d\'une sauvegarde pour continuer !'
};

module.exports = translations; 