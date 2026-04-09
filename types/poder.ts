export type Genero = 'M' | 'F';
export type EstadoCivil = 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'union_libre';
export type TipoPoder = 'pleitos_cobranzas' | 'administracion' | 'dominio';

export interface Poderdante {
  nombre: string;
  nacionalidad: string;
  estadoCivil: EstadoCivil;
  ocupacion: string;
  domicilio: string;
  pasaporte: string;
  fechaNacimiento: string; // DD/MM/YYYY
  genero: Genero;
}

export interface Apoderado {
  nombre: string;
}

export interface Inmueble {
  descripcion: string;
  fideicomisoNumero: string;
  bancoFiduciario: string;
  cuentaPredial: string;
  // Parsed fields for display
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
  poderdante: Poderdante;
  apoderados: Apoderado[];
  inmueble: Inmueble;
  tipos: TipoPoder[];
  facultades: Facultades;
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
    descripcion: '',
    fideicomisoNumero: '',
    bancoFiduciario: 'BANCO MERCANTIL DEL NORTE, SOCIEDAD ANÓNIMA, INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO BANORTE, DIVISIÓN FIDUCIARIA',
    cuentaPredial: '',
  },
  tipos: ['pleitos_cobranzas', 'administracion', 'dominio'],
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
  pleitos_cobranzas: {
    es: 'PODER PARA PLEITOS Y COBRANZAS',
    en: 'POWER OF ATTORNEY FOR LAWSUITS AND COLLECTIONS',
  },
  administracion: {
    es: 'ACTOS DE ADMINISTRACIÓN',
    en: 'ACTS OF ADMINISTRATION',
  },
  dominio: {
    es: 'DOMINIO LIMITADO',
    en: 'LIMITED DOMAIN',
  },
};

export const FACULTADES_LABELS: Record<keyof Facultades, { es: string; en: string }> = {
  adquirirDerechos: {
    es: 'Adquirir derechos y obligaciones fideicomisarios',
    en: 'Acquire trust rights and obligations',
  },
  darInstrucciones: {
    es: 'Girar instrucciones al Fiduciario',
    en: 'Give instructions to the Trustee',
  },
  enajenar: {
    es: 'Llevar a cabo enajenaciones o cualquier acto traslativo de dominio',
    en: 'Perform transfers of property or any act of conveyance',
  },
  cederDerechos: {
    es: 'Cesiones de derechos fideicomisarios',
    en: 'Transfer of trust rights',
  },
  donaciones: {
    es: 'Realizar donaciones',
    en: 'Make donations',
  },
  conveniosModificatorios: {
    es: 'Realizar convenios modificatorios',
    en: 'Subscribe addendums and amendments',
  },
  ejecucionAmpliaFideicomiso: {
    es: 'Ejecución o ampliación del fideicomiso',
    en: 'Execution or extension of the trust',
  },
  ratificarInstrumentoPublico: {
    es: 'Ratificar y comparecer en instrumento público',
    en: 'Ratify and sign in a public deed',
  },
  otorgarFiniquito: {
    es: 'Otorgar finiquito al fiduciario',
    en: 'Hold the trustee harmless',
  },
  firmarDocumentos: {
    es: 'Firmar documentos públicos o privados ante cualquier persona física, moral, autoridad o fedatario',
    en: 'Sign public or private documents before any person, corporation, authority or notary public',
  },
  escrow: {
    es: 'Suscribir los formatos necesarios ante la empresa escrow correspondiente',
    en: 'Sign the necessary forms with the corresponding escrow company',
  },
  isr: {
    es: 'Solicitar el cálculo, la exención y deducción en términos de la Ley del ISR',
    en: 'Request estimate, exemption and deduction pursuant to the Capital Gains Tax Law',
  },
};
