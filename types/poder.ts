export type Genero = 'M' | 'F';
export type EstadoCivil = 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'union_libre';
export type TipoPoder = 'pleitos_cobranzas' | 'administracion' | 'dominio';
export type ModoTitulo = 'fideicomiso' | 'escritura';
export type ModoProemio = 'notarial' | 'suscrito';
export type RegimenEstado = 'nayarit' | 'jalisco';

export interface Poderdante {
  nombre: string;
  nacionalidad: string;
  estadoCivil: EstadoCivil;
  ocupacion: string;
  domicilio: string;
  pasaporte: string;
  fechaNacimiento: string;
  genero: Genero;
}

export interface Apoderado {
  nombre: string;
}

export interface Inmueble {
  modo: ModoTitulo;
  descripcion: string;      // ES
  descripcionEN: string;    // EN — generada con IA o manual
  fideicomisoNumero: string;
  bancoFiduciario: string;
  cuentaPredial: string;
  escrituraNumero: string;
  escrituraFecha: string;
  escrituraNotario: string;
  escrituraNotaria: string;
  escrituraVolumen: string;
  escrituraFolio: string;
  // ── RPP ──
  rppEstado: string;       // 'nayarit' | 'jalisco' | ''
  rppTipo: string;         // 'folio_real' | 'legacy'
  rppFolioReal: string;
  rppLibroNay: string;
  rppSeccionNay: string;
  rppSerieNay: string;
  rppPartidaNay: string;
  rppDocumentoJal: string;
  rppFoliosJal: string;
  rppLibroJal: string;
  rppSeccionJal: string;
  nombreCondominio?: string;
  departamento?: string;
  direccion?: string;
  municipio?: string;
  estado?: string;
  cp?: string;
}

export interface Facultades {
  adquirirDerechos: boolean;
  darInstrucciones: boolean;
  enajenar: boolean;
  cederDerechos: boolean;
  donaciones: boolean;
  conveniosModificatorios: boolean;
  ejecucionAmpliaFideicomiso: boolean;
  ratificarInstrumentoPublico: boolean;
  otorgarFiniquito: boolean;
  firmarDocumentos: boolean;
  escrow: boolean;
  isr: boolean;
}

export interface PoderData {
  poderdante: Poderdante;          // Poderdante principal
  poderdantes: Poderdante[];       // Lista completa (incluye el principal)
  apoderados: Apoderado[];
  inmueble: Inmueble;
  tipos: TipoPoder[];
  facultades: Facultades;
  modoProemio: ModoProemio;  // 'notarial' | 'suscrito'
  regimenEstado: RegimenEstado; // 'nayarit' | 'jalisco'
  lugar?: string;
  fecha?: string;
}

export const DEFAULT_PODER: PoderData = {
  poderdante: {
    nombre: '',
    nacionalidad: '',
    estadoCivil: 'casado',
    ocupacion: '',
    domicilio: '',
    pasaporte: '',
    fechaNacimiento: '',
    genero: 'M',
  },
  apoderados: [
    { nombre: 'ROLANDO ROMERO GARCÍA' },
    { nombre: 'CLAUDIA REBECA CASTILLO SOTO' },
  ],
  inmueble: {
    modo: 'fideicomiso',
    descripcion: '',
    descripcionEN: '',
    fideicomisoNumero: '',
    bancoFiduciario: '',
    cuentaPredial: '',
    escrituraNumero: '',
    escrituraFecha: '',
    escrituraNotario: '',
    escrituraNotaria: '',
    escrituraVolumen: '',
    escrituraFolio: '',
    rppEstado: 'nayarit',
    rppTipo: 'folio_real',
    rppFolioReal: '',
    rppLibroNay: '',
    rppSeccionNay: '',
    rppSerieNay: '',
    rppPartidaNay: '',
    rppDocumentoJal: '',
    rppFoliosJal: '',
    rppLibroJal: '',
    rppSeccionJal: '',
  },
  tipos: ['pleitos_cobranzas', 'administracion', 'dominio'],
  modoProemio: 'notarial',
  regimenEstado: 'nayarit',
  poderdantes: [],
  facultades: {
    adquirirDerechos: true,
    darInstrucciones: true,
    enajenar: true,
    cederDerechos: true,
    donaciones: false,
    conveniosModificatorios: true,
    ejecucionAmpliaFideicomiso: true,
    ratificarInstrumentoPublico: true,
    otorgarFiniquito: true,
    firmarDocumentos: true,
    escrow: true,
    isr: true,
  },
  lugar: '',
  fecha: '',
};

export const ESTADO_CIVIL_LABELS: Record<EstadoCivil, { es: string; en: string }> = {
  soltero: { es: 'Soltero(a)', en: 'Single' },
  casado: { es: 'Casado(a)', en: 'Married' },
  divorciado: { es: 'Divorciado(a)', en: 'Divorced' },
  viudo: { es: 'Viudo(a)', en: 'Widowed' },
  union_libre: { es: 'Unión libre', en: 'Common-law union' },
};

export const TIPO_PODER_LABELS: Record<TipoPoder, { es: string; en: string }> = {
  pleitos_cobranzas: { es: 'PODER PARA PLEITOS Y COBRANZAS', en: 'POWER OF ATTORNEY FOR LAWSUITS AND COLLECTIONS' },
  administracion: { es: 'ACTOS DE ADMINISTRACIÓN', en: 'ACTS OF ADMINISTRATION' },
  dominio: { es: 'DOMINIO LIMITADO', en: 'LIMITED DOMAIN' },
};

export const FACULTADES_LABELS: Record<keyof Facultades, { es: string; en: string }> = {
  adquirirDerechos: { es: 'Adquirir derechos y obligaciones fideicomisarios', en: 'Acquire trust rights and obligations' },
  darInstrucciones: { es: 'Girar instrucciones al Fiduciario', en: 'Give instructions to the Trustee' },
  enajenar: { es: 'Llevar a cabo enajenaciones o cualquier acto traslativo de dominio', en: 'Perform transfers of property or any act of conveyance' },
  cederDerechos: { es: 'Cesiones de derechos fideicomisarios', en: 'Transfer of trust rights' },
  donaciones: { es: 'Realizar donaciones', en: 'Make donations' },
  conveniosModificatorios: { es: 'Realizar convenios modificatorios', en: 'Subscribe addendums and amendments' },
  ejecucionAmpliaFideicomiso: { es: 'Ejecución o ampliación del fideicomiso', en: 'Execution or extension of the trust' },
  ratificarInstrumentoPublico: { es: 'Ratificar y comparecer en instrumento público', en: 'Ratify and sign in a public deed' },
  otorgarFiniquito: { es: 'Otorgar finiquito al fiduciario', en: 'Hold the trustee harmless' },
  firmarDocumentos: { es: 'Firmar documentos públicos o privados ante cualquier persona física, moral, autoridad o fedatario', en: 'Sign public or private documents before any person, corporation, authority or notary public' },
  escrow: { es: 'Suscribir los formatos necesarios ante la empresa escrow correspondiente', en: 'Sign the necessary forms with the corresponding escrow company' },
  isr: { es: 'Solicitar el cálculo, la exención y deducción en términos de la Ley del ISR', en: 'Request estimate, exemption and deduction pursuant to the Capital Gains Tax Law' },
};
