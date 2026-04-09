'use client';

import type { PoderData, Facultades } from '@/types/poder';
import { FACULTADES_LABELS } from '@/types/poder';

interface Props {
  data: PoderData;
  updateData: (partial: Partial<PoderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function StepFacultades({ data, updateData, onNext, onPrev }: Props) {
  const { facultades } = data;

  const toggle = (key: keyof Facultades) => {
    updateData({ facultades: { ...facultades, [key]: !facultades[key] } });
  };

  const selectAll = () => {
    const all = {} as Facultades;
    (Object.keys(facultades) as (keyof Facultades)[]).forEach((k) => { all[k] = true; });
    updateData({ facultades: all });
  };

  const selectStandard = () => {
    updateData({
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
        sustitucionFiduciaria: true,
      },
    });
  };

  const countSelected = (Object.keys(facultades) as (keyof Facultades)[]).filter((k) => facultades[k]).length;
  const canContinue = countSelected > 0;

  return (
    <div>
      <h2 style={{ fontSize: '22px', color: 'var(--pg-gold)', marginBottom: '6px', fontFamily: 'Times New Roman, serif' }}>
        Paso 3 — Facultades del Apoderado
      </h2>
      <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.6)', marginBottom: '20px' }}>
        Selecciona las facultades que se otorgan. El poder es exclusivo al inmueble indicado.
      </p>

      {/* Quick selectors */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={selectStandard} className="pg-btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>
          ✓ Estándar (recomendado)
        </button>
        <button onClick={selectAll} className="pg-btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>
          ✓ Todas
        </button>
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'rgba(245,240,232,0.5)', display: 'flex', alignItems: 'center' }}>
          {countSelected} facultad{countSelected !== 1 ? 'es' : ''} seleccionada{countSelected !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <div className="pg-checkbox-group">
          {(Object.keys(facultades) as (keyof Facultades)[]).map((key) => {
            const checked = facultades[key];
            const labels = FACULTADES_LABELS[key];
            return (
              <label
                key={key}
                className={`pg-checkbox-item ${checked ? 'checked' : ''}`}
                onClick={() => toggle(key)}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(key)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="pg-checkbox-label">
                  <span style={{ display: 'block', color: checked ? 'var(--pg-cream)' : 'rgba(245,240,232,0.6)' }}>
                    {labels.es}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: '2px' }}>
                    {labels.en}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Lugar y Fecha */}
      <div className="pg-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)', marginBottom: '16px' }}>
          Lugar y Fecha (opcional)
        </h3>
        <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', marginBottom: '16px' }}>
          Si se conocen de antemano; el notario los completará al firmar.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="pg-label">Lugar / Place</label>
            <input
              className="pg-input"
              placeholder="ej. Puerto Vallarta, Jalisco"
              value={data.lugar || ''}
              onChange={(e) => updateData({ lugar: e.target.value })}
            />
          </div>
          <div>
            <label className="pg-label">Fecha / Date</label>
            <input
              className="pg-input"
              type="date"
              value={data.fecha || ''}
              onChange={(e) => updateData({ fecha: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="pg-btn-secondary" onClick={onPrev}>← Anterior</button>
        <button className="pg-btn-primary" onClick={onNext} >
          Previsualizar y Generar →
        </button>
      </div>
    </div>
  );
}
