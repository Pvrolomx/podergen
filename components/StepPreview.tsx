'use client';

import { useState } from 'react';
import type { PoderData } from '@/types/poder';
import { ESTADO_CIVIL_LABELS, TIPO_PODER_LABELS, FACULTADES_LABELS } from '@/types/poder';

interface Props {
  data: PoderData;
  onPrev: () => void;
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pg-preview-section" style={{ marginBottom: '20px' }}>
      <div className="pg-preview-title">{title}</div>
      <div className="pg-preview-value">{children}</div>
    </div>
  );
}

function formatFecha(f: string): string {
  if (!f) return '';
  // ISO date YYYY-MM-DD → DD/MM/YYYY
  const m = f.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return f;
}

function buildRPPPreviewStr(inmueble: PoderData['inmueble']): string {
  const i = inmueble;
  if (!i.rppEstado) return '';
  const ciudad = i.escrituraNotaria || (i.rppEstado === 'nayarit' ? 'Bahía de Banderas, Nayarit' : 'Puerto Vallarta, Jalisco');
  const rpp = `RPP de ${ciudad}`;
  if (i.rppTipo === 'folio_real' && i.rppFolioReal) {
    const label = i.rppEstado === 'nayarit' ? 'Folio Real Electrónico' : 'Folio Real';
    return `${label} ${i.rppFolioReal} — ${rpp}`;
  } else if (i.rppTipo === 'legacy') {
    if (i.rppEstado === 'nayarit' && i.rppLibroNay)
      return `Libro ${i.rppLibroNay}${i.rppSeccionNay ? ', Sec. ' + i.rppSeccionNay : ''}${i.rppPartidaNay ? ', Partida ' + i.rppPartidaNay : ''} — ${rpp}`;
    if (i.rppEstado === 'jalisco' && i.rppDocumentoJal)
      return `Doc. ${i.rppDocumentoJal}${i.rppFoliosJal ? ', Folios ' + i.rppFoliosJal : ''} — ${rpp}`;
  }
  return '';
}

