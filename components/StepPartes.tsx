'use client';

import type { PoderData, TipoPoder, ModoProemio, RegimenEstado, Poderdante } from '@/types/poder';
import { TIPO_PODER_LABELS } from '@/types/poder';

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

  // ── Múltiples poderdantes ─────────────────────────────────────────
  // todosLosPoderdantes: el principal + extras
  const todosLosPoderdantes: Poderdante[] = data.poderdantes?.length > 0
    ? data.poderdantes
    : [data.poderdante];

  const updatePoderdanteN = (idx: number, field: string, value: string) => {
    const lista = [...todosLosPoderdantes];
    lista[idx] = { ...lista[idx], [field]: value };
    // El primero siempre es el principal
    updateData({ poderdante: lista[0], poderdantes: lista });
  };

  const addPoderdante = () => {
    const nuevo: Poderdante = {
      nombre: '', nacionalidad: '', estadoCivil: 'casado', ocupacion: '',
      domicilio: '', pasaporte: '', fechaNacimiento: '', genero: 'M',
    };
    const lista = [...todosLosPoderdantes, nuevo];
    updateData({ poderdantes: lista });
  };

  const removePoderdante = (idx: number) => {
    if (todosLosPoderdantes.length <= 1) return;
    const lista = todosLosPoderdantes.filter((_, i) => i !== idx);
    updateData({ poderdante: lista[0], poderdantes: lista });
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

      {/* PODERDANTES — multi */}
      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)' }}>
            Poderdante(s) / Grantor(s)
          </h3>
          {todosLosPoderdantes.length < 4 && (
            <button onClick={addPoderdante} className="pg-btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>
              + Agregar poderdante
            </button>
          )}
        </div>

        {todosLosPoderdantes.map((pd, idx) => (
          <div key={idx} style={{
            marginBottom: idx < todosLosPoderdantes.length - 1 ? '24px' : 0,
            paddingBottom: idx < todosLosPoderdantes.length - 1 ? '24px' : 0,
            borderBottom: idx < todosLosPoderdantes.length - 1 ? '1px solid rgba(201,168,76,0.15)' : 'none',
          }}>
            {todosLosPoderdantes.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', color: 'var(--pg-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Poderdante {idx + 1}
                </span>
                {idx > 0 && (
                  <button onClick={() => removePoderdante(idx)} style={{
                    background: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.35)',
                    color: '#E74C3C', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px',
                  }}>✕ Quitar</button>
                )}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              <div>
                <label className="pg-label">Nombre Completo / Full Name *</label>
                <input className="pg-input" placeholder="ej. MARJORIE KATHLEEN BRAATZ"
                  value={pd.nombre} onChange={(e) => updatePoderdanteN(idx, 'nombre', e.target.value.toUpperCase())} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="pg-label">Género / Gender</label>
                  <select className="pg-select" value={pd.genero} onChange={(e) => updatePoderdanteN(idx, 'genero', e.target.value)}>
                    <option value="M">Masculino / Male</option>
                    <option value="F">Femenino / Female</option>
                  </select>
                </div>
                <div>
                  <label className="pg-label">Nacionalidad / Nationality</label>
                  <select className="pg-select" value={
                    ['estadounidense','canadiense','mexicana'].includes(pd.nacionalidad.toLowerCase())
                      ? pd.nacionalidad.toLowerCase() : pd.nacionalidad ? 'otra' : ''
                  } onChange={(e) => {
                    if (e.target.value === 'otra') updatePoderdanteN(idx, 'nacionalidad', '');
                    else if (e.target.value === 'estadounidense') updatePoderdanteN(idx, 'nacionalidad', 'Estadounidense');
                    else if (e.target.value === 'canadiense') updatePoderdanteN(idx, 'nacionalidad', 'Canadiense');
                    else if (e.target.value === 'mexicana') updatePoderdanteN(idx, 'nacionalidad', 'Mexicana');
                  }}>
                    <option value="">— Seleccionar —</option>
                    <option value="estadounidense">Estadounidense / American</option>
                    <option value="canadiense">Canadiense / Canadian</option>
                    <option value="mexicana">Mexicana / Mexican</option>
                    <option value="otra">Otra / Other</option>
                  </select>
                  {pd.nacionalidad && !['Estadounidense','Canadiense','Mexicana'].includes(pd.nacionalidad) && (
                    <input className="pg-input" placeholder="ej. Británica / British" value={pd.nacionalidad}
                      onChange={(e) => updatePoderdanteN(idx, 'nacionalidad', e.target.value)}
                      style={{ marginTop: '6px' }} />
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="pg-label">Estado Civil</label>
                  <select className="pg-select" value={pd.estadoCivil} onChange={(e) => updatePoderdanteN(idx, 'estadoCivil', e.target.value)}>
                    <option value="soltero">Soltero(a) / Single</option>
                    <option value="casado">Casado(a) / Married</option>
                    <option value="divorciado">Divorciado(a) / Divorced</option>
                    <option value="viudo">Viudo(a) / Widowed</option>
                    <option value="union_libre">Unión libre</option>
                  </select>
                </div>
                <div>
                  <label className="pg-label">Ocupación / Occupation</label>
                  <select className="pg-select" value={
                    pd.ocupacion.startsWith('Retirado') ? 'retirado'
                    : pd.ocupacion === '' ? '' : 'otra'
                  } onChange={(e) => {
                    if (e.target.value === 'retirado') updatePoderdanteN(idx, 'ocupacion', 'Retirado(a) / Retired');
                    else if (e.target.value === 'otra') updatePoderdanteN(idx, 'ocupacion', ' '); // espacio = sentinel "Otra seleccionada"
                    else updatePoderdanteN(idx, 'ocupacion', '');
                  }}>
                    <option value="">— Seleccionar —</option>
                    <option value="retirado">Retirado(a) / Retired</option>
                    <option value="otra">Otra / Other</option>
                  </select>
                  {!pd.ocupacion.startsWith('Retirado') && pd.ocupacion !== '' && (
                    <input className="pg-input" placeholder="ej. Empresario / Business Owner"
                      value={pd.ocupacion.trim()}
                      onChange={(e) => updatePoderdanteN(idx, 'ocupacion', e.target.value)}
                      style={{ marginTop: '6px' }}
                      autoFocus
                    />
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="pg-label">No. Pasaporte / Passport No.</label>
                  <input className="pg-input" placeholder="ej. AC536054" value={pd.pasaporte}
                    onChange={(e) => updatePoderdanteN(idx, 'pasaporte', e.target.value.toUpperCase())} />
                </div>
                <div>
                  <label className="pg-label">Fecha Nacimiento / Birth Date</label>
                  <input className="pg-input" placeholder="DD/MM/YYYY" value={pd.fechaNacimiento}
                    onChange={(e) => updatePoderdanteN(idx, 'fechaNacimiento', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="pg-label">Domicilio / Address</label>
                <input className="pg-input" placeholder="Dirección completa" value={pd.domicilio}
                  onChange={(e) => updatePoderdanteN(idx, 'domicilio', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
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

      {/* RÉGIMEN LEGAL ESTATAL */}
      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)', marginBottom: '8px' }}>
          Código Civil Aplicable
        </h3>
        <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', marginBottom: '14px' }}>
          Estado donde se ubica el inmueble — determina qué artículos del régimen legal se insertan en el documento.
        </p>
        <select
          className="pg-select"
          value={data.regimenEstado}
          onChange={(e) => updateData({ regimenEstado: e.target.value as RegimenEstado })}
        >
          <option value="nayarit">Nayarit — Arts. 1,926 y 1,927 CC Nayarit (Bahía de Banderas, Bucerías, Sayulita…)</option>
          <option value="jalisco">Jalisco — Arts. 2,207 y 2,204 CC Jalisco (Puerto Vallarta, Mascota…)</option>
        </select>
        <div style={{ fontSize: '11px', color: 'rgba(201,168,76,0.6)', marginTop: '8px' }}>
          {data.regimenEstado === 'jalisco'
            ? '⚖ Art. 2,207 CCJ + Art. 2,554 CCF + Art. 2,244 CCJ'
            : '⚖ Art. 1,926 CC Nayarit + Art. 1,927 CC Nayarit + Arts. 2,554/2,555/2,596 CCF'}
        </div>
      </div>

      {/* MODO PROEMIO */}
      <div className="pg-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)', marginBottom: '8px' }}>
          Modo del Proemio / Opening Clause
        </h3>
        <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', marginBottom: '16px', lineHeight: '1.6' }}>
          ¿El poder es redactado y certificado por un Notario Público mexicano, o es firmado directamente por el otorgante ante un notario extranjero?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Opción Notarial */}
          <label
            onClick={() => updateData({ modoProemio: 'notarial' })}
            className={`pg-checkbox-item ${data.modoProemio === 'notarial' ? 'checked' : ''}`}
            style={{ cursor: 'pointer', alignItems: 'flex-start' }}
          >
            <input type="radio" checked={data.modoProemio === 'notarial'} onChange={() => updateData({ modoProemio: 'notarial' })} style={{ marginTop: '3px', accentColor: 'var(--pg-gold)' }} />
            <span className="pg-checkbox-label">
              <span style={{ fontWeight: 'bold', color: data.modoProemio === 'notarial' ? 'var(--pg-cream)' : 'rgba(245,240,232,0.6)' }}>
                Notarial MX (estándar)
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: '3px', fontStyle: 'italic' }}>
                "El Notario Público que autoriza, certifica: que ante mí compareció NOMBRE, a fin de..."
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: 'rgba(245,240,232,0.35)', marginTop: '1px' }}>
                Incluye certificación notarial completa (puntos I–IV, leído, firma con sello)
              </span>
            </span>
          </label>

          {/* Opción Suscrito */}
          <label
            onClick={() => updateData({ modoProemio: 'suscrito' })}
            className={`pg-checkbox-item ${data.modoProemio === 'suscrito' ? 'checked' : ''}`}
            style={{ cursor: 'pointer', alignItems: 'flex-start' }}
          >
            <input type="radio" checked={data.modoProemio === 'suscrito'} onChange={() => updateData({ modoProemio: 'suscrito' })} style={{ marginTop: '3px', accentColor: 'var(--pg-gold)' }} />
            <span className="pg-checkbox-label">
              <span style={{ fontWeight: 'bold', color: data.modoProemio === 'suscrito' ? 'var(--pg-cream)' : 'rgba(245,240,232,0.6)' }}>
                Suscrito (notario extranjero / simplificado)
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: 'rgba(245,240,232,0.4)', marginTop: '3px', fontStyle: 'italic' }}>
                "Los suscritos / La suscrita NOMBRE, comparecemos/comparezco a fin de..."
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: 'rgba(245,240,232,0.35)', marginTop: '1px' }}>
                Sin certificación notarial extensa — solo sección de firma y sello
              </span>
            </span>
          </label>
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
