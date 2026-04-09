import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  convertInchesToTwip,
  PageOrientation,
  ShadingType,
} from 'docx';
import type { PoderData, Facultades } from '@/types/poder';
import { buildConcordancia, buildApoderadosTexto, buildCertificacionTextos, buildPoderdantesStr, getGeneroGrupo, esMultiple } from '@/lib/concordancia';
import { FR } from '@/lib/traduccionesFR';
import {
  ESTADO_CIVIL_LABELS,
  TIPO_PODER_LABELS,
  FACULTADES_LABELS,
} from '@/types/poder';

// Helper: create a bilingual row (ES left, EN right)
function biRow(
  es: string,
  en: string,
  opts: { bold?: boolean; center?: boolean; size?: number; shade?: boolean } = {}
): TableRow {
  const { bold = false, center = false, size = 18, shade = false } = opts;

  const makeCell = (text: string): TableCell =>
    new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      shading: shade
        ? { type: ShadingType.SOLID, color: 'F0EAD8', fill: 'F0EAD8' }
        : undefined,
      borders: {
        top: { style: BorderStyle.NONE, size: 0 },
        bottom: { style: BorderStyle.NONE, size: 0 },
        left: { style: BorderStyle.NONE, size: 0 },
        right: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: 'C9A84C',
        },
      },
      margins: {
        top: 60,
        bottom: 60,
        left: 120,
        right: 120,
      },
      children: [
        new Paragraph({
          alignment: center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text,
              bold,
              size,
              font: 'Times New Roman',
            }),
          ],
        }),
      ],
    });

  return new TableRow({
    children: [makeCell(es), makeCell(en)],
  });
}

// Helper: section header row (gold background)
function headerRow(esTitle: string, enTitle: string): TableRow {
  const makeHeaderCell = (text: string): TableCell =>
    new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.SOLID, color: 'C9A84C', fill: 'C9A84C' },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: 'C9A84C' },
        bottom: { style: BorderStyle.SINGLE, size: 6, color: 'C9A84C' },
        left: { style: BorderStyle.NONE, size: 0 },
        right: { style: BorderStyle.SINGLE, size: 6, color: '8B6914' },
      },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text,
              bold: true,
              size: 18,
              color: '0A1628',
              font: 'Times New Roman',
            }),
          ],
        }),
      ],
    });

  return new TableRow({
    children: [makeHeaderCell(esTitle), makeHeaderCell(enTitle)],
  });
}

// Helper: empty spacer row
function spacerRow(): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE, size: 0 },
          bottom: { style: BorderStyle.NONE, size: 0 },
          left: { style: BorderStyle.NONE, size: 0 },
          right: { style: BorderStyle.SINGLE, size: 6, color: 'C9A84C' },
        },
        children: [new Paragraph({ children: [new TextRun({ text: '', size: 10 })] })],
      }),
      new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE, size: 0 },
          bottom: { style: BorderStyle.NONE, size: 0 },
          left: { style: BorderStyle.NONE, size: 0 },
          right: { style: BorderStyle.NONE, size: 0 },
        },
        children: [new Paragraph({ children: [new TextRun({ text: '', size: 10 })] })],
      }),
    ],
  });
}

// apoderadosStr ahora viene del motor de concordancia
function buildPoderTitulo(data: PoderData): string {
  const tipos = data.tipos.map((t) => TIPO_PODER_LABELS[t].es).join(', ');
  return `PODER PARA ${tipos}`.replace('PODER PARA PODER PARA', 'PODER PARA');
}

function buildPoderTituloEN(data: PoderData): string {
  const tipos = data.tipos.map((t) => TIPO_PODER_LABELS[t].en).join(', ');
  return `POWER OF ATTORNEY FOR ${tipos}`;
}

function getEstadoCivil(data: PoderData): { es: string; en: string } {
  return ESTADO_CIVIL_LABELS[data.poderdante.estadoCivil];
}

function buildFacultadesText(facultades: Facultades): { es: string; en: string } {
  const esItems: string[] = [];
  const enItems: string[] = [];
  for (const key of Object.keys(facultades) as (keyof Facultades)[]) {
    if (facultades[key]) {
      esItems.push(FACULTADES_LABELS[key].es);
      enItems.push(FACULTADES_LABELS[key].en);
    }
  }
  return {
    es: esItems.join('; '),
    en: enItems.join('; '),
  };
}