export default function StepPreview({ data, onPrev }: Props) {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');

  const { poderdante, apoderados, inmueble, tipos, facultades } = data;
  const esFideicomiso = inmueble.modo === 'fideicomiso';

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const { generatePoderDocx } = await import('@/lib/generateDocx');
      const blob = await generatePoderDocx(data);
      const nombreLimpio = poderdante.nombre.replace(/\s+/g, '_').toUpperCase() || 'PODER';
      const filename = `PODER_NOTARIAL_${nombreLimpio}.docx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setGenerated(true);
    } catch (e) {
      console.error(e);
      setError('Error generando el documento. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const apoderadosStr = apoderados.map((a) => a.nombre).join(' y/o ');
  const tiposStr = tipos.map((t) => TIPO_PODER_LABELS[t].es).join(' + ');
  const facultadesActivas = Object.entries(facultades)
    .filter(([, v]) => v)
    .map(([k]) => FACULTADES_LABELS[k as keyof typeof facultades].es);

  const inmuebleDisplay = inmueble.descripcion ||
    [inmueble.departamento, inmueble.nombreCondominio, inmueble.direccion,
     inmueble.municipio, inmueble.estado, inmueble.cp ? `C.P. ${inmueble.cp}` : '']
    .filter(Boolean).join(', ');

  const rppStr = buildRPPPreviewStr(inmueble);

  return (
    <div>
      <h2 style={{ fontSize: '22px', color: 'var(--pg-gold)', marginBottom: '6px', fontFamily: 'Times New Roman, serif' }}>
        Paso 4 — Previsualización y Generación
      </h2>
      <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.6)', marginBottom: '28px' }}>
        Revisa los datos antes de generar el DOCX bilingüe
      </p>

      {/* Preview Card */}
      <div className="pg-card" style={{ marginBottom: '24px', borderColor: 'rgba(201,168,76,0.4)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '16px 0 20px', marginBottom: '24px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Expat Advisor MX — PoderGen
          </div>
          <div style={{ fontSize: '20px', color: 'var(--pg-gold)', fontFamily: 'Times New Roman, serif' }}>
            PODER NOTARIAL BILINGÜE
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.5)', marginTop: '4px' }}>
            {tiposStr}
          </div>
        </div>

        {/* Poderdante */}
        <PreviewSection title="PODERDANTE / GRANTOR">
          <strong style={{ color: 'var(--pg-gold)', fontSize: '15px' }}>{poderdante.nombre || '—'}</strong>
          <br />
          <span style={{ fontSize: '13px' }}>
            {[poderdante.nacionalidad, ESTADO_CIVIL_LABELS[poderdante.estadoCivil]?.es, poderdante.ocupacion].filter(Boolean).join(' · ')}
          </span>
          {(poderdante.pasaporte || poderdante.fechaNacimiento) && (
            <><br />
            <span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.6)' }}>
              {poderdante.pasaporte && `Pasaporte: ${poderdante.pasaporte}`}
              {poderdante.pasaporte && poderdante.fechaNacimiento && '  ·  '}
              {poderdante.fechaNacimiento && `Nac: ${poderdante.fechaNacimiento}`}
            </span></>
          )}
          {poderdante.domicilio && (
            <><br /><span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.6)' }}>{poderdante.domicilio}</span></>
          )}
        </PreviewSection>

        {/* Apoderados */}
        <PreviewSection title="APODERADO(S) / PROXY(IES)">
          {apoderadosStr || '—'}
          <br />
          <span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)' }}>conjunta o separadamente / jointly or separately</span>
        </PreviewSection>

        {/* Título — condicional por modo */}
        {esFideicomiso ? (
          <PreviewSection title="FIDEICOMISO / TRUST">
            <strong>No. {inmueble.fideicomisoNumero || '—'}</strong>
            {inmueble.bancoFiduciario && (
              <><br /><span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.6)' }}>{inmueble.bancoFiduciario}</span></>
            )}
            {inmueble.cuentaPredial && (
              <><br /><span style={{ fontSize: '12px' }}>Cuenta predial: {inmueble.cuentaPredial}</span></>
            )}
          </PreviewSection>
        ) : (
          <PreviewSection title="ESCRITURA PÚBLICA / PUBLIC DEED">
            {inmueble.escrituraNumero && (
              <><strong>Escritura No. {inmueble.escrituraNumero}</strong><br /></>
            )}
            {inmueble.escrituraFecha && (
              <span style={{ fontSize: '13px' }}>Fecha: {inmueble.escrituraFecha}<br /></span>
            )}
            {inmueble.escrituraNotario && (
              <span style={{ fontSize: '13px' }}>Lic. {inmueble.escrituraNotario}{inmueble.escrituraNotaria ? `, ${inmueble.escrituraNotaria}` : ''}<br /></span>
            )}
            {(inmueble.escrituraVolumen || inmueble.escrituraFolio) && (
              <span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.6)' }}>
                {inmueble.escrituraVolumen ? `Vol. ${inmueble.escrituraVolumen}` : ''}
                {inmueble.escrituraVolumen && inmueble.escrituraFolio ? ' · ' : ''}
                {inmueble.escrituraFolio ? `Folio ${inmueble.escrituraFolio}` : ''}
                <br />
              </span>
            )}
            {inmueble.cuentaPredial && (
              <span style={{ fontSize: '12px' }}>Cuenta predial: {inmueble.cuentaPredial}<br /></span>
            )}
            {rppStr && (
              <span style={{ fontSize: '12px', color: 'rgba(201,168,76,0.8)' }}>📋 {rppStr}</span>
            )}
            {!inmueble.escrituraNumero && !inmueble.escrituraNotario && (
              <span style={{ color: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>Sin datos de escritura</span>
            )}
          </PreviewSection>
        )}

        {/* Inmueble */}
        <PreviewSection title="INMUEBLE / PROPERTY">
          <span style={{ fontSize: '13px', lineHeight: '1.6' }}>
            {inmuebleDisplay || <span style={{ color: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>Sin descripción</span>}
          </span>
        </PreviewSection>

        {/* Facultades */}
        <PreviewSection title={`FACULTADES (${facultadesActivas.length})`}>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: '1.7', color: 'rgba(245,240,232,0.8)' }}>
            {facultadesActivas.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </PreviewSection>

        {/* Lugar y fecha */}
        {(data.lugar || data.fecha) && (
          <PreviewSection title="LUGAR Y FECHA">
            {[data.lugar, formatFecha(data.fecha || '')].filter(Boolean).join(', ')}
          </PreviewSection>
        )}
      </div>

      {/* Nota legal */}
      <div style={{
        background: 'rgba(201,168,76,0.07)',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: '6px',
        padding: '14px 16px',
        marginBottom: '24px',
        fontSize: '12px',
        color: 'rgba(245,240,232,0.55)',
        lineHeight: '1.6',
      }}>
        <strong style={{ color: 'var(--pg-gold)', display: 'block', marginBottom: '4px' }}>⚖ Nota Legal / Legal Note</strong>
        Borrador para firma ante Notario Público. Incluye textos legales obligatorios: Arts. 2554, 2555 y 2596 del Código Civil Federal y Arts. 1926 y 1927 del Código Civil de Nayarit.
      </div>

      {error && (
        <div style={{ background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: '#E74C3C' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="pg-btn-secondary" onClick={onPrev}>← Anterior</button>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {generated && (
            <span style={{ fontSize: '13px', color: 'var(--pg-success)' }}>✓ Documento descargado</span>
          )}
          <button
            className="pg-btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ minWidth: '200px' }}
          >
            {loading ? '⏳ Generando...' : generated ? '⬇ Descargar de nuevo' : '⬇ Generar DOCX Bilingüe'}
          </button>
        </div>
      </div>
    </div>
  );
}
