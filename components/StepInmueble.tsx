'use client';

import { useState } from 'react';
import type { PoderData, Inmueble, ModoTitulo } from '@/types/poder';

interface Props {
  data: PoderData;
  updateData: (partial: Partial<PoderData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BANCOS = [
  { corto: 'Banorte', largo: 'BANCO MERCANTIL DEL NORTE, SOCIEDAD ANÓNIMA, INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO BANORTE, DIVISIÓN FIDUCIARIA' },
  { corto: 'Mifel', largo: 'BANCA MIFEL, SOCIEDAD ANONIMA, INSTITUCION DE BANCA MULTIPLE, GRUPO FINANCIERO MIFEL' },
  { corto: 'Banco Inmobiliario Mexicano', largo: 'BANCO INMOBILIARIO MEXICANO, SOCIEDAD ANONIMA, INSTITUCION DE BANCA MULTIPLE' },
  { corto: 'Banco del Bajío', largo: 'BANCO DEL BAJÍO, SOCIEDAD ANONIMA, INSTITUCIÓN DE BANCA MÚLTIPLE' },
  { corto: 'Monex', largo: 'BANCO MONEX, S.A., INSTITUCIÓN DE BANCA MÚLTIPLE, MONEX GRUPO FINANCIERO' },
  { corto: 'BBVA México', largo: 'BBVA MÉXICO, S.A. INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO BBVA MÉXICO' },
  { corto: 'Santander México', largo: 'BANCO SANTANDER MÉXICO, S.A. INSTITUCIÓN DE BANCA MÚLTIPLE, GRUPO FINANCIERO SANTANDER MÉXICO' },
];

const TOGGLE_STYLE = (active: boolean) => ({
  flex: 1,
  padding: '10px 0',
  textAlign: 'center' as const,
  fontSize: '13px',
  fontFamily: 'Times New Roman, serif',
  fontWeight: active ? 'bold' : 'normal',
  border: 'none',
  borderBottom: active ? '2px solid var(--pg-gold)' : '2px solid transparent',
  background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
  color: active ? 'var(--pg-gold)' : 'rgba(245,240,232,0.45)',
  cursor: 'pointer',
  transition: 'all 0.2s',
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
});


// ── Componente de traducción ──────────────────────────────────────
interface TranslateBlockProps {
  descripcion: string;
  descripcionEN: string;
  translating: boolean;
  translateError: string;
  onTranslate: () => void;
  onChangeEN: (v: string) => void;
}

function TranslateBlock({ descripcion, descripcionEN, translating, translateError, onTranslate, onChangeEN }: TranslateBlockProps) {
  const hasES = descripcion.trim().length > 0;
  const hasEN = descripcionEN.trim().length > 0;

  return (
    <div style={{
      borderTop: '1px solid rgba(201,168,76,0.15)',
      paddingTop: '14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label className="pg-label" style={{ marginBottom: 0 }}>
          Property Description (English)
          <span style={{ color: 'rgba(245,240,232,0.35)', fontWeight: 'normal', marginLeft: '6px', textTransform: 'none', letterSpacing: 0 }}>
            — columna derecha del documento
          </span>
        </label>
        {hasES && (
          <button
            onClick={onTranslate}
            disabled={translating}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              background: translating ? 'rgba(201,168,76,0.08)' : 'linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.08) 100%)',
              border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: '4px',
              color: translating ? 'rgba(201,168,76,0.4)' : 'var(--pg-gold)',
              cursor: translating ? 'not-allowed' : 'pointer',
              fontFamily: 'Times New Roman, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {translating ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
                Traduciendo...
              </>
            ) : hasEN ? (
              <>✦ Retraducir</>
            ) : (
              <>✦ Traducir con IA</>
            )}
          </button>
        )}
      </div>

      {translateError && (
        <div style={{ fontSize: '12px', color: '#E74C3C', marginBottom: '8px', padding: '6px 10px', background: 'rgba(192,57,43,0.1)', borderRadius: '4px' }}>
          {translateError}
        </div>
      )}

      <textarea
        className="pg-textarea"
        rows={hasEN ? 5 : 3}
        placeholder={
          !hasES
            ? 'Llena primero la descripción en español...'
            : translating
            ? 'Traduciendo...'
            : 'Edita manualmente o usa el botón "Traducir con IA" →'
        }
        value={descripcionEN}
        onChange={(e) => onChangeEN(e.target.value)}
        disabled={translating}
        style={{ opacity: translating ? 0.5 : 1 }}
      />

      {hasEN && !translating && (
        <div style={{ fontSize: '11px', color: 'rgba(201,168,76,0.6)', marginTop: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span>✓</span>
          <span>Traducción lista — puedes editarla manualmente si necesitas ajustes.</span>
        </div>
      )}

      {!hasEN && !translating && hasES && (
        <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.3)', marginTop: '4px' }}>
          Sin traducción: la columna EN del documento usará el texto en español como fallback.
        </div>
      )}
    </div>
  );
}

export default function StepInmueble({ data, updateData, onNext, onPrev }: Props) {
  const { inmueble } = data;
  const [descMode, setDescMode] = useState<'simple' | 'full'>('simple');
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');

  const update = (field: keyof Inmueble, value: string) => {
    updateData({ inmueble: { ...inmueble, [field]: value } });
  };

  const setModo = (modo: ModoTitulo) => {
    updateData({ inmueble: { ...inmueble, modo } });
  };

  // Dropdown banco: guarda el texto largo directamente
  const handleBancoChange = (corto: string) => {
    if (corto === '') { update('bancoFiduciario', ''); return; }
    if (corto === 'OTRO') { update('bancoFiduciario', 'OTRO'); return; }
    const banco = BANCOS.find((b) => b.corto === corto);
    update('bancoFiduciario', banco ? banco.largo : corto);
  };

  // Encuentra el corto del banco actual para mostrar en el select
  const bancoCortoActual = BANCOS.find((b) => b.largo === inmueble.bancoFiduciario)?.corto ?? 
    (inmueble.bancoFiduciario === 'OTRO' ? 'OTRO' : inmueble.bancoFiduciario === '' ? '' : 'OTRO');

  const esFideicomiso = inmueble.modo === 'fideicomiso';

  const handleTranslate = async () => {
    const texto = inmueble.descripcion.trim();
    if (!texto) return;
    setTranslating(true);
    setTranslateError('');
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a legal translator specializing in Mexican real estate property descriptions. Translate Spanish property registry descriptions to formal English. Preserve all technical terms, measurements, cardinal directions (Noreste→Northeast, Sureste→Southeast, Suroeste→Southwest, Noroeste→Northwest), and legal vocabulary. Use "linear meters" for "ml", "square meters" for "m²". Keep the same structure and punctuation. Output ONLY the translated text, no explanations.',
          messages: [{ role: 'user', content: `Translate this Mexican property registry description to English:\n\n${texto}` }],
        }),
      });
      const data = await response.json();
      if (data.content?.[0]?.text) {
        update('descripcionEN', data.content[0].text.trim());
      } else {
        setTranslateError('No se recibió traducción. Intenta de nuevo.');
      }
    } catch {
      setTranslateError('Error de conexión. Verifica tu red e intenta de nuevo.');
    } finally {
      setTranslating(false);
    }
  };

  const canContinue = inmueble.descripcion.trim() || 
    (inmueble.departamento && inmueble.nombreCondominio);

  // Genera texto RPP según estado
  const buildRPPPreview = () => {
    const i = inmueble;
    if (!i.rppEstado) return '';
    const ciudad = i.escrituraNotaria || (i.rppEstado === 'nayarit' ? 'Bahía de Banderas, Nayarit' : 'Puerto Vallarta, Jalisco');
    const rpp = `Registro Público de la Propiedad y de Comercio de ${ciudad}`;
    if (i.rppTipo === 'folio_real' && i.rppFolioReal) {
      const label = i.rppEstado === 'nayarit' ? 'Folio Real Electrónico' : 'Folio Real';
      return `, inscrito ante el ${rpp}, bajo ${label} número ${i.rppFolioReal}`;
    } else if (i.rppTipo === 'legacy') {
      if (i.rppEstado === 'nayarit' && i.rppLibroNay)
        return `, inscrito ante el ${rpp}, bajo Libro ${i.rppLibroNay}${i.rppSeccionNay ? ', Sección ' + i.rppSeccionNay : ''}${i.rppSerieNay ? ', Serie ' + i.rppSerieNay : ''}${i.rppPartidaNay ? ', Partida ' + i.rppPartidaNay : ''}`;
      if (i.rppEstado === 'jalisco' && i.rppDocumentoJal)
        return `, inscrito ante el ${rpp}, bajo Documento ${i.rppDocumentoJal}${i.rppFoliosJal ? ', Folios ' + i.rppFoliosJal : ''}${i.rppLibroJal ? ', Libro ' + i.rppLibroJal : ''}${i.rppSeccionJal ? ', Sección ' + i.rppSeccionJal : ''}`;
    }
    return '';
  };

  // Genera párrafo de escritura (vista previa)
  const buildEscrituraParrafo = () => {
    const i = inmueble;
    if (!i.escrituraNumero && !i.escrituraNotario) return '';
    let txt = `El inmueble consta en Escritura Pública número ${i.escrituraNumero || '___'}`;
    if (i.escrituraFecha) txt += `, de fecha ${i.escrituraFecha}`;
    if (i.escrituraNotario) txt += `, otorgada ante el Licenciado ${i.escrituraNotario}`;
    if (i.escrituraNotaria) txt += `, Notario Público ${i.escrituraNotaria}`;
    if (i.escrituraVolumen) txt += `, Volumen ${i.escrituraVolumen}`;
    if (i.escrituraFolio) txt += `, Folio ${i.escrituraFolio}`;
    const rpp = buildRPPPreview();
    if (rpp) txt += rpp;
    txt += '.';
    return txt;
  };

  return (
    <div>
      <h2 style={{ fontSize: '22px', color: 'var(--pg-gold)', marginBottom: '6px', fontFamily: 'Times New Roman, serif' }}>
        Paso 2 — El Inmueble
      </h2>
      <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.6)', marginBottom: '24px' }}>
        Descripción registral e identificación del título de propiedad
      </p>

      {/* ── TOGGLE MODO ── */}
      <div style={{
        display: 'flex',
        border: '1px solid rgba(201,168,76,0.25)',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        <button style={TOGGLE_STYLE(esFideicomiso)} onClick={() => setModo('fideicomiso')}>
          🏦 Con Fideicomiso
        </button>
        <button style={TOGGLE_STYLE(!esFideicomiso)} onClick={() => setModo('escritura')}>
          📜 Con Escritura (sin fideicomiso)
        </button>
      </div>

      {/* ── MODO FIDEICOMISO ── */}
      {esFideicomiso && (
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
            <label className="pg-label">
              Banco Fiduciario
              <span style={{ color: 'rgba(245,240,232,0.35)', fontWeight: 'normal', marginLeft: '6px', textTransform: 'none', letterSpacing: 0 }}>(opcional)</span>
            </label>
            <select
              className="pg-select"
              value={bancoCortoActual}
              onChange={(e) => handleBancoChange(e.target.value)}
              style={{ marginBottom: '8px' }}
            >
              <option value="">— Sin especificar —</option>
              {BANCOS.map((b) => (
                <option key={b.corto} value={b.corto}>{b.corto}</option>
              ))}
              <option value="OTRO">Otro (especificar abajo)</option>
            </select>

            {inmueble.bancoFiduciario && inmueble.bancoFiduciario !== 'OTRO' && (
              <div style={{ padding: '9px 12px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', fontSize: '11px', color: 'rgba(245,240,232,0.5)', lineHeight: '1.5', fontStyle: 'italic' }}>
                {inmueble.bancoFiduciario}
              </div>
            )}
            {inmueble.bancoFiduciario === 'OTRO' && (
              <input
                className="pg-input"
                placeholder="Nombre completo del banco fiduciario tal como aparece en la escritura"
                onChange={(e) => update('bancoFiduciario', e.target.value)}
                style={{ marginTop: '6px' }}
              />
            )}
            {!inmueble.bancoFiduciario && (
              <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.3)', marginTop: '4px' }}>
                Si se omite, la cláusula solo indicará el número de fideicomiso.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODO ESCRITURA ── */}
      {!esFideicomiso && (
        <div className="pg-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)', marginBottom: '8px' }}>
            Escritura Pública / Public Deed
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.45)', marginBottom: '18px' }}>
            Estos datos aparecen al final de la descripción del inmueble, identificando el título de propiedad.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="pg-label">Número de Escritura *</label>
              <input className="pg-input" placeholder="ej. 45,231" value={inmueble.escrituraNumero} onChange={(e) => update('escrituraNumero', e.target.value)} />
            </div>
            <div>
              <label className="pg-label">Fecha de la Escritura</label>
              <input className="pg-input" placeholder="ej. 15 de enero de 2020" value={inmueble.escrituraFecha} onChange={(e) => update('escrituraFecha', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="pg-label">Nombre del Notario</label>
              <input className="pg-input" placeholder="ej. Juan Carlos Pérez López" value={inmueble.escrituraNotario} onChange={(e) => update('escrituraNotario', e.target.value)} />
            </div>
            <div>
              <label className="pg-label">Notaría Pública No.</label>
              <input className="pg-input" placeholder="ej. Notaría 18 de Puerto Vallarta" value={inmueble.escrituraNotaria} onChange={(e) => update('escrituraNotaria', e.target.value)} />
            </div>
            <div>
              <label className="pg-label">Cuenta Predial / Property Account</label>
              <input className="pg-input" placeholder="ej. U016345" value={inmueble.cuentaPredial} onChange={(e) => update('cuentaPredial', e.target.value)} />
            </div>
            <div>
              <label className="pg-label">Volumen / Tomo <span style={{ opacity: 0.4 }}>(opcional)</span></label>
              <input className="pg-input" placeholder="ej. XII" value={inmueble.escrituraVolumen} onChange={(e) => update('escrituraVolumen', e.target.value)} />
            </div>
            <div>
              <label className="pg-label">Folio <span style={{ opacity: 0.4 }}>(opcional)</span></label>
              <input className="pg-input" placeholder="ej. 234" value={inmueble.escrituraFolio} onChange={(e) => update('escrituraFolio', e.target.value)} />
            </div>
            {/* RPP - Sistema estructurado igual que OfertaGen */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '14px', marginTop: '4px' }}>
              <div style={{ fontSize: '13px', color: 'var(--pg-gold)', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Inscripción RPP <span style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.5 }}>(opcional)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="pg-label">Estado del RPP</label>
                  <select className="pg-select" value={inmueble.rppEstado} onChange={(e) => update('rppEstado', e.target.value)}>
                    <option value="">— Sin inscripción —</option>
                    <option value="nayarit">Nayarit (Bahía de Banderas, Bucerías)</option>
                    <option value="jalisco">Jalisco (Puerto Vallarta)</option>
                  </select>
                </div>
                {inmueble.rppEstado && (
                  <div>
                    <label className="pg-label">Tipo de inscripción</label>
                    <select className="pg-select" value={inmueble.rppTipo} onChange={(e) => update('rppTipo', e.target.value)}>
                      <option value="folio_real">Folio Real{inmueble.rppEstado === 'nayarit' ? ' Electrónico' : ''}</option>
                      <option value="legacy">Inscripción tradicional (legacy)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Folio Real — ambos estados */}
              {inmueble.rppEstado && inmueble.rppTipo === 'folio_real' && (
                <div style={{ marginTop: '10px' }}>
                  <label className="pg-label">{inmueble.rppEstado === 'nayarit' ? 'Folio Real Electrónico' : 'Folio Real'}</label>
                  <input className="pg-input" placeholder="ej. 54832" value={inmueble.rppFolioReal} onChange={(e) => update('rppFolioReal', e.target.value)} />
                </div>
              )}

              {/* Legacy Nayarit */}
              {inmueble.rppEstado === 'nayarit' && inmueble.rppTipo === 'legacy' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div><label className="pg-label">Libro</label><input className="pg-input" placeholder="ej. 3" value={inmueble.rppLibroNay} onChange={(e) => update('rppLibroNay', e.target.value)} /></div>
                  <div><label className="pg-label">Sección</label><input className="pg-input" placeholder="ej. Primera" value={inmueble.rppSeccionNay} onChange={(e) => update('rppSeccionNay', e.target.value)} /></div>
                  <div><label className="pg-label">Serie</label><input className="pg-input" placeholder="ej. A" value={inmueble.rppSerieNay} onChange={(e) => update('rppSerieNay', e.target.value)} /></div>
                  <div><label className="pg-label">Partida</label><input className="pg-input" placeholder="ej. 245" value={inmueble.rppPartidaNay} onChange={(e) => update('rppPartidaNay', e.target.value)} /></div>
                </div>
              )}

              {/* Legacy Jalisco */}
              {inmueble.rppEstado === 'jalisco' && inmueble.rppTipo === 'legacy' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                  <div><label className="pg-label">Documento</label><input className="pg-input" placeholder="ej. 1234" value={inmueble.rppDocumentoJal} onChange={(e) => update('rppDocumentoJal', e.target.value)} /></div>
                  <div><label className="pg-label">Folios</label><input className="pg-input" placeholder="ej. 45-48" value={inmueble.rppFoliosJal} onChange={(e) => update('rppFoliosJal', e.target.value)} /></div>
                  <div><label className="pg-label">Libro</label><input className="pg-input" placeholder="ej. 5" value={inmueble.rppLibroJal} onChange={(e) => update('rppLibroJal', e.target.value)} /></div>
                  <div><label className="pg-label">Sección</label><input className="pg-input" placeholder="ej. Primera" value={inmueble.rppSeccionJal} onChange={(e) => update('rppSeccionJal', e.target.value)} /></div>
                </div>
              )}
            </div>
          </div>

          {/* Preview del párrafo generado */}
          {(inmueble.escrituraNumero || inmueble.escrituraNotario) && (
            <div style={{ marginTop: '18px', padding: '12px 14px', background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px' }}>
              <div style={{ fontSize: '10px', color: 'var(--pg-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                Vista previa — párrafo que aparecerá en el documento:
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.65)', lineHeight: '1.6', fontStyle: 'italic' }}>
                {buildEscrituraParrafo()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── DESCRIPCIÓN DEL INMUEBLE ── */}
      <div className="pg-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pg-gold)' }}>
            Descripción del Inmueble *
          </h3>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['simple', 'full'] as const).map((m) => (
              <button key={m} onClick={() => setDescMode(m)} style={{
                padding: '4px 12px', fontSize: '12px',
                border: '1px solid rgba(201,168,76,0.4)', borderRadius: '4px', cursor: 'pointer',
                background: descMode === m ? 'rgba(201,168,76,0.2)' : 'transparent',
                color: descMode === m ? 'var(--pg-gold)' : 'rgba(245,240,232,0.5)',
              }}>
                {m === 'simple' ? 'Por campos' : 'Texto libre'}
              </button>
            ))}
          </div>
        </div>

        {descMode === 'simple' ? (
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="pg-label">Departamento / Unit</label>
                <input className="pg-input" placeholder="ej. Departamento 404, tipo C-PH" value={inmueble.departamento || ''} onChange={(e) => update('departamento', e.target.value)} />
              </div>
              <div>
                <label className="pg-label">Nombre del Condominio</label>
                <input className="pg-input" placeholder="ej. Nitta Nuevo Vallarta" value={inmueble.nombreCondominio || ''} onChange={(e) => update('nombreCondominio', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="pg-label">Dirección / Address</label>
              <input className="pg-input" placeholder="ej. Av. Paseo de los Cocoteros 111 Norte" value={inmueble.direccion || ''} onChange={(e) => update('direccion', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label className="pg-label">Municipio</label>
                <input className="pg-input" placeholder="ej. Bahía de Banderas" value={inmueble.municipio || ''} onChange={(e) => update('municipio', e.target.value)} />
              </div>
              <div>
                <label className="pg-label">Estado</label>
                <select className="pg-select" value={inmueble.estado || 'Nayarit'} onChange={(e) => update('estado', e.target.value)}>
                  {['Nayarit','Jalisco','Baja California Sur','Quintana Roo','Sonora','Sinaloa','Guerrero','Oaxaca','Colima','Michoacán'].map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="pg-label">C.P.</label>
                <input className="pg-input" placeholder="ej. 63735" value={inmueble.cp || ''} onChange={(e) => update('cp', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="pg-label">Descripción registral (Español)</label>
              <textarea className="pg-textarea" rows={4}
                placeholder="Pega aquí la descripción registral completa con medidas y linderos (recomendado para validez notarial)"
                value={inmueble.descripcion}
                onChange={(e) => { update('descripcion', e.target.value); if (inmueble.descripcionEN) update('descripcionEN', ''); }}
              />
              <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', marginTop: '4px' }}>
                Si se deja vacío, se usarán los campos de arriba para construir la descripción.
              </div>
            </div>
            {/* Traducción EN */}
            <TranslateBlock
              descripcion={inmueble.descripcion}
              descripcionEN={inmueble.descripcionEN || ''}
              translating={translating}
              translateError={translateError}
              onTranslate={handleTranslate}
              onChangeEN={(v) => update('descripcionEN', v)}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="pg-label">Descripción Registral Completa (Español) *</label>
              <textarea className="pg-textarea" rows={7}
                placeholder="Pega aquí el texto completo de la descripción del inmueble tal como aparece en la escritura o fideicomiso, incluyendo medidas y linderos..."
                value={inmueble.descripcion}
                onChange={(e) => { update('descripcion', e.target.value); if (inmueble.descripcionEN) update('descripcionEN', ''); }}
              />
              <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.35)', marginTop: '4px' }}>
                Se insertará tal cual en la columna izquierda del documento bilingüe.
              </div>
            </div>
            <TranslateBlock
              descripcion={inmueble.descripcion}
              descripcionEN={inmueble.descripcionEN || ''}
              translating={translating}
              translateError={translateError}
              onTranslate={handleTranslate}
              onChangeEN={(v) => update('descripcionEN', v)}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="pg-btn-secondary" onClick={onPrev}>← Anterior</button>
        <button className="pg-btn-primary" onClick={onNext} >
          Siguiente: Facultades →
        </button>
      </div>
    </div>
  );
}
