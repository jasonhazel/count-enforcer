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
        "PAIN AUX BANANES, FRÈRE, AU PUTAIN DE BOULOT, MEC!!!! PUTAIN OUI!!"
};

module.exports = translations; 