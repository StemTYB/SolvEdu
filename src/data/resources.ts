import type { ResourceDoc } from './types'

export const RESOURCES: ResourceDoc[] = [
  {
    id: 'RES-01',
    title: 'Política de Puerto seguro v4.2',
    category: 'Política',
    summary:
      'El compromiso de toda la plataforma: a qué se comprometen las empresas a no ir, qué queda fuera de la protección y cómo se escala una disputa de alcance.',
    updatedAt: '2026-09-05',
    readMinutes: 9,
    pinned: true,
  },
  {
    id: 'RES-02',
    title: 'Reglas de enfrentamiento para programas de acceso físico',
    category: 'Política',
    summary:
      'Pruebas únicamente supervisadas, manejo de unidades de banco, cadena de custodia y la prohibición absoluta de probar infraestructura en producción.',
    updatedAt: '2026-08-30',
    readMinutes: 12,
    pinned: true,
  },
  {
    id: 'RES-03',
    title: 'Escribir un reporte que un triador pueda reproducir de una sola pasada',
    category: 'Directriz',
    summary:
      'Entorno, precondición, pasos mínimos, observado frente a esperado. Las cuatro secciones que deciden si tu reporte entra a triaje o se devuelve.',
    updatedAt: '2026-08-14',
    readMinutes: 7,
    pinned: true,
  },
  {
    id: 'RES-04',
    title: 'Rúbrica de severidad y equivalencia con CVSS',
    category: 'Referencia',
    summary:
      'Cómo traduce cada empresa el CVSS a sus bandas internas de severidad y por qué el mismo hallazgo puede liquidarse en niveles distintos según el programa.',
    updatedAt: '2026-09-11',
    readMinutes: 6,
    pinned: false,
  },
  {
    id: 'RES-05',
    title: 'Estándares de prueba de concepto',
    category: 'Directriz',
    summary:
      'Qué cuenta como evidencia suficiente: scripts acotados, capturas saneadas y las reglas de anonimización para todo lo que contenga datos personales.',
    updatedAt: '2026-07-28',
    readMinutes: 8,
    pinned: false,
  },
  {
    id: 'RES-06',
    title: 'Duplicados, colisiones y reparto de crédito',
    category: 'Política',
    summary:
      'Cómo resuelve la plataforma dos reportes del mismo defecto, cuándo se concede crédito parcial y cómo apelar una decisión de duplicado.',
    updatedAt: '2026-06-19',
    readMinutes: 5,
    pinned: false,
  },
  {
    id: 'RES-07',
    title: 'Depósito en garantía, liquidación y calendario de pagos',
    category: 'Política',
    summary:
      'Por qué las recompensas pasan por un depósito en garantía, las ventanas de liberación de cada empresa, la documentación fiscal de las becas y los umbrales de retiro.',
    updatedAt: '2026-08-06',
    readMinutes: 11,
    pinned: false,
  },
  {
    id: 'RES-08',
    title: 'Reputación, niveles y cómo se calcula el ranking',
    category: 'Referencia',
    summary:
      'La ponderación entre severidad, dificultad del alcance y precisión, y la caducidad que mantiene honesta la clasificación con el tiempo.',
    updatedAt: '2026-09-01',
    readMinutes: 7,
    pinned: false,
  },
  {
    id: 'RES-09',
    title: 'Lista de verificación para pruebas de hardware y firmware',
    category: 'Guía práctica',
    summary:
      'Montaje del banco, aislamiento de alimentación, límites térmicos y los registros que debes capturar antes de tocar una unidad suministrada.',
    updatedAt: '2026-08-22',
    readMinutes: 14,
    pinned: false,
  },
  {
    id: 'RES-10',
    title: 'Sistemas arcanos: introducción para profanos',
    category: 'Guía práctica',
    summary:
      'Análogos cartografiados para canalizaciones de rituales rúnicos, por qué un glifo de protección es una máquina de estados y los modos de fallo que conviene probar primero.',
    updatedAt: '2026-07-15',
    readMinutes: 16,
    pinned: false,
  },
  {
    id: 'RES-11',
    title: 'Plazos de divulgación y publicación coordinada',
    category: 'Política',
    summary:
      '90 días como valor por defecto, las prórrogas que puede solicitar una empresa y qué ocurre cuando un proveedor incumple la fecha.',
    updatedAt: '2026-05-30',
    readMinutes: 6,
    pinned: false,
  },
  {
    id: 'RES-12',
    title: 'Integridad académica y solapamiento con trabajos de curso',
    category: 'Directriz',
    summary:
      'Cómo declarar una recompensa que se solapa con tu trabajo de curso y dónde está la línea entre un proyecto de clase y un encargo facturable.',
    updatedAt: '2026-06-27',
    readMinutes: 5,
    pinned: false,
  },
]
