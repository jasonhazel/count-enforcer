const translations = {
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
    setsaves_usage: 'Por favor, proporcione un número para establecer las guardas en. Uso: !setsaves [número]',
    setsaves_invalid_number: 'Por favor, proporcione un número válido.',
    setsaves_negative: 'Las guardas no pueden ser negativas.',
    setsaves_success: ({ saves }) => `Las guardas se han establecido en ${saves}.`,
    setsaves_error: 'Hubo un error al establecer las guardas. Por favor, inténtelo más tarde.',
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
        "¡PAN DE PLÁTANO, TÍO, EN EL PUTO TRABAJO, TÍO!!!! ¡JODER SÍ!!",
    
    // GiveSave command translations
    givesave_owner_only: 'Este comando solo puede ser utilizado por el propietario del servidor.',
    givesave_usage: 'Por favor, proporciona un nombre de usuario. Uso: !givesave <nombre de usuario>',
    givesave_user_not_found: username => `Usuario "${username}" no encontrado en la base de datos.`,
    givesave_success: (username, saves) => `Se ha dado un salvado a ${username}. Ahora tiene ${saves} salvados.`,
    
    // Guild welcome messages
    guild_welcome: guildName => `¡Gracias por añadirme a ${guildName}! 🎉`,
    guild_missing_permissions: permissions => `Noto que me faltan algunos permisos necesarios. Por favor, asegúrate de que tengo los siguientes permisos:\n${permissions.map(p => `- ${p}`).join('\n')}`,
    guild_permissions_instructions: `Puedes otorgar estos permisos así:\n1. Ve a Configuración del Servidor\n2. Haz clic en "Roles"\n3. Encuentra mi rol\n4. Habilita los permisos faltantes\n5. Guarda los cambios`,
    guild_role_created: 'He creado automáticamente el rol "counter" con los permisos necesarios. Este rol se asignará automáticamente a los usuarios cuando se registren con el bot.',
    guild_role_instructions: botRole => `Nota Importante Sobre Permisos:
- Mi rol (${botRole}) debe estar por encima del rol "counter" en la jerarquía
- Si tienes roles existentes que necesitan ser gestionados por el bot, deben estar por debajo de mi rol
- Si estás usando permisos basados en roles en tus canales, asegúrate de ajustarlos para permitir que el rol "counter" acceda a los canales necesarios`,
    guild_role_permissions: 'El rol "counter" tiene permisos básicos (Ver Canal, Enviar Mensajes, Leer Historial de Mensajes) para asegurar que los usuarios puedan interactuar con el bot',
    guild_role_position_error: botRole => `Noto que el rol "counter" está actualmente por encima de mi rol más alto. Para asegurar que pueda gestionar este rol correctamente, por favor:\n\n1. Ve a Configuración del Servidor\n2. Haz clic en "Roles"\n3. Arrastra mi rol (${botRole}) por encima del rol "counter"\n4. Guarda los cambios`,
    
    // Role management error messages
    role_error_not_found: 'Error: Rol counter no encontrado. Por favor, contacta a un administrador.',
    role_error_missing_permission: 'Error: El bot no tiene permiso para gestionar roles. Por favor, contacta a un administrador.',
    role_error_hierarchy: 'Error: El rol del bot no está lo suficientemente alto en la jerarquía. Por favor, contacta a un administrador.',
    
    // User command translations
    user_stats_title: 'Estadísticas de Usuario',
    user_stats_description: username => `Estadísticas para ${username}`,
    user_stats_language: 'Idioma',
    user_stats_failed_counts: 'Conteos Fallidos',
    user_stats_successful_counts: 'Conteos Exitosos',
    user_stats_current_streak: 'Racha Actual',
    user_stats_highest_streak: 'Mejor Racha',
    
    // Rules command translations
    rules_title: '🎲 Reglas del Juego de Contar',
    rules_description: 'Aquí te explicamos cómo jugar al juego de contar:',
    rules_basic_title: '📝 Reglas Básicas',
    rules_basic_content: '• Cuenta desde 1, un número a la vez\n• Cada persona solo puede contar una vez seguida',
    rules_how_to_title: '🎯 Cómo Jugar',
    rules_how_to_content: '• Usa `!register` para unirte y `!lang` para establecer tu idioma\n• Obtén el rol "counter" para empezar a contar',
    rules_mistakes_title: '❌ Errores',
    rules_mistakes_content: '• Si cometes un error, la cuenta se reinicia a 0\n• Tu racha se reinicia y aumenta tu contador de fallos',
    rules_saves_title: '💾 Salvados',
    rules_saves_content: '• Usa `!saves` para ver cómo funcionan los salvados\n• Cada salvado evita que un error reinicie la cuenta',
    rules_stats_title: '📊 Estadísticas',
    rules_stats_content: '• Usa `!user` para ver tus estadísticas\n• Usa `!server` para ver las estadísticas del servidor',
    rules_footer: username => `Solicitado por ${username}`,
    
    // Commands list translations
    commands_title: 'Comandos Disponibles',
    commands_description: 'Aquí están todos los comandos que puedes usar:',
    commands_footer: username => `Solicitado por ${username}`,
    
    // Console messages for administrators
    console_invite_link: 'Añade este bot a tu servidor usando el siguiente enlace:'
};

module.exports = translations; 