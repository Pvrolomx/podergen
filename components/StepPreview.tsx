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

export default function StepPreview({ data, onPrev }: Props) {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');

  const { poderdante, apoderados, inmueble, tipos, facultades } = data;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const { generatePoderDocx } = await import('@/lib/generateDocx');
      const blob = await generatePoderDocx(data);
      
      // Create filename
      const nombreLimpio = poderdante.nombre.replace(/\s+/g, '_').toUpperCase();
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
    [inmueble.departamento, inmueble.nombreCondominio, inmueble.direccion, inmueble.municipio, inmueble.estado].filter(Boolean).join(', ');

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
        <div style={{
          textAlign: 'center',
          padding: '16px 0 20px',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(201,168,76,0.2)',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Expat Advisor MX — PoderGen
          </div>
          <div style={{ fontSize: '20px', color: 'var(--pg-gold)', fontFamily: 'Times New Roman, serif' }}>
            PODER NOTARIAL BILINGÜE
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(245,240,232,0.6)', marginTop: '4px' }}>
            BILINGUAL POWER OF ATTORNEY
          </div>
        </div>

        <PreviewSection title="PODERDANTE / GRANTOR">
          <strong style={{ color: 'var(--pg-gold)' }}>{poderdante.nombre}</strong>
          <br />
          {poderdante.nacionalidad} · {ESTADO_CIVIL_LABELS[poderdante.estadoCivil].es} · {poderdante.ocupacion}
          <br />
          Pasaporte: {poderdante.pasaporte} · Nac: {poderdante.fechaNacimiento}
          <br />
          {poderdante.domicilio}
        </PreviewSection>

        <PreviewSection title="APODERADO(S) / PROXY(IES)">
          {apoderadosStr}
          <br />
          <span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)' }}>conjunta o separadamente / jointly or separately</span>
        </PreviewSection>

        <PreviewSection title="TIPO DE PODER">
          {tiposStr}
        </PreviewSection>

        <PreviewSection title="FIDEICOMISO / TRUST">
          <strong>No. {inmueble.fideicomisoNumero}</strong>
          <br />
          <span style={{ fontSize: '12px' }}>{inmueble.bancoFiduciario}</span>
          {inmueble.cuentaPredial && (
            <><br />Cuenta predial: {inmueble.cuentaPredial}</>
          )}
        </PreviewSection>

        <PreviewSection title="INMUEBLE / PROPERTY">
          {inmuebleDisplay}
        </PreviewSection>

        <PreviewSection title={`FACULTADES (${facultadesActivas.length})`}>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: '1.7', color: 'rgba(245,240,232,0.8)' }}>
            {facultadesActivas.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </PreviewSection>

        {(data.lugar || data.fecha) && (
          <PreviewSection title="LUGAR Y FECHA">
            {data.lugar && data.fecha
              ? `${data.lugar}, ${data.fecha}`
              : data.lugar || data.fecha}
          </PreviewSection>
        )}
      </div>

      {/* Legal notice */}
      <div style={{
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '24px',
        fontSize: '12px',
        color: 'rgba(245,240,232,0.6)',
        lineHeight: '1.6',
      }}>
        <strong style={{ color: 'var(--pg-gold)', display: 'block', marginBottom: '6px' }}>⚖ Nota Legal / Legal Note</strong>
        El documento generado es un borrador que requiere firma ante Notario Público con capacidad para certificar poderes conforme al Código Civil Federal y/o del Estado de Nayarit. 
        El instrumento incluye los textos legales obligatorios del Art. 2554, 2555 y 2596 CCF y Arts. 1926 y 1927 del Código Civil de Nayarit.
        <br /><br />
        The generated document is a draft that requires execution before a Notary Public. It includes mandatory statutory text from the Federal Civil Code and the Civil Code of Nayarit.
      </div>

      {error && (
        <div style={{
          background: 'rgba(192,57,43,0.15)',
          border: '1px solid rgba(192,57,43,0.4)',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#E74C3C',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="pg-btn-secondary" onClick={onPrev}>← Anterior</button>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {generated && (
            <span style={{ fontSize: '13px', color: 'var(--pg-success)' }}>
              ✓ Documento descargado
            </span>
          )}
          <button
            className="pg-btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ minWidth: '200px' }}
          >
            {loading ? (
              <span>⏳ Generando...</span>
            ) : generated ? (
              <span>⬇ Descargar de nuevo</span>
            ) : (
              <span>⬇ Generar DOCX Bilingüe</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
