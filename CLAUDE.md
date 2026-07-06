# CLAUDE.md — PoderGen

## Identidad del proyecto
- **Producto:** PoderGen — Generador de Poderes Notariales Bilingüe (ES | EN | FR)
- **URL producción:** https://podergen.expatadvisormx.com
- **Repo:** github.com/Pvrolomx/podergen
- **Organización Vercel:** team_xmFW0blsjqFI5lwt29wBPi8Q
- **Proyecto Vercel:** prj_sFyi8e5axq76IdunptgbfpAI87xe

## Stack
- Next.js 14.2.5 (App Router) + TypeScript 5 + Tailwind CSS 3.4
- `docx` ^8.5 — generación del DOCX bilingüe en cliente
- `file-saver` ^2.0 — descarga del DOCX
- Gestor: npm (`package-lock.json` presente — usar `npm ci`)

## Estructura

```
app/        layout.tsx, page.tsx, globals.css   ← shell principal, wizard, auto-save
  api/translate/route.ts                        ← API route server-side (traducción IA)
components/ StepPartes.tsx      ← Paso 1: poderdantes, apoderados, régimen, modo proemio
            StepInmueble.tsx    ← Paso 2: fideicomiso/escritura, RPP, descripción legal
            StepFacultades.tsx  ← Paso 3: 14 facultades configurables
            StepPreview.tsx     ← Paso 4: preview + botón generar DOCX
lib/        generateDocx.ts     ← motor DOCX bilingüe (tabla 2 columnas ES | EN/FR)
            concordancia.ts     ← concordancia género/número + certificación notarial
            traduccionesFR.ts   ← textos legales en francés
            demoData.ts         ← caso demo: Marjorie Braatz / NITTA 404
types/      poder.ts            ← tipos TypeScript + ESTADO_CIVIL_LABELS + FACULTADES_LABELS
public/     ← PWA (manifest, icons)
```

## Ramas y deploy
- **Una sola rama: `main`**
- **Production branch = `main`** → Vercel despliega automáticamente en cada push
- Tag `v1.0` marca el estado de producción inicial (commit `c2c88cd`)
- NO hay `vercel.json` ni workflows — config de deploy solo en dashboard de Vercel

## Variables de entorno
| Variable | Dónde | Uso |
|----------|-------|-----|
| `ANTHROPIC_API_KEY` | Vercel (encrypted) | Traducción IA en `/api/translate` |

Nunca commitear secrets. `.env*` está en `.gitignore`.

## Protocolo de cambios
1. `npm ci` después de cada clone fresco
2. `npm run build` antes de cada commit — si falla, no pushear
3. Push a `main` → Vercel despliega automáticamente
4. Para deploy manual vía API: ver historial de sesiones en claude.ai

## Features implementadas
- Wizard 4 pasos con auto-save en `localStorage` (debounce 1s)
- Guardar/Cargar borradores JSON (↓ Guardar / ↑ Cargar)
- Hasta 4 poderdantes con concordancia de género y número
- Campo "también conocido(a) como" (AKA) por poderdante
- Apoderados múltiples con concordancia singular/plural
- Régimen legal: Nayarit (Arts. 1926/1927) o Jalisco (Arts. 2207/2204/2244)
- Columna derecha EN o FR (toggle en header)
- 14 facultades con subjuntivo automático según número de apoderados
- Fideicomiso o escritura — RPP Nayarit y Jalisco
- Certificación notarial o modo suscrito
- Traducción IA de descripción legal y ocupación libre (Claude Haiku)
- DOCX: Arial 10pt, bordes perimetrales + divisor vertical, numeración de páginas
- Nombres de poderdantes y apoderados en negrita
- Tipo de poder en negrita en HACER CONSTAR y Primera Cláusula
- Generales del poderdante integrados en el proemio (un párrafo fluido)
- Firma individual por poderdante con AKA en itálica

## Artefactos a limpiar
- `tsconfig.tsbuildinfo` está committeado — agregar a `.gitignore` y eliminar del tracking:

```
git rm --cached tsconfig.tsbuildinfo
```
Agregar línea `tsconfig.tsbuildinfo` al `.gitignore`.

## Hermanos del proyecto
PoderGen es parte del ecosistema Expat Advisor MX junto con:
OfertaGen, FideicomisoGen, GeneralesGen, AdminGen, CuentaGen, lluvia-alert,
Calculadora Fiscal Notarial, DocVault, Castle Ops/Checkin, ASTRO4.
Todos bajo la org `Pvrolomx` en GitHub y el team `team_xmFW0blsjqFI5lwt29wBPi8Q` en Vercel.
