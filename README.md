<div align="center">

# ⚡ SolvEDU

### Cazarrecompensas técnicas para estudiantes de ingeniería

*Conectamos problemas técnicos reales de empresas con estudiantes que quieren resolverlos.*

![ODS 4](https://img.shields.io/badge/ODS-4%20Educación%20de%20calidad-2563eb?style=flat-square)
![Status](https://img.shields.io/badge/estado-piloto-facc15?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Stripe%2FConekta-14b8a6?style=flat-square)
![Ubicación](https://img.shields.io/badge/región-Ciudad%20Juárez%2C%20MX-fb7185?style=flat-square)

</div>

---

## 🧩 El problema

> Muchos estudiantes de ingeniería se gradúan sin haber resuelto un problema técnico real.
> Muchas empresas tienen tareas técnicas pendientes que su personal, ya saturado, no alcanza a atender.

**SolvEDU** conecta ambas partes en una sola plataforma, con incentivo económico real de por medio.

---

## 🚀 Cómo funciona

```
  EMPRESA                    SOLVEDU                    ESTUDIANTE
┌──────────┐   1. Publica   ┌──────────┐   3. Compite   ┌──────────┐
│ Problema │ ─────────────► │  Reto +  │ ◄───────────── │ Propuesta│
│  técnico │   2. Deposita  │ depósito │   4. Aprueba   │  técnica │
└──────────┘   recompensa   └──────────┘   la mejor     └──────────┘
                                  │
                                  ▼
                    5. Pago automático al ganador
                    6. Calificación mutua (reputación)
```

| Paso | Qué pasa |
|:--:|---|
| 1️⃣ | La empresa publica un problema técnico real |
| 2️⃣ | Deposita por adelantado la recompensa en la plataforma (retención tipo *escrow*) |
| 3️⃣ | Uno o varios estudiantes proponen soluciones, compitiendo entre sí |
| 4️⃣ | La empresa evalúa y aprueba la mejor propuesta |
| 5️⃣ | El pago se libera automáticamente al estudiante ganador |
| 6️⃣ | Ambos se califican, construyendo un sistema de reputación |

---

## 🖥️ Vista previa del producto

Este repo incluye `solvedu-mockup.html` — una maqueta interactiva navegable con 5 vistas:

| Vista | Contenido |
|---|---|
| 🏠 **Panel** | Resumen de ganancias, racha de retos, actividad reciente |
| 🎯 **Retos activos** | Problemas técnicos abiertos por empresa, recompensa y cierre |
| 🏆 **Leaderboard** | Ranking de estudiantes con más retos resueltos |
| 🏢 **Empresas** | Ranking de empresas con más retos publicados |
| 👤 **Perfil** | Reputación, insignias y ganancias del estudiante |

> Ábrelo con doble clic — no requiere servidor ni instalación.

---

## 💡 Solución tecnológica

- **Frontend:** React
- **Backend:** API + base de datos con cuentas de usuario y sistema de calificaciones
- **Pagos:** pasarela tipo Stripe/Conekta con retención de depósito hasta la aprobación
- **Modelo de custodia:** SolvEDU nunca retiene fondos directamente — usa infraestructura de un proveedor de pagos ya regulado

---

## 📈 Viabilidad

| Actor | Beneficio |
|---|---|
| 🏢 Empresas | Resuelven problemas técnicos rápido, sin contratar personal extra, comparando varias propuestas a la vez |
| 🎓 Estudiantes | Ganan dinero y experiencia real resolviendo retos de la industria |
| 🌉 Universidad–industria | Fortalece el vínculo entre ambos sectores en Ciudad Juárez |

**Modelo de ingresos:** comisión del 5% sobre cada recompensa pagada con éxito.

---

## 🎯 Alineación al ODS 4

**Meta 4.4** — dotar a los jóvenes de las habilidades técnicas necesarias para acceder al empleo.
SolvEDU da a los estudiantes acceso igualitario a experiencia práctica real, con la meta de que **1 de cada 3** estudiantes que resuelven retos recurrentes consiga una oferta formal de prácticas o mentoría.

---

## 🧠 Metodología — Design Thinking

`Empatizar` → `Definir` → `Idear` → `Prototipar` → `Probar`

---

## 👥 Equipo

**Ingeniería Mecatrónica**

- Angel Jesus Hernandez Blanco — 225562
- Martinez Ortega Angel Daniel — 235926
- Oscar Irvin Castro Luna — 242391
- Yaneli Jazmin Hernandez Hernandez — 242392

---

<div align="center">

*SolvEDU — donde los problemas técnicos reales encuentran a quien los quiere resolver.*

</div>
