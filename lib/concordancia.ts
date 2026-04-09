/**
 * Motor de concordancia gramatical para PoderGen
 * Maneja género (M/F) y número (singular/plural) del poderdante y apoderados
 */

import type { PoderData } from '@/types/poder';

export interface Concordancia {
  // Poderdante
  elLa: string;           // "el" / "la"
  elLaEN: string;         // "he" / "she"
  loLa: string;           // "lo" / "la" (objeto)
  delDe: string;          // "del" / "de la"
  alA: string;            // "al" / "a la"
  otorgante: string;      // "otorgante" (invariable en este contexto)
  compareciente: string;  // "compareciente" (invariable)
  nacidoA: string;        // "nacido" / "nacida"
  nacidoAEN: string;      // "born"
  identificadoA: string;  // "identificado" / "identificada"
  identificadoAEN: string;// "identified"
  manifestoA: string;     // (invariable "manifestó")
  laEl: string;           // "la" / "el" (artículo antes de "otorgante")

  // Apoderados (1 o varios)
  numApoderados: number;
  losLas: string;         // "los" / "las" — pero apoderados = mixto → "los"
  apoderadoS: string;     // "apoderado" / "apoderados"
  apoderadoSEN: string;   // "proxy" / "proxies"
  conjuntaO: string;      // "conjuntamente o por separado" (invariable)
  ellosEllas: string;     // "ellos" (mixto siempre)
}

export function buildConcordancia(data: PoderData): Concordancia {
  const genero = data.poderdante.genero; // 'M' | 'F'
  const f = genero === 'F';
  const n = data.apoderados.length;

  return {
    // Poderdante
    elLa: f ? 'la' : 'el',
    elLaEN: f ? 'she' : 'he',
    loLa: f ? 'la' : 'lo',
    delDe: f ? 'de la' : 'del',
    alA: f ? 'a la' : 'al',
    otorgante: 'otorgante',       // invariable en notarial MX
    compareciente: 'compareciente', // invariable
    nacidoA: f ? 'nacida' : 'nacido',
    nacidoAEN: 'born',
    identificadoA: f ? 'identificada' : 'identificado',
    identificadoAEN: f ? 'identified herself' : 'identified himself',
    manifestoA: 'manifestó',      // invariable
    laEl: f ? 'la' : 'el',

    // Apoderados — siempre masculino genérico en español notarial
    numApoderados: n,
    losLas: 'los',
    apoderadoS: n === 1 ? 'apoderado' : 'apoderados',
    apoderadoSEN: n === 1 ? 'proxy' : 'proxies',
    conjuntaO: n === 1
      ? 'de forma individual'
      : 'conjuntamente o por separado',
    ellosEllas: 'ellos',
  };
}

/**
 * Construye el texto de apoderados con lógica "y/o" o individual
 */
export function buildApoderadosTexto(data: PoderData): string {
  const aps = data.apoderados;
  if (aps.length === 1) return aps[0].nombre;
  if (aps.length === 2) return `${aps[0].nombre} y/o ${aps[1].nombre}`;
  const todos = aps.map(a => a.nombre);
  const ultimo = todos.pop();
  return `${todos.join(', ')} y/o ${ultimo}`;
}

/**
 * Textos del certificado notarial según género
 */
export function buildCertificacionTextos(data: PoderData, c: Concordancia) {
  const p = data.poderdante;
  const nombre = p.nombre.toUpperCase();

  return {
    puntoI_ES: `I.- Que conozco personalmente ${c.alA} ${c.otorgante} del presente instrumento y que tiene la capacidad legal para otorgar este documento.`,
    puntoI_EN: `I.- That I personally know the grantor of this instrument and that ${c.elLaEN} has legal capacity to grant this document.`,

    puntoII_ES: `II.- Que ${c.laEl} ${c.otorgante} se identifica ante mí con Pasaporte ${p.nacionalidad} número: ${p.pasaporte}, ${c.nacidoA} el día ${p.fechaNacimiento}.`,
    puntoII_EN: `II.- That the appearing party ${c.identificadoAEN} with ${c.elLaEN.charAt(0).toUpperCase() + c.elLaEN.slice(1)}r ${p.nacionalidad} Passport number: ${p.pasaporte}, ${c.nacidoAEN} ${p.fechaNacimiento}.`,

    puntoIII_ES: `III.- Que por sus generales ${c.laEl} ${c.compareciente}, bajo protesta de decir verdad, manifiesta ser:\na. Mayor de edad.\nb. ${data.poderdante.estadoCivil === 'casado' ? (c.elLa === 'la' ? 'Casada' : 'Casado') : data.poderdante.estadoCivil === 'soltero' ? (c.elLa === 'la' ? 'Soltera' : 'Soltero') : data.poderdante.estadoCivil === 'divorciado' ? (c.elLa === 'la' ? 'Divorciada' : 'Divorciado') : data.poderdante.estadoCivil === 'viudo' ? (c.elLa === 'la' ? 'Viuda' : 'Viudo') : 'En unión libre'}.\nc. ${p.ocupacion || 'No especificado'}.\nd. De nacionalidad ${p.nacionalidad}.\ne. Domicilio: ${p.domicilio}.`,
    puntoIII_EN: `III.- That as ${c.elLaEN.charAt(0).toUpperCase() + c.elLaEN.slice(1)}r general information, the appearing party stated to be:\na. Of Legal Age.\nb. ${data.poderdante.estadoCivil === 'casado' ? 'Married' : data.poderdante.estadoCivil === 'soltero' ? 'Single' : data.poderdante.estadoCivil === 'divorciado' ? 'Divorced' : data.poderdante.estadoCivil === 'viudo' ? 'Widowed' : 'Common-law union'}.\nc. ${p.ocupacion || 'Not specified'}.\nd. ${p.nacionalidad} Nationality.\ne. Address: ${p.domicilio}.`,

    puntoIV_ES: `IV.- Que este instrumento se otorga en los idiomas inglés y español y que manifestó expresamente ${c.laEl} parte ${c.otorgante} que por este medio aprueba la versión en español, ya que éste es una traducción fiel y correcta en todos sus términos, de la versión en inglés.`,
    puntoIV_EN: `IV.- That this instrument is granted in the Spanish and the English languages and that the grantor expressly manifests through this means that ${c.elLaEN} approves of the Spanish version, because it is a true and correct translation in all of its terms, of the English version.`,

    leido_ES: `Leído que fue por mí, el Notario, el Instrumento que antecede ${c.alA} ${c.otorgante} y previa explicación y advertencia que le hice sobre su validez, alcance y consecuencias legales, se manifestó conforme con su contenido y lo ratifica y firma ante mí.`,
    leido_EN: `This instrument read by me, the Notary, to the grantor and previous explanation and warnings I made about its validity, scope and legal consequences, ${c.elLaEN} stated ${c.elLaEN.charAt(0).toUpperCase() + c.elLaEN.slice(1)}r agreement to its contents, ratified, and signed it before me.`,

    // Intro
    compareció_ES: `El Notario Público que autoriza, certifica: que ante mí compareció ${nombre}, a fin de:`,
    compareció_EN: `The Notary Public who authorizes certifies that: ${nombre}, appeared before me to:`,

    // Firma
    firma_label_ES: `${nombre}\n${c.elLa.charAt(0).toUpperCase() + c.elLa.slice(1)} Poderdante / Grantor`,
  };
}
