'use client';

import type { PoderData } from '@/types/poder';
import { TIPO_PODER_LABELS } from '@/types/poder';
import type { TipoPoder } from '@/types/poder';

interface Props {
  data: PoderData;
  updateData: (partial: Partial<PoderData>) => void;
  onNext: () => void;
}

export default function StepPartes({ data, updateData, onNext }: Props) {
  const { poderdante, apoderados, tipos } = data;

  const updatePoderdante = (field: string, value: string) => {
    updateData({ poderdante: { ...poderdante, [field]: value } });
  };

  const updateApoderado = (idx: number, nombre: string) => {
    const newAps = [...apoderados];
    newAps[idx] = { nombre };
    updateData({ apoderados: newAps });
  };

  const addApoderado = () => {
    if (apoderados.length < 3) {
      updateData({ apoderados: [...apoderados, { nombre: '' }] });
    }
  };

  const removeApoderado = (idx: number) => {
    if (apoderados.length > 1) {
      const newAps = apoderados.filter((_, i) => i !== idx);
      updateData({ apoderados: newAps });
    }
  };

  const toggleTipo = (t: TipoPoder) => {
    if (tipos.includes(t)) {
      if (tipos.length > 1) {
        updateData({ tipos: tipos.filter((x) => x !== t) });
      }
    } else {
      updateData({ tipos: [...tipos, t] });
    }
  };

  const canContinue =
    poderdante.nombre.trim() &&
    poderdante.nacionalidad.trim() &&
    poderdante.pasaporte.trim() &&
    poderdante.domicilio.trim() &&
    apoderados.every((a) => a.nombre.trim()) &&
    tipos.length > 0;

  return (
    <div>
      <h2 style={{ fontSize: '22px', color: 'var(--pg-gold)', marginBottom: '6px', fontFamily: 'Times New Roman, serif' }}>
        Paso 1 — Las Partes
      </h2>
      <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.6)', marginBottom: '28px' }}>
        Quien otorga el poder (poderdante) y a quién se lo otorga (apoderado/s)
      </p>

      {/* PODERDANTE */}
      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)', marginBottom: '20px' }}>
          Poderdante / Grantor
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <div>
            <label className="pg-label">Nombre Completo / Full Name *</label>
            <input
              className="pg-input"
              placeholder="ej. MARJORIE KATHLEEN BRAATZ"
              value={poderdante.nombre}
              onChange={(e) => updatePoderdante('nombre', e.target.value.toUpperCase())}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="pg-label">Género / Gender *</label>
              <select
                className="pg-select"
                value={poderdante.genero}
                onChange={(e) => updatePoderdante('genero', e.target.value)}
              >
                <option value="M">Masculino / Male</option>
                <option value="F">Femenino / Female</option>
              </select>
            </div>
            <div>
              <label className="pg-label">Nacionalidad / Nationality *</label>
              <input
                className="pg-input"
                placeholder="ej. canadiense / Canadian"
                value={poderdante.nacionalidad}
                onChange={(e) => updatePoderdante('nacionalidad', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="pg-label">Estado Civil / Civil Status</label>
              <select
                className="pg-select"
                value={poderdante.estadoCivil}
                onChange={(e) => updatePoderdante('estadoCivil', e.target.value)}
              >
                <option value="soltero">Soltero(a) / Single</option>
                <option value="casado">Casado(a) / Married</option>
                <option value="divorciado">Divorciado(a) / Divorced</option>
                <option value="viudo">Viudo(a) / Widowed</option>
                <option value="union_libre">Unión libre / Common-law</option>
              </select>
            </div>
            <div>
              <label className="pg-label">Ocupación / Occupation</label>
              <input
                className="pg-input"
                placeholder="ej. Retirado(a) / Retired"
                value={poderdante.ocupacion}
                onChange={(e) => updatePoderdante('ocupacion', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label className="pg-label">No. Pasaporte / Passport No. *</label>
              <input
                className="pg-input"
                placeholder="ej. AC536054"
                value={poderdante.pasaporte}
                onChange={(e) => updatePoderdante('pasaporte', e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="pg-label">Fecha Nacimiento / Birth Date</label>
              <input
                className="pg-input"
                placeholder="DD/MM/YYYY"
                value={poderdante.fechaNacimiento}
                onChange={(e) => updatePoderdante('fechaNacimiento', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="pg-label">Domicilio / Address *</label>
            <input
              className="pg-input"
              placeholder="ej. Paseo De Los Cocoteros 111, Int 404, Nuevo Vallarta, Bahía de Banderas, Nayarit, 63735"
              value={poderdante.domicilio}
              onChange={(e) => updatePoderdante('domicilio', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* APODERADOS */}
      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)' }}>
            Apoderado(s) / Proxy(ies)
          </h3>
          {apoderados.length < 3 && (
            <button onClick={addApoderado} className="pg-btn-secondary" style={{ fontSize: '13px', padding: '6px 16px' }}>
              + Agregar
            </button>
          )}
        </div>
        <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', marginBottom: '16px' }}>
          Se ejercerán conjunta o separadamente. Por defecto: Rolo y/o Claudia.
        </p>
        {apoderados.map((ap, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label className="pg-label">Apoderado {idx + 1}</label>
              <input
                className="pg-input"
                placeholder="NOMBRE COMPLETO EN MAYÚSCULAS"
                value={ap.nombre}
                onChange={(e) => updateApoderado(idx, e.target.value.toUpperCase())}
              />
            </div>
            {apoderados.length > 1 && (
              <button
                onClick={() => removeApoderado(idx)}
                style={{
                  background: 'rgba(192,57,43,0.2)',
                  border: '1px solid rgba(192,57,43,0.4)',
                  color: '#E74C3C',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* TIPO DE PODER */}
      <div className="pg-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)', marginBottom: '16px' }}>
          Tipo de Poder — Art. 2554 CCF
        </h3>
        <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', marginBottom: '16px' }}>
          Selecciona los tipos de poder a incluir (mínimo 1)
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(Object.keys(TIPO_PODER_LABELS) as TipoPoder[]).map((t) => {
            const checked = tipos.includes(t);
            return (
              <label key={t} className={`pg-checkbox-item ${checked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTipo(t)}
                />
                <span className="pg-checkbox-label">
                  <span style={{ color: 'var(--pg-gold)', fontWeight: 'bold' }}>{TIPO_PODER_LABELS[t].es}</span>
                  <br />
                  <span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)' }}>{TIPO_PODER_LABELS[t].en}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="pg-btn-primary"
          onClick={onNext}
          
        >
          Siguiente: Inmueble →
        </button>
      </div>
    </div>
  );
}
