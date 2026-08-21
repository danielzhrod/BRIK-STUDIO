/**
 * =====================================================================
 * DOMINIOS DE CORREO DESECHABLE
 * ---------------------------------------------------------------------
 * Servicios de buzón temporal. Quien escribe desde uno de estos no puede
 * recibir la respuesta pasados unos minutos, así que un mensaje enviado
 * desde aquí no sirve de nada.
 *
 * PARA AMPLIAR: añade el dominio en minúsculas a la lista. La
 * comprobación tiene en cuenta los subdominios, así que bloquear
 * `mailinator.com` cubre también `correo.mailinator.com`.
 * =====================================================================
 */
export const DISPOSABLE_DOMAINS: readonly string[] = [
  // --- Los grandes clásicos ---
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'spam4.me',
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.org',
  '20minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'temp-mail.io',
  'tempmail.net',
  'tempmailo.com',
  'tempail.com',
  'tmpmail.org',
  'tmpmail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'trashmail.de',
  'trashmail.net',
  'trash-mail.com',
  'wegwerfmail.de',
  'getnada.com',
  'nada.email',
  'inboxkitten.com',
  'maildrop.cc',
  'mailnesia.com',
  'mailcatch.com',
  'dispostable.com',
  'throwawaymail.com',
  'throwaway.email',
  'fakeinbox.com',
  'fakemail.net',
  'mytemp.email',
  'emailondeck.com',
  'mohmal.com',
  'moakt.com',
  'linshiyouxiang.net',

  // --- Rotatorios y alias de un solo uso ---
  'burnermail.io',
  'anonaddy.me',
  'anonaddy.com',
  'simplelogin.io',
  'spamgourmet.com',
  'jetable.org',
  'mailexpire.com',
  'incognitomail.com',
  'discard.email',
  'discardmail.com',
  'spambog.com',
  'spambox.us',
  'mailtemp.net',
  'tempinbox.com',
  'mail-temporaire.fr',
  'correotemporal.org',
  'correotemporal.com',

  // --- Variantes con nombres graciosos ---
  'nowmymail.com',
  'yeah.net',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'einrot.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'deadaddress.com',
  'mailmetrash.com',
  'trbvm.com',
  'binkmail.com',
  'bobmail.info',
  'chammy.info',
  'devnullmail.com',
  'letthemeatspam.com',
  'mailin8r.com',
  'mailinator2.com',
  'notmailinator.com',
  'reallymymail.com',
  'sogetthis.com',
  'thisisnotmyrealemail.com',
  'veryrealemail.com',
  'zippymail.info',
] as const;

/**
 * Dominios de primer nivel que no existen fuera de entornos de prueba.
 * Reservados por la RFC 2606 y RFC 6761: nunca van a llegar a un buzón real.
 */
export const INVALID_TLDS: readonly string[] = [
  'test',
  'invalid',
  'example',
  'local',
  'localhost',
  'localdomain',
  'internal',
  'lan',
  'home',
  'corp',
] as const;
