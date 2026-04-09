'use client';

import { useState } from 'react';
import type { PoderData } from '@/types/poder';
import { DEFAULT_PODER } from '@/types/poder';
import { DEMO_PODER } from '@/lib/demoData';
import StepPartes from '@/components/StepPartes';
import StepInmueble from '@/components/StepInmueble';
import StepFacultades from '@/components/StepFacultades';
import StepPreview from '@/components/StepPreview';

const STEPS = [
  { num: 1, label: 'Partes', labelEn: 'Parties' },
  { num: 2, label: 'Inmueble', labelEn: 'Property' },
  { num: 3, label: 'Facultades', labelEn: 'Powers' },
  { num: 4, label: 'Generar', labelEn: 'Generate' },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PoderData>(DEFAULT_PODER);
  const [isDemo, setIsDemo] = useState(false);

  const updateData = (partial: Partial<PoderData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));
  const goTo = (n: number) => { if (n < step) setStep(n); };

  const loadDemo = () => {
    setData(DEMO_PODER);
    setIsDemo(true);
    setStep(4); // saltar directo al preview
  };

  const resetForm = () => {
    setData(DEFAULT_PODER);
    setIsDemo(false);
    setStep(1);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(10,22,40,0.98)',
        borderBottom: '1px solid rgba(201,168,76,0.3)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '16px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '22px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            background: 'linear-gradient(90deg, #C9A84C, #E8C96A, #C9A84C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            PoderGen
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(245,240,232,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Expat Advisor MX — Poderes Notariales Bilingüe
          </div>
        </div>

        {/* Demo button + Reset */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isDemo && (
            <button
              onClick={resetForm}
              style={{
                padding: '7px 14px',
                fontSize: '12px',
                background: 'transparent',
                border: '1px solid rgba(245,240,232,0.2)',
                borderRadius: '4px',
                color: 'rgba(245,240,232,0.5)',
                cursor: 'pointer',
                fontFamily: 'Times New Roman, serif',
                letterSpacing: '0.05em',
              }}
            >
              ✕ Limpiar
            </button>
          )}
          <button
            onClick={loadDemo}
            style={{
              padding: '8px 18px',
              fontSize: '13px',
              background: isDemo
                ? 'rgba(201,168,76,0.15)'
                : 'linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.1) 100%)',
              border: '1px solid rgba(201,168,76,0.5)',
              borderRadius: '4px',
              color: '#C9A84C',
              cursor: 'pointer',
              fontFamily: 'Times New Roman, serif',
              fontWeight: 'bold',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            ▶ Demo
          </button>
        </div>

        <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.4)', textAlign: 'right', display: 'none' }}>
          <div>expatadvisormx.com</div>
        </div>
      </header>

      {/* Demo banner */}
      {isDemo && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.08) 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.35)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>👁</span>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--pg-gold)', fontWeight: 'bold' }}>
                Modo Demo
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(245,240,232,0.6)', marginLeft: '10px' }}>
                Caso real: Marjorie Braatz → NITTA 404, Fideicomiso 751699 Banorte
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px', background: 'transparent', color: 'rgba(245,240,232,0.6)', cursor: 'pointer' }}>Paso 1</button>
            <button onClick={() => setStep(2)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px', background: 'transparent', color: 'rgba(245,240,232,0.6)', cursor: 'pointer' }}>Paso 2</button>
            <button onClick={() => setStep(3)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '3px', background: 'transparent', color: 'rgba(245,240,232,0.6)', cursor: 'pointer' }}>Paso 3</button>
            <button onClick={() => setStep(4)} style={{ padding: '4px 10px', fontSize: '11px', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '3px', background: 'rgba(201,168,76,0.15)', color: 'var(--pg-gold)', cursor: 'pointer', fontWeight: 'bold' }}>Preview ▶</button>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div style={{
        background: 'rgba(20,34,54,0.8)',
        borderBottom: '1px solid rgba(201,168,76,0.15)',
        padding: '20px 24px',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="pg-step-indicator">
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => goTo(s.num)}
                    className={`pg-step-dot ${step === s.num ? 'active' : step > s.num ? 'done' : 'pending'}`}
                    style={{ cursor: step > s.num ? 'pointer' : 'default' }}
                  >
                    {step > s.num ? '✓' : s.num}
                  </button>
                  <span style={{
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: step === s.num ? 'var(--pg-gold)' : step > s.num ? 'var(--pg-gold-dark)' : 'rgba(245,240,232,0.35)',
                    whiteSpace: 'nowrap',
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`pg-step-line ${step > s.num ? 'done' : ''}`} style={{ marginBottom: '20px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main style={{ flex: 1, padding: '32px 24px', maxWidth: '780px', width: '100%', margin: '0 auto' }}>
        <div className="pg-fade-in" key={step}>
          {step === 1 && <StepPartes data={data} updateData={updateData} onNext={next} />}
          {step === 2 && <StepInmueble data={data} updateData={updateData} onNext={next} onPrev={prev} />}
          {step === 3 && <StepFacultades data={data} updateData={updateData} onNext={next} onPrev={prev} />}
          {step === 4 && <StepPreview data={data} onPrev={prev} />}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(201,168,76,0.15)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(245,240,232,0.35)',
        background: 'rgba(10,22,40,0.9)',
      }}>
        Hecho por Colmena 2026 | PoderGen v1.0 | podergen.expatadvisormx.com
      </footer>
    </div>
  );
}
