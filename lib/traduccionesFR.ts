/**
 * Traducciones al francés de todos los textos del poder notarial bilingüe
 * ES (columna izquierda) → FR (columna derecha)
 */

export const FR = {
  // ── PROEMIO ────────────────────────────────────────────────────────
  hacerConstar: 'ACTE:',
  
  // ── CLÁUSULAS ──────────────────────────────────────────────────────
  clausulas: 'C L A U S E S\u00a0:',

  // ── PRIMERA ────────────────────────────────────────────────────────
  primeraHeader: 'PREMIÈRE.- OCTROI DE PROCURATION',
  primera: (nombre: string, tipo: string, apoderados: string) =>
    `${nombre}, accorde PROCURATION POUR PROCÉDURES ET RECOUVREMENTS, ACTES D'ADMINISTRATION ET DOMAINE LIMITÉ en faveur de ${apoderados}, pour être exercée, conjointement ou séparément, selon les termes autorisés par les paragraphes premier, deuxième et troisième de l'article 2554 du Code Civil Fédéral mexicain, et leurs équivalents dans les autres entités de la République, ainsi que selon le Protocole sur l'Uniformité du Régime Légal des Procurations, approuvé par la résolution XLVIII de la Septième Conférence Internationale Américaine de l'Union Panaméricaine, signé par le Mexique le 7 mai 1953, et la Convention Interaméricaine sur le Régime Légal des Procurations à utiliser à l'étranger, approuvée par l'Organisation des États Américains le 30 janvier 1975 et adoptée par le Mexique le 6 février 1987; conformément au Code Civil Fédéral et aux articles correspondants des divers Codes Civils des Entités Fédératives des États-Unis Mexicains; les mandataires pourront signer toute documentation publique ou privée nécessaire à l'exercice de la présente procuration, avec les facultés les plus étendues pour atteindre l'objet de la Procuration ici accordée, et pourra être exercée devant des Personnes Privées, ou devant des Autorités Administratives et Judiciaires dont la juridiction est Fédérale, Étatique ou Municipale.`,

  // ── SEGUNDA ────────────────────────────────────────────────────────
  segundaHeader: 'DEUXIÈME.- LIMITATION',
  segundaFideicomiso: (num: string, banco: string) =>
    `La présente procuration est accordée de manière limitée sur le bien immobilier suivant, contenu dans le Fonds Fiduciaire identifié administrativement sous le numéro ${num}${banco ? `, ${banco}` : ''}:`,
  segundaEscritura: `La présente procuration est accordée de manière limitée sur le bien immobilier suivant appartenant au mandant:`,
  inmuebleLabel: 'BIEN IMMOBILIER:',
  hereinafter: 'CI-APRÈS LE BIEN IMMOBILIER.',
  predial: (num: string) => `Le BIEN IMMOBILIER correspond au compte foncier ${num}.`,

  // ── TERCERA ────────────────────────────────────────────────────────
  terceraHeader: 'TROISIÈME.- LIMITATION AU BIEN IMMOBILIER',
  tercera: `La présente procuration sera large et générale quant à ses facultés et limitée quant à son objet, de sorte qu'elle ne pourra être exercée qu'en ce qui concerne le BIEN IMMOBILIER mentionné ci-dessus.`,

  // ── CUARTA ─────────────────────────────────────────────────────────
  cuartaHeader: 'QUATRIÈME.- FACULTÉS DU MANDATAIRE',
  cuarta: (apoderados: string, facultades: string, esFideicomiso: boolean) =>
    `La procuration ici accordée est conférée UNIQUEMENT ET EXCLUSIVEMENT pour que les mandataires, conjointement ou séparément, en faveur du mandant: ${facultades}; en ce qui concerne ${esFideicomiso ? "les droits fiduciaires du fonds fiduciaire mentionné à la DEUXIÈME CLAUSE qui affecte le BIEN IMMOBILIER" : "le BIEN IMMOBILIER mentionné à la DEUXIÈME CLAUSE"}.`,

  // Facultades FR
  facultades: {
    adquirirDerechos: "Acquérir des droits et obligations fiduciaires",
    darInstrucciones: "Donner des instructions au Fiduciaire correspondant",
    enajenar: "Effectuer des aliénations ou tout acte translatif de propriété",
    cederDerechos: "Céder des droits fiduciaires",
    donaciones: "Effectuer des donations",
    conveniosModificatorios: "Conclure des avenants et modifications",
    ejecucionAmpliaFideicomiso: "Exécuter ou élargir le fonds fiduciaire",
    ratificarInstrumentoPublico: "Ratifier et comparaître dans un acte public",
    otorgarFiniquito: "Accorder quittance au fiduciaire",
    firmarDocumentos: "Signer des documents publics ou privés devant toute personne physique, morale, autorité ou notaire",
    escrow: "Souscrire les formulaires nécessaires auprès de la société d'entiercement correspondante",
    isr: "Demander le calcul, l'exonération et la déduction en vertu de la Loi de l'Impôt sur le Revenu",
    sustitucionFiduciaria: "Demander et gérer la substitution du fiduciaire, ainsi que le transfert du fonds fiduciaire à une autre institution fiduciaire",
  } as Record<string, string>,

  // ── RÉGIMEN LEGAL CCF ──────────────────────────────────────────────
  regimenHeader: 'RÉGIME LÉGAL DU MANDAT — CODE CIVIL FÉDÉRAL',
  art2554: `"Article 2 554.- Dans toutes les procurations générales pour procédures et recouvrements, il suffira de stipuler qu'elles sont accordées avec toutes les facultés générales et les facultés spéciales requérant une clause spéciale conformément à la loi, pour qu'elles soient réputées conférées sans aucune limitation. Dans les procurations générales pour administrer des biens, il suffira d'exprimer qu'elles sont accordées avec ce caractère, pour que le mandataire ait toutes les facultés administratives. Dans les procurations générales pour exercer des actes de propriété, il suffira qu'elles soient accordées avec ce caractère pour que le mandataire ait toutes les facultés du propriétaire, aussi bien en ce qui concerne les biens qu'en ce qui concerne toutes les démarches pour les défendre. Lorsqu'il est souhaité de limiter, dans les trois cas mentionnés ci-dessus, les facultés du mandataire, les limitations seront consignées, ou les procurations seront spéciales. Les notaires inséreront cet article dans les témoignages des procurations qu'ils accordent."`,
  art2555: `"Article 2 555.- Le mandat doit être accordé par acte public ou par lettre de procuration signée devant deux témoins et dont les signatures du mandant et des témoins sont ratifiées devant notaire, devant les juges ou les autorités administratives correspondantes: I. Lorsqu'il est général..."`,
  art2596: `"Article 2 596.- Le mandant peut révoquer le mandat quand et comme il le juge opportun; sauf dans les cas où son octroi a été stipulé comme condition dans un contrat bilatéral, ou comme moyen de remplir une obligation contractée. Dans ces cas, le mandataire ne peut pas non plus renoncer au pouvoir. La partie qui révoque ou renonce au mandat en temps inopportun doit indemniser l'autre des dommages et préjudices causés."`,

  // ── RÉGIMEN NAYARIT ────────────────────────────────────────────────
  nayaritHeader: 'CODE CIVIL DE L\'ÉTAT DE NAYARIT',
  art1926: `"Article 1 926.- Dans toutes les procurations générales pour procédures et recouvrements, il suffira de stipuler qu'elles sont accordées avec toutes les facultés générales et les facultés spéciales requérant une clause spéciale conformément à la loi, pour qu'elles soient réputées conférées sans aucune limitation. Dans les procurations générales pour administrer des biens, il suffira d'exprimer qu'elles sont accordées avec ce caractère, pour que le mandataire ait toutes les facultés du propriétaire, aussi bien en ce qui concerne les biens qu'en ce qui concerne toutes les démarches pour les défendre. Lorsqu'il est souhaité de limiter, dans les trois cas mentionnés ci-dessus, les facultés du mandataire, les limitations seront consignées ou les procurations seront spéciales. Les notaires inséreront cet article dans les témoignages des procurations qu'ils accordent."`,
  art1927: `"Article 1 927.- Le mandat doit être accordé par acte public ou par lettre de procuration signée devant deux témoins dont les signatures du mandant et des témoins sont ratifiées devant notaire, devant les juges ou les autorités administratives correspondantes: I.- Lorsqu'il est général; II.- Lorsque l'intérêt de l'affaire pour laquelle il est conféré est supérieur à l'équivalent de mille fois le salaire minimum général en vigueur dans l'État de Nayarit, au moment de l'octroi; ou lorsqu'il est requis pour l'aliénation de biens immobiliers. III.- Lorsqu'en vertu de celui-ci, le mandataire doit exécuter au nom du mandant un acte qui, conformément à la loi, doit figurer dans un acte public; et IV.- Pour que le mandataire puisse faire des donations au nom ou pour le compte du mandant, ce dernier devra accorder une procuration spéciale dans chaque cas."`,

  // ── RÉGIMEN JALISCO ────────────────────────────────────────────────
  jaliscoHeader: 'CODE CIVIL DE L\'ÉTAT DE JALISCO',
  art2207: `"Article 2 207.- Dans les procurations générales judiciaires, il suffira de stipuler qu'elles sont accordées avec ce caractère, pour que le mandataire puisse représenter le mandant dans toute affaire de juridiction volontaire, mixte et contentieuse, du début jusqu'à la fin; à condition qu'il ne s'agisse pas d'actes que les lois exigent une procuration spéciale, auquel cas les facultés conférées avec leur caractère de spécialité seront consignées en détail. Dans les procurations générales pour administrer des biens, il suffira de stipuler qu'elles sont accordées avec ce caractère, pour que le mandataire ait toutes les facultés administratives. Dans les procurations générales pour exercer des actes de propriété, il suffira d'exprimer qu'elles sont conférées avec ce caractère, afin que le mandataire ait toutes les facultés du propriétaire, en ce qui concerne les biens ainsi que leur défense."`,
  art2204: `"Article 2 204.- Le mandat doit être formalisé par écrit et accordé: I. Par acte public: a) Chaque fois qu'il est général; b) Lorsqu'il se rapporte à des biens immobiliers ou à des droits réels; c) Lorsque l'affaire pour laquelle il est conféré dépasse un montant équivalent à 300 fois la valeur journalière de l'Unité de Mesure et d'Actualisation; et d) Lorsqu'en vertu de celui-ci, le mandataire doit exécuter un acte qui, conformément à la loi, doit figurer dans un acte public."`,
  art2244: `"Article 2 244.- Le mandat pourra être révoqué à tout moment et librement par le mandant ou renoncé de la même façon par le mandataire. Toute stipulation contraire sera nulle de plein droit et réputée non écrite. La partie qui révoque ou renonce au mandat en temps inopportun devra indemniser l'autre partie des dommages et préjudices causés."`,

  // ── CERTIFICACIÓN ──────────────────────────────────────────────────
  certHeader: 'CERTIFICATION NOTARIALE',
  certYo: 'Moi, le Notaire, Certifie et atteste:',
  
  certI: (ala: string) => `I.- Que je connais personnellement ${ala} mandant du présent instrument et que ${ala === 'la' ? 'elle' : 'il'} a la capacité légale d'accorder ce document.`,
  certII: (article: string, nationalite: string, passeport: string, naissance: string, sexe: 'M' | 'F') =>
    `II.- Que ${article} mandant s'identifie devant moi avec son Passeport ${nationalite} numéro: ${passeport}, ${sexe === 'F' ? 'née' : 'né'} le ${naissance}.`,
  certIII: (article: string, etatCivil: string, occupation: string, nationalite: string, domicile: string, sexe: 'M' | 'F') =>
    `III.- Que selon ses renseignements généraux, ${article} comparant${sexe === 'F' ? 'e' : ''}, sous serment de dire la vérité, déclare être:\na. Majeur${sexe === 'F' ? 'e' : ''} d'âge.\nb. ${etatCivil}.\nc. ${occupation}.\nd. De nationalité ${nationalite}.\ne. Domicile: ${domicile}.`,
  certIV: (article: string, il: string) =>
    `IV.- Que le présent instrument est accordé en langues espagnole et ${il === 'fr' ? 'française' : 'anglaise'} et que ${article} mandant a expressément déclaré approuver la version en espagnol, celle-ci étant une traduction fidèle et correcte en tous ses termes de la version en ${il === 'fr' ? 'français' : 'anglais'}.`,
  leido: (ala: string, lo: string) =>
    `Après lecture par moi, le Notaire, de l'Instrument précédent ${ala} mandant, et après lui avoir expliqué et averti de sa validité, portée et conséquences légales, ${ala === 'la' ? 'elle' : 'il'} s'est déclaré${ala === 'la' ? 'e' : ''} conforme à son contenu et ${lo} ratifie et signe devant moi.`,

  // Modo suscrito FR
  suscritos_sing_M: 'Le soussigné',
  suscritos_sing_F: 'La soussignée',
  suscritos_plur_M: 'Les soussignés',
  suscritos_plur_F: 'Les soussignées',
  comparezco_sing: 'comparais aux fins de:',
  comparezco_plur: 'comparaissons aux fins de:',
  hacerConstarSuscrito: 'ACTE:',

  firmaLabel_M: 'Le Mandant / Grantor',
  firmaLabel_F: 'La Mandante / Grantor',
  firmaLabelPlur: 'Les Mandants / Grantors',

  // Estados civiles FR
  estadosCiviles: {
    soltero_M: 'Célibataire',
    soltero_F: 'Célibataire',
    casado_M: 'Marié',
    casado_F: 'Mariée',
    divorciado_M: 'Divorcé',
    divorciado_F: 'Divorcée',
    viudo_M: 'Veuf',
    viudo_F: 'Veuve',
    union_libre_M: 'Union libre',
    union_libre_F: 'Union libre',
  } as Record<string, string>,

  // Modo notarial FR intro
  comparecioPluralFR: (nombres: string) => `Le Notaire Public soussigné certifie que: ${nombres}, ont comparu devant moi aux fins de:`,
  comparecioSingFR: (nombre: string) => `Le Notaire Public soussigné certifie que: ${nombre}, a comparu devant moi aux fins de:`,

  firmaRatificacion: 'SIGNATURE ET RATIFICATION',
  enFeDeLo: (ala: string) => `En foi de ce qui précède, ${ala === 'la' ? 'la' : 'le'} mandant signe le présent instrument.`,
};
