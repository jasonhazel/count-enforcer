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
        "¡PAN DE PLÁTANO, TÍO, EN EL PUTO TRABAJO, TÍO!!!! ¡JODER SÍ!!"
};

module.exports = translations; 