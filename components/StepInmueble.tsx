'use client';

import { useState } from 'react';
import type { PoderData, Inmueble } from '@/types/poder';

interface Props {
  data: PoderData;
  updateData: (partial: Partial<PoderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Common Banorte trusts
const BANCOS_COMUNES = [
  'BANCO MERCANTIL DEL NORTE, SOCIEDAD ANÓNIMA, INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO BANORTE, DIVISIÓN FIDUCIARIA',
  'BBVA BANCOMER, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO BBVA BANCOMER, DIVISIÓN FIDUCIARIA',
  'BANCO SANTANDER (MÉXICO), S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO SANTANDER MÉXICO, DIVISIÓN FIDUCIARIA',
  'BANCO NACIONAL DE MÉXICO, S.A., INTEGRANTE DEL GRUPO FINANCIERO BANAMEX, DIVISIÓN FIDUCIARIA',
  'SCOTIABANK INVERLAT, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO SCOTIABANK INVERLAT, DIVISIÓN FIDUCIARIA',
];

export default function StepInmueble({ data, updateData, onNext, onPrev }: Props) {
  const { inmueble } = data;
  const [mode, setMode] = useState<'simple' | 'full'>('simple');

  const update = (field: keyof Inmueble, value: string) => {
    updateData({ inmueble: { ...inmueble, [field]: value } });
  };

  // Build full description from parts if in simple mode
  const buildDescripcionFromParts = () => {
    const parts = [
      inmueble.departamento,
      inmueble.nombreCondominio,
      inmueble.direccion,
      inmueble.municipio,
      inmueble.estado,
      inmueble.cp ? `C.P. ${inmueble.cp}` : '',
    ].filter(Boolean).join(', ');
    update('descripcion', parts);
  };

  const canContinue =
    (inmueble.descripcion.trim() || (inmueble.departamento && inmueble.nombreCondominio)) &&
    inmueble.fideicomisoNumero.trim() &&
    inmueble.bancoFiduciario.trim();

  return (
    <div>
      <h2 style={{ fontSize: '22px', color: 'var(--pg-gold)', marginBottom: '6px', fontFamily: 'Times New Roman, serif' }}>
        Paso 2 — El Inmueble
      </h2>
      <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.6)', marginBottom: '28px' }}>
        Datos del fideicomiso y descripción registral del inmueble
      </p>

      {/* FIDEICOMISO */}
      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)', marginBottom: '20px' }}>
          Fideicomiso / Trust
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label className="pg-label">Número de Fideicomiso *</label>
            <input
              className="pg-input"
              placeholder="ej. 751699"
              value={inmueble.fideicomisoNumero}
              onChange={(e) => update('fideicomisoNumero', e.target.value)}
            />
          </div>
          <div>
            <label className="pg-label">Cuenta Predial / Property Account</label>
            <input
              className="pg-input"
              placeholder="ej. U016345"
              value={inmueble.cuentaPredial}
              onChange={(e) => update('cuentaPredial', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="pg-label">Banco Fiduciario *</label>
          <select
            className="pg-select"
            value={inmueble.bancoFiduciario}
            onChange={(e) => update('bancoFiduciario', e.target.value)}
            style={{ marginBottom: '8px' }}
          >
            {BANCOS_COMUNES.map((b) => (
              <option key={b} value={b}>{b.split(',')[0]}</option>
            ))}
            <option value="OTRO">Otro (especificar abajo)</option>
          </select>
          {inmueble.bancoFiduciario === 'OTRO' && (
            <input
              className="pg-input"
              placeholder="Nombre completo del banco fiduciario"
              onChange={(e) => update('bancoFiduciario', e.target.value)}
            />
          )}
          <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: '4px' }}>
            {inmueble.bancoFiduciario !== 'OTRO' && inmueble.bancoFiduciario}
          </div>
        </div>
      </div>

      {/* INMUEBLE DESCRIPTION */}
      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)' }}>
            Descripción del Inmueble
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setMode('simple')}
              style={{
                padding: '5px 12px',
                fontSize: '12px',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '4px',
                cursor: 'pointer',
                background: mode === 'simple' ? 'rgba(201,168,76,0.2)' : 'transparent',
                color: mode === 'simple' ? 'var(--pg-gold)' : 'rgba(245,240,232,0.5)',
              }}
            >
              Por campos
            </button>
            <button
              onClick={() => setMode('full')}
              style={{
                padding: '5px 12px',
                fontSize: '12px',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '4px',
                cursor: 'pointer',
                background: mode === 'full' ? 'rgba(201,168,76,0.2)' : 'transparent',
                color: mode === 'full' ? 'var(--pg-gold)' : 'rgba(245,240,232,0.5)',
              }}
            >
              Texto libre
            </button>
          </div>
        </div>

        {mode === 'simple' ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="pg-label">Departamento / Unit</label>
                <input
                  className="pg-input"
                  placeholder="ej. Departamento 404, tipo C-PH"
                  value={inmueble.departamento || ''}
                  onChange={(e) => update('departamento', e.target.value)}
                />
              </div>
              <div>
                <label className="pg-label">Nombre del Condominio</label>
                <input
                  className="pg-input"
                  placeholder="ej. Nitta Nuevo Vallarta"
                  value={inmueble.nombreCondominio || ''}
                  onChange={(e) => update('nombreCondominio', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="pg-label">Dirección / Address</label>
              <input
                className="pg-input"
                placeholder="ej. Av. Paseo de los Cocoteros 111 Norte"
                value={inmueble.direccion || ''}
                onChange={(e) => update('direccion', e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label className="pg-label">Municipio</label>
                <input
                  className="pg-input"
                  placeholder="ej. Bahía de Banderas"
                  value={inmueble.municipio || ''}
                  onChange={(e) => update('municipio', e.target.value)}
                />
              </div>
              <div>
                <label className="pg-label">Estado</label>
                <select
                  className="pg-select"
                  value={inmueble.estado || 'Nayarit'}
                  onChange={(e) => update('estado', e.target.value)}
                >
                  <option>Nayarit</option>
                  <option>Jalisco</option>
                  <option>Baja California Sur</option>
                  <option>Quintana Roo</option>
                  <option>Sonora</option>
                  <option>Sinaloa</option>
                  <option>Guerrero</option>
                  <option>Oaxaca</option>
                </select>
              </div>
              <div>
                <label className="pg-label">C.P.</label>
                <input
                  className="pg-input"
                  placeholder="ej. 63735"
                  value={inmueble.cp || ''}
                  onChange={(e) => update('cp', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="pg-label">Descripción adicional (medidas, linderos, etc.)</label>
              <textarea
                className="pg-textarea"
                placeholder="Pega aquí la descripción registral completa con medidas y linderos (opcional pero recomendado para el documento notarial)"
                value={inmueble.descripcion}
                onChange={(e) => update('descripcion', e.target.value)}
                rows={4}
              />
              <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: '4px' }}>
                Si dejas vacío, se usarán los campos de arriba para construir la descripción
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label className="pg-label">Descripción Registral Completa *</label>
            <textarea
              className="pg-textarea"
              placeholder="Pega aquí el texto completo de la descripción del inmueble tal como aparece en la escritura o fideicomiso..."
              value={inmueble.descripcion}
              onChange={(e) => update('descripcion', e.target.value)}
              rows={8}
            />
            <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: '4px' }}>
              Se insertará tal cual en el documento. Incluye departamento, condominio, dirección, municipio, estado, C.P., medidas y linderos.
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="pg-btn-secondary" onClick={onPrev}>← Anterior</button>
        <button className="pg-btn-primary" onClick={onNext} disabled={!canContinue}>
          Siguiente: Facultades →
        </button>
      </div>
    </div>
  );
}