export async function generatePoderDocx(data: PoderData): Promise<Blob> {
  // Múltiples poderdantes
  const todosLosPoderdantes = data.poderdantes?.length > 0 ? data.poderdantes : [data.poderdante];
  const multiple = todosLosPoderdantes.length > 1;
  const poderdantesStr = buildPoderdantesStr(data);
  // Concordancia: usa el primer poderdante para género base; si múltiple, masculino genérico
  const c = buildConcordancia({ ...data, poderdante: todosLosPoderdantes[0] });
  const apoderadosStr = buildApoderadosTexto(data);
  const numApoderados = data.apoderados.length;
  const soloUnApo = numApoderados === 1;
  // Concordancia de apoderados
  const apoEjercite  = soloUnApo ? 'lo ejercite'            : 'lo ejerciten';
  const apoConjunta  = soloUnApo ? ''                       : ', conjuntamente o por separado,';
  const apoPodrán    = soloUnApo ? 'el apoderado podrá'     : 'los apoderados podrán';
  const apoTheProxy  = soloUnApo ? 'The proxy may'          : 'The proxies may';
  const apoParaQue   = soloUnApo ? 'para que el apoderado'  : 'para que los apoderados, conjunta o separadamente,';
  const apoForThe    = soloUnApo ? 'for the proxy'          : 'for the representatives, jointly or separately,';
  const apoJointly   = soloUnApo ? ''                       : ', jointly or separately,';
  const ct = buildCertificacionTextos({ ...data, poderdante: todosLosPoderdantes[0] }, c);
  // Textos plurales para el proemio
  const suscritos_ES = multiple
    ? (todosLosPoderdantes.every(p => p.genero === 'F') ? 'Las suscritas' : 'Los suscritos')
    : (todosLosPoderdantes[0].genero === 'F' ? 'La suscrita' : 'El suscrito');
  const suscritos_EN = 'The undersigned';
  const tipoES = buildPoderTitulo(data);
  const tipoEN = buildPoderTituloEN(data);
  // ecES/ecEN ahora manejados por el motor de concordancia
  const facultadesText = buildFacultadesText(data.facultades);

  // Full property description — ES column
  const inmuebleDesc =
    data.inmueble.descripcion ||
    [data.inmueble.departamento, data.inmueble.nombreCondominio, data.inmueble.direccion,
     data.inmueble.municipio, data.inmueble.estado, data.inmueble.cp ? `C.P. ${data.inmueble.cp}` : '']
    .filter(Boolean).join(', ');

  // EN column — use translation if available, fallback to ES text
  const inmuebleDescEN =
    data.inmueble.descripcionEN?.trim() ||
    data.inmueble.descripcion ||
    [data.inmueble.departamento, data.inmueble.nombreCondominio, data.inmueble.direccion,
     data.inmueble.municipio, data.inmueble.estado, data.inmueble.cp ? `C.P. ${data.inmueble.cp}` : '']
    .filter(Boolean).join(', ');

  // Párrafo de escritura (solo modo escritura)
  const buildRPPES = (): string => {
    const i = data.inmueble;
    if (!i.rppEstado) return '';
    const ciudad = i.escrituraNotaria || (i.rppEstado === 'nayarit' ? 'Bahía de Banderas, Nayarit' : 'Puerto Vallarta, Jalisco');
    const rpp = `Registro Público de la Propiedad y de Comercio de ${ciudad}`;
    if (i.rppTipo === 'folio_real' && i.rppFolioReal) {
      const label = i.rppEstado === 'nayarit' ? 'Folio Real Electrónico' : 'Folio Real';
      return `, inscrito ante el ${rpp}, bajo ${label} número ${i.rppFolioReal}`;
    } else if (i.rppTipo === 'legacy') {
      if (i.rppEstado === 'nayarit' && i.rppLibroNay) {
        return `, inscrito ante el ${rpp}, bajo Libro ${i.rppLibroNay}${i.rppSeccionNay ? ', Sección ' + i.rppSeccionNay : ''}${i.rppSerieNay ? ', Serie ' + i.rppSerieNay : ''}${i.rppPartidaNay ? ', Partida ' + i.rppPartidaNay : ''}`;
      } else if (i.rppEstado === 'jalisco' && i.rppDocumentoJal) {
        return `, inscrito ante el ${rpp}, bajo Documento ${i.rppDocumentoJal}${i.rppFoliosJal ? ', Folios ' + i.rppFoliosJal : ''}${i.rppLibroJal ? ', Libro ' + i.rppLibroJal : ''}${i.rppSeccionJal ? ', Sección ' + i.rppSeccionJal : ''}`;
      }
    }
    return '';
  };

  const buildRPPEN = (): string => {
    const i = data.inmueble;
    if (!i.rppEstado) return '';
    const ciudad = i.escrituraNotaria || (i.rppEstado === 'nayarit' ? 'Bahía de Banderas, Nayarit' : 'Puerto Vallarta, Jalisco');
    const rpp = `Public Registry of Property and Commerce of ${ciudad}`;
    if (i.rppTipo === 'folio_real' && i.rppFolioReal) {
      const label = i.rppEstado === 'nayarit' ? 'Electronic Real Folio' : 'Real Folio';
      return `, registered before the ${rpp}, under ${label} number ${i.rppFolioReal}`;
    } else if (i.rppTipo === 'legacy') {
      if (i.rppEstado === 'nayarit' && i.rppLibroNay) {
        return `, registered before the ${rpp}, under Book ${i.rppLibroNay}${i.rppSeccionNay ? ', Section ' + i.rppSeccionNay : ''}${i.rppSerieNay ? ', Series ' + i.rppSerieNay : ''}${i.rppPartidaNay ? ', Entry ' + i.rppPartidaNay : ''}`;
      } else if (i.rppEstado === 'jalisco' && i.rppDocumentoJal) {
        return `, registered before the ${rpp}, under Document ${i.rppDocumentoJal}${i.rppFoliosJal ? ', Folios ' + i.rppFoliosJal : ''}${i.rppLibroJal ? ', Book ' + i.rppLibroJal : ''}${i.rppSeccionJal ? ', Section ' + i.rppSeccionJal : ''}`;
      }
    }
    return '';
  };

  const buildEscrituraParrafoES = (): string => {
    const i = data.inmueble;
    if (!i.escrituraNumero && !i.escrituraNotario) return '';
    let txt = `El inmueble consta en Escritura Pública número ${i.escrituraNumero || '___'}`;
    if (i.escrituraFecha) txt += `, de fecha ${i.escrituraFecha}`;
    if (i.escrituraNotario) txt += `, otorgada ante el Licenciado ${i.escrituraNotario}`;
    if (i.escrituraNotaria) txt += `, Notario Público ${i.escrituraNotaria}`;
    if (i.escrituraVolumen) txt += `, Volumen ${i.escrituraVolumen}`;
    if (i.escrituraFolio) txt += `, Folio ${i.escrituraFolio}`;
    const rppStr = buildRPPES();
    if (rppStr) txt += rppStr;
    return txt + '.';
  };

  const buildEscrituraParrafoEN = (): string => {
    const i = data.inmueble;
    if (!i.escrituraNumero && !i.escrituraNotario) return '';
    let txt = `The property is described in Public Deed number ${i.escrituraNumero || '___'}`;
    if (i.escrituraFecha) txt += `, dated ${i.escrituraFecha}`;
    if (i.escrituraNotario) txt += `, executed before Notary ${i.escrituraNotario}`;
    if (i.escrituraNotaria) txt += `, Notary Public ${i.escrituraNotaria}`;
    if (i.escrituraVolumen) txt += `, Volume ${i.escrituraVolumen}`;
    if (i.escrituraFolio) txt += `, Folio ${i.escrituraFolio}`;
    const rppStr = buildRPPEN();
    if (rppStr) txt += rppStr;
    return txt + '.';
  };

  const isFR = data.idiomaDoc === 'fr';
  // col2: helper para seleccionar EN o FR en la columna derecha
  // se llama como col2(textEN, textFR)
  const col2 = (en: string, fr: string) => isFR ? fr : en;
  const esFideicomiso = data.inmueble.modo === 'fideicomiso';
  const predialES = data.inmueble.cuentaPredial ? ` A dicho INMUEBLE le corresponde la cuenta predial ${data.inmueble.cuentaPredial}.` : '';
  const predialEN = data.inmueble.cuentaPredial ? ` To said PROPERTY corresponds Property Account No. ${data.inmueble.cuentaPredial}.` : '';
  const escrituraES = !esFideicomiso ? buildEscrituraParrafoES() : '';
  const escrituraEN = !esFideicomiso ? buildEscrituraParrafoEN() : '';

  const rows: TableRow[] = [
    // ===== INTRO =====
    // ── Proemio — varía según modoProemio ──────────────────────────
    biRow(
      data.modoProemio === 'suscrito'
        ? `--- ${suscritos_ES} ${poderdantesStr}, ${multiple ? 'comparecemos' : 'comparezco'} a fin de:`
        : (multiple
            ? `El Notario Público que autoriza, certifica: que ante mí comparecieron ${poderdantesStr}, a fin de:`
            : ct.compareció_ES),
      data.modoProemio === 'suscrito'
        ? `--- ${suscritos_EN} ${poderdantesStr}, appeared to:`
        : (multiple
            ? `The Notary Public who authorizes certifies that: ${poderdantesStr}, appeared before me to:`
            : ct.compareció_EN),
      { center: false }
    ),
    spacerRow(),
    biRow('HACER CONSTAR:', col2('RECORD:', FR.hacerConstar), { bold: true, center: true }),
    spacerRow(),
    biRow(
      data.modoProemio === 'suscrito'
        ? `El ${tipoES}, especial en cuanto a su objeto, pero general en cuanto a sus facultades que en este acto ${multiple ? 'otorgamos y formalizamos' : 'otorgo y formalizo'} a favor de ${apoderadosStr}, de acuerdo con las siguientes:`
        : `El ${tipoES}, especial en cuanto a su objeto, pero general en cuanto a sus facultades que en este acto ${multiple ? 'otorgan y formalizan' : 'otorga y formaliza'} a favor de ${apoderadosStr}, de acuerdo con las siguientes:`,
      data.modoProemio === 'suscrito'
        ? `The ${tipoEN}, special in as much as its purpose but general in as much as its capacities, that is hereby ${multiple ? 'granted and formalized' : 'granted and formalized'} in favor of ${apoderadosStr}, according to the following:`
        : `The ${tipoEN}, special in as much as its purpose but general in as much as its capacities, that is granted and formalized through this act in favor of ${apoderadosStr}, according to the following:`,
    ),
    spacerRow(),

    // ===== CLÁUSULAS =====
    biRow('C L Á U S U L A S:', col2('C L A U S E S:', FR.clausulas), { bold: true, center: true }),
    spacerRow(),

    // PRIMERA
    headerRow('PRIMERA.- OTORGAMIENTO DE PODER', col2('FIRST.- GRANTING OF POWERS OF ATTORNEY', FR.primeraHeader)),
    biRow(
      `${poderdantesStr}, ${data.modoProemio === "suscrito" ? (multiple ? "otorgamos" : "otorgo") : (multiple ? "otorgan" : "otorga")} ${tipoES}, en favor de ${apoderadosStr}, para que ${apoEjercite}${apoConjunta} en los términos que autorizan los párrafos primero, segundo y tercero del artículo 2554 (dos mil quinientos cincuenta y cuatro) del Código Civil Federal, y sus equivalentes en los demás entidades de la República y el Protocolo sobre Uniformidad del Régimen Legal de los poderes, aprobado en la resolución XLVIII de la Séptima Conferencia Internacional Americana de la Unión Panamericana, firmada por México ad referendum el 7 de mayo de 1953, según Decreto publicado en el Diario Oficial de la Federación el 2 de febrero de 1952; ratificado por el Ejecutivo Federal de los Estados Unidos Mexicanos el 22 de diciembre de 1951, según Decreto publicado en el Diario Oficial de la Federación el 2 de febrero de 1952; ratificado por el Ejecutivo Federal de los Estados Unidos Mexicanos el 12 de junio de 1953, habiéndose depositado el instrumento de ratificación ante la Secretaría General de la Organización de los Estados Americanos el 24 de junio de 1953 y publicado en el Diario Oficial de la Federación el 3 de diciembre de 1953; de acuerdo con la Convención Interamericana sobre el régimen legal de poderes para ser utilizados en el extranjero, aprobada por la Organización de los Estados Americanos con fecha 30 de enero de 1975, y adoptada por México mediante publicación en el Diario Oficial de la Federación con fecha 6 de febrero de 1987; de conformidad con el Código Civil Federal y los artículos correlativos de los diversos Códigos Civiles de las Entidades Federativas de los Estados Unidos Mexicanos; ${apoPodrán} firmar la documentación pública o privada que sea necesaria para el ejercicio del presente poder, con las más amplias facultades hasta lograr el objeto del Poder que en este acto se le otorga y podrá ser ejercitado ante Particulares, o ante Autoridades Administrativas, Judiciales cuya jurisdicción sea Federal, Estatal o Municipal.`,
      `${poderdantesStr}, ${data.modoProemio === "suscrito" ? (multiple ? "hereby grant" : "hereby grants") : (multiple ? "grant" : "grants")} ${tipoEN} in favor of ${apoderadosStr}, to be exercised${apoJointly} in terms authorized by paragraphs second and third of article 2554 of the Federal Civil Code, and their equivalent in the further entities of the Republic and the Protocol On Uniform Legal Provisions. For powers of attorney approved with resolution XLVIII of the Seventh International American Conference of the PanAmerican Union, signed on May 7th, 1953, as per decree published in the Federation's Official Journal of February 2nd, 1952. Ratified by the Federal Executive of the Mexican United States on December 22nd, 1951, as per decree published in the Federation's Official Journal of February 2nd, 1952. Ratified by the Federal Executive of the United Mexican States on June 12th, 1953. Having deposited the instrument of ratification with the Secretary General of the Organization of American States on June 24th, 1953; and published in the Official Journal of the Federation on December 3rd, 1953. In accordance with the Interamerican Convention on the Legal Regime of Powers of Attorney to be used abroad, issued by the Organization of American States on January 30th, 1975 and adopted by Mexico according to publication made in the Official Journal of the Federation on February 6th, 1987; and in accordance with the Federal Civil Code and all articles relating to the various Civil Codes of the Federal Entities of the United Mexican States; ${apoTheProxy} sign the public or private documentation that may be necessary to exercise this power, with the amplest capacities to achieve the purpose of the Power in this act granted and may be exercised before Private Persons, or Administrative, Judicial Authorities, whose jurisdiction be Federal, State, or Municipal.`,
    ),
    spacerRow(),

    // SEGUNDA
    headerRow('SEGUNDA.- LIMITACIÓN', col2('SECOND.- LIMITATION', FR.segundaHeader)),
    biRow(
      esFideicomiso
        ? `El presente poder se otorga de forma limitada sobre el siguiente bien inmueble, contenido en el Fideicomiso identificado administrativamente con el número ${data.inmueble.fideicomisoNumero}${data.inmueble.bancoFiduciario ? `, ${data.inmueble.bancoFiduciario}` : ''}:`
        : 'El presente poder se otorga de forma limitada sobre el siguiente bien inmueble de propiedad del poderdante:',
      esFideicomiso
        ? `This power is granted in a limited manner over the following property, contained in the trust identified administratively under number ${data.inmueble.fideicomisoNumero}${data.inmueble.bancoFiduciario ? `, ${data.inmueble.bancoFiduciario}` : ''}:`
        : 'This power is granted in a limited manner over the following property owned by the grantor:',
    ),
    spacerRow(),
    biRow('INMUEBLE:', col2('PROPERTY:', FR.inmuebleLabel), { bold: true, center: true, shade: true }),
    biRow(
      inmuebleDesc + predialES + (escrituraES ? ' ' + escrituraES : '') + ' EN ADELANTE EL INMUEBLE.',
      col2(inmuebleDescEN + predialEN + (escrituraEN ? ' ' + escrituraEN : '') + ' HEREINAFTER THE PROPERTY.', inmuebleDesc + (data.inmueble.cuentaPredial ? ` ${FR.predial(data.inmueble.cuentaPredial)}` : '') + ' ' + FR.hereinafter),
    ),
    spacerRow(),

    // TERCERA
    headerRow('TERCERA.- LIMITACIÓN AL INMUEBLE', col2('THIRD.- LIMITATION TO THE PROPERTY', FR.terceraHeader)),
    biRow(
      'El presente poder será amplio y general en cuanto a sus facultades y limitado en cuanto a su objeto por lo que sólo podrá ser ejercido respecto al INMUEBLE antes referido.',
      col2('This power will be wide and general in terms of their faculties and limited in terms of its object so that it can only be exercised regarding the PROPERTY above mentioned.', FR.tercera),
    ),
    spacerRow(),

    // CUARTA
    headerRow('CUARTA.- FACULTADES DEL APODERADO', col2('FOURTH.- FACULTIES OF THE PROXY', FR.cuartaHeader)),
    biRow(
      `El poder otorgado se confiere ÚNICA Y EXCLUSIVAMENTE, ${apoParaQue} en favor del poderdante: ${facultadesText.es}; respecto ${esFideicomiso ? 'de los derechos fideicomisarios en el fideicomiso mencionado en la CLÁUSULA SEGUNDA que tiene afectado el INMUEBLE' : 'del INMUEBLE mencionado en la CLÁUSULA SEGUNDA'}.`,
      `The power of attorney hereby granted is ONLY AND EXCLUSIVELY ${apoForThe} in favor of the grantor: ${facultadesText.en}; regarding ${esFideicomiso ? 'the trust rights of the trust mentioned in CLAUSE SECOND, that the PROPERTY is affected by' : 'the PROPERTY mentioned in CLAUSE SECOND'}.`,
    ),
    spacerRow(),

    // RÉGIMEN LEGAL
    headerRow('RÉGIMEN LEGAL DEL MANDATO — CÓDIGO CIVIL FEDERAL', col2('LEGAL REGIME OF THE MANDATE — FEDERAL CIVIL CODE', FR.regimenHeader)),
    biRow(
      '"Artículo 2,554.- En todos los poderes generales para pleitos y cobranzas, bastará que se diga que se otorga con todas las facultades generales y las especiales que requieran cláusula especial conforme a la ley, para que se entiendan conferidos sin limitación alguna. En los poderes generales para administrar bienes, bastará expresar que se dan con ese carácter, para que el apoderado tenga toda clase de facultades administrativas. En los poderes generales, para ejercer actos de dominio, bastará que se den con ese carácter para que el apoderado tenga todas las facultades de dueño, tanto en lo relativo a los bienes, como para hacer toda clase de gestiones a fin de defenderlos. Cuando se quisieren limitar, en los tres casos antes mencionados, las facultades del apoderado, se consignarán las limitaciones, o los poderes serán especiales. Los notarios insertarán este artículo en los testimonios de los poderes que otorguen."',
      'col2(`"Article 2554, Federal Civil Code.- In all general powers of attorney for lawsuits and collections, it shall suffice to state that all the general faculties are granted and the special clause pursuant to the law, in order for the power of attorney to be understood to be conferred without any limitation. In general powers of attorney to administer property, it shall suffice to state that the same are granted for administrative faculties. In the general powers of attorney to carry out acts of ownership, it will be enough having the character so that the attorney to have all the powers of the owner, both in relation to the property, as to make all the negotiation in order to defend them. When desired to limit, in the three cases before referred to the attorneys, the limitations will be made or the powers shall be special in nature. Notaries shall insert this article in the testimonies of the powers that are granted."`, FR.art2554)',
    ),
    spacerRow(),
    biRow(
      '"Artículo 2,555.- El mandato debe otorgarse en escritura pública o en carta poder firmada ante dos testigos y ratificadas las firmas del otorgante y testigos ante notario, ante los jueces o autoridades administrativas correspondientes: I. Cuando sea general..."',
      'col2(`"Article 2,555.- The mandate must be granted in a public deed or in a power of attorney signed before two witnesses and the signatures of the grantor and witnesses ratified before a notary, before the corresponding judges or administrative authorities: I. When general…"`, FR.art2555)',
    ),
    spacerRow(),
    biRow(
      '"Artículo 2,596.- El mandante puede revocar el mandato cuando y como le parezca; menos en aquellos casos en que su otorgamiento se hubiere estipulado como una condición en un contrato bilateral, o como un medio para cumplir una obligación contraída. En estos casos tampoco puede el mandatario renunciar el poder. La parte que revoque o renuncie el mandato en tiempo inoportuno, debe indemnizar a la otra de los daños y perjuicios que le cause."',
      'col2(`"Article 2,596.- The principal may revoke the mandate when and as he sees fit; except in those cases in which its granting has been stipulated as a condition in a bilateral contract, or as a means to fulfill a contracted obligation. In these cases, the agent cannot renounce power either. The party that revokes or renounces the mandate inopportune time, must indemnify the other for the damages caused."`, FR.art2596)',
    ),
    spacerRow(),

    // CÓDIGO CIVIL ESTATAL — condicional Nayarit vs Jalisco
    ...(data.regimenEstado === 'jalisco' ? [
      headerRow('CÓDIGO CIVIL DEL ESTADO DE JALISCO', 'CIVIL CODE OF THE STATE OF JALISCO'),
      biRow(
        '"Artículo 2,207.- En los poderes generales judiciales, bastará decir que se otorgan con ese carácter, para que el apoderado pueda representar al poderdante en todo negocio de jurisdicción voluntaria, mixta y contenciosa, desde su principio hasta su fin; siempre que no se trate de actos que conforme a las leyes requieran poder especial, en tal caso se consignarán detalladamente las facultades que se confieran con su carácter de especialidad. En los poderes generales para administrar bienes, bastará decir que se otorgan con ese carácter, para que el apoderado tenga toda clase de facultades administrativas. En los poderes generales para ejercer actos de dominio, será suficiente que se exprese que se confieren con ese carácter, a efecto de que el apoderado tenga todas las facultades de propietario, en lo relativo a los bienes como en su defensa."',
        '"Article 2,207.- In general judicial powers of attorney, it shall suffice to state that they are granted with that character, so that the proxy may represent the grantor in all matters of voluntary, mixed and contentious jurisdiction, from beginning to end; provided that they do not involve acts that by law require a special power of attorney, in which case the faculties conferred with their special character shall be set out in detail. In general powers of attorney to administer assets, it shall suffice to state that they are granted with that character, so that the proxy has all administrative faculties. In general powers of attorney to exercise acts of ownership, it shall suffice to express that they are granted with that character, so that the proxy has all the faculties of the owner, in relation to the assets and their defense."',
      ),
      spacerRow(),
      biRow(
        '"Artículo 2,204.- El mandato debe de formalizarse por escrito, y otorgarse: I. En escritura pública: a) Siempre que sea general; b) Cuando se refiera a inmuebles o a derechos reales; c) Cuando el negocio para el que se confiera, su importe sea superior al equivalente a 300 veces el valor diario de la Unidad de Medida y Actualización; y d) Cuando en virtud de él haya de ejecutar el mandatario algún acto que conforme a la ley deba constar en escritura pública."',
        '"Article 2,204.- The mandate must be formalized in writing and granted: I. In a public deed: a) Whenever it is general; b) When it refers to real estate or real rights; c) When the business for which it is conferred exceeds an amount equivalent to 300 times the daily value of the Unit of Measurement and Update; and d) When by virtue thereof the agent must execute an act that by law must be recorded in a public deed."',
      ),
      spacerRow(),
      biRow(
        '"Artículo 2,244.- El mandato podrá ser revocado en todo tiempo y libremente por el mandante o renunciado en igual forma por el mandatario. Cualquier estipulación en contrario será nula de pleno derecho y se tendrá por no puesta. La parte que revoque o renuncie el mandato en tiempo inoportuno, deberá indemnizar a la otra, de los daños y perjuicios que le cause."',
        '"Article 2,244.- The mandate may be revoked at any time and freely by the principal or renounced in the same way by the agent. Any stipulation to the contrary shall be null and void and shall be deemed not to have been made. The party that revokes or renounces the mandate at an inopportune time must compensate the other party for damages caused."',
      ),
      spacerRow(),
    ] : [
      headerRow('CÓDIGO CIVIL DEL ESTADO DE NAYARIT', 'CIVIL CODE OF THE STATE OF NAYARIT'),
      biRow(
        '"Artículo 1,926.- En todos los poderes generales para pleitos y cobranzas bastará que se diga que se otorgan con todas las facultades generales y las especiales que requieran cláusula especial conforme a la ley, para que se entiendan conferidos sin limitación alguna. En los poderes generales para administrar bienes, bastará expresar que se dan con ese carácter para que el apoderado tenga todas las facultades de dueño, tanto en lo relativo a los bienes, como para hacer toda clase de gestiones, a fin de defenderlos. Cuando se quisieren limitar, en los tres casos antes mencionados, las facultades del apoderado, se consignarán las limitaciones o los poderes serán especiales. Los notarios insertarán este artículo en los testimonios de los poderes que otorguen."',
        '"Article 1,926.- In all general powers for lawsuits and collections, it will suffice to say that they are granted with all the general and special powers that require a special clause in accordance with the law, so that they are understood to be conferred without any limitation. In the general powers to administer assets, it will suffice to state that they are given in this capacity so that the agent has all the faculties of ownership, both in relation to the assets, and to carry out all kinds of procedures, in order to defend them. When they want to limit, in the three aforementioned cases, the powers of the attorney, the limitations will be recorded or the powers will be special. Notaries will insert this article in the testimonials of the powers they grant."',
      ),
      spacerRow(),
      biRow(
        '"Artículo 1,927.- El mandato debe otorgarse en escritura pública o en carta poder firmada ante dos testigos ratificadas las firmas del otorgante y testigos ante notario, ante los jueces o autoridades administrativas correspondientes: I.- Cuando sea general; II.- Cuando el interés del negocio para que se confiere sea superior al equivalente a mil veces el salario mínimo general vigente en el estado de Nayarit, al momento de otorgarse; o cuando se requiera para la enajenación de inmuebles. III.- Cuando en virtud de él haya de ejecutar el mandatario a nombre del mandante, algún acto que, conforme a la ley deba constar en instrumento público; y IV.- Para que el mandatario pueda hacer donaciones en nombre o por cuenta del mandante, deberá éste otorgar poder especial en cada caso."',
        '"Article 1,927.- The mandate must be granted in a public deed or in a power of attorney signed before two witnesses ratified by the signatures of the grantor and witnesses before a notary, before the corresponding judges or administrative authorities: I.- When it is general; II.- When the interest of the business for which it is conferred is greater than the equivalent of one thousand times the general minimum wage in force in the state of Nayarit, at the time it is granted; or when it is required for the alienation of real estate. III.- When by virtue of it the agent has to execute on behalf of the principal, some act that, according to the law must be recorded in a public instrument; and IV.- In order for the agent to make donations in the name or on behalf of the principal, the latter must grant a special power of attorney in each case."',
      ),
      spacerRow(),
    ]),

    // CERTIFICACIÓN — condicional según modoProemio
    ...(data.modoProemio === 'notarial' ? [
      headerRow('CERTIFICACIÓN NOTARIAL', col2('NOTARIAL CERTIFICATION', FR.certHeader)),
      biRow('Yo, el Notario Certifico y doy fe:', col2('I, the Notary, Certify and attest:', FR.certYo), { bold: true }),
      spacerRow(),
      biRow(ct.puntoI_ES, ct.puntoI_EN),
      biRow(ct.puntoII_ES, ct.puntoII_EN),
      biRow(ct.puntoIII_ES, ct.puntoIII_EN),
      biRow(ct.puntoIV_ES, ct.puntoIV_EN),
      spacerRow(),
      biRow(ct.leido_ES, ct.leido_EN),
    ] : [
      // Modo suscrito: certificación simplificada
      headerRow('FIRMA Y RATIFICACIÓN', col2('SIGNATURE AND RATIFICATION', FR.firmaRatificacion)),
      biRow(
        `En fe de lo anterior, ${c.laEl} ${c.otorgante} firma el presente instrumento.`,
        col2(`In witness whereof, the grantor signs this instrument.`, FR.enFeDeLo(c.laEl)),
      ),
    ]),
    spacerRow(),
    spacerRow(),

    // FIRMA SECTION
    headerRow('FIRMAS — SIGNATURES', col2('FIRMAS — SIGNATURES', 'SIGNATURES — FIRMAS')),
  ];

  // Signature block rows
  const sigRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'C9A84C' },
          },
          margins: { top: 120, bottom: 120, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Lugar y Fecha / ${col2('Place and Date', 'Lieu et Date')}:`,
                  bold: true,
                  size: 18,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: data.lugar && data.fecha ? `${data.lugar}, ${data.fecha}` : '___________________________',
                  size: 18,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
          margins: { top: 120, bottom: 120, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `Firma y Sello del Notario Público / ${col2('Notary Seal & Signature', 'Sceau et Signature Notariale')}:`,
                  bold: true,
                  size: 18,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '___________________________',
                  size: 18,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // Name of notary
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.SINGLE, size: 6, color: 'C9A84C' },
          },
          margins: { top: 600, bottom: 120, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '___________________________',
                  size: 18,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: 'Nombre del Notario / Name of Notary:',
                  size: 16,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
          margins: { top: 600, bottom: 120, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: '___________________________',
                  size: 18,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: data.poderdante.nombre.toUpperCase(),
                  bold: true,
                  size: 18,
                  font: 'Times New Roman',
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: multiple ? `Los Poderdantes / ${col2('The Grantors', FR.firmaLabelPlur)}` : `${c.elLa.charAt(0).toUpperCase() + c.elLa.slice(1)} Poderdante / ${col2('Grantor', c.elLa === 'la' ? FR.firmaLabel_F : FR.firmaLabel_M)}`,
                  size: 16,
                  font: 'Times New Roman',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  const mainTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 12, color: 'C9A84C' },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: 'C9A84C' },
      left: { style: BorderStyle.SINGLE, size: 12, color: 'C9A84C' },
      right: { style: BorderStyle.SINGLE, size: 12, color: 'C9A84C' },

    },
    rows: [...rows, ...sigRows],
  });

  const footerPara = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [
      new TextRun({
        text: 'Hecho por Colmena 2026 | PoderGen — podergen.expatadvisormx.com | Expat Advisor MX',
        size: 14,
        color: '888888',
        font: 'Times New Roman',
        italics: true,
      }),
    ],
  });

  const titlePara = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: `PODER NOTARIAL BILINGÜE / BILINGUAL POWER OF ATTORNEY`,
        bold: true,
        size: 28,
        color: '0A1628',
        font: 'Times New Roman',
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children: [titlePara, mainTable, footerPara],
      },
    ],
  });

  return Packer.toBlob(doc);
}
