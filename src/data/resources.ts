import type { ResourceCategory, ResourceDoc } from './types'

/**
 * The order the library renders its groups in. Declared here rather than in the
 * view because it is a property of the content: terms first, the business case
 * last.
 */
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'Legal / Cumplimiento',
  'Pagos',
  'Propiedad intelectual',
  'Resolución de conflictos',
  'Reputación y calidad',
  'Onboarding',
  'Seguridad de datos',
  'Negocio',
]

/**
 * Every document a company, a student or a reviewer would ask for, with a
 * paragraph of plain-language context. `readMinutes` describes the full text;
 * `body` is the summary a reader gets without opening it.
 */
export const RESOURCES: ResourceDoc[] = [
  // ------------------------------------------------------- Legal / Cumplimiento
  {
    id: 'RES-01',
    title: 'Términos y Condiciones de Uso',
    category: 'Legal / Cumplimiento',
    body: 'Es el contrato marco que acepta cualquiera que abra una cuenta, sea empresa o estudiante, y define qué es la plataforma y qué no: un mercado que pone en contacto a las dos partes, no un empleador ni un intermediario que ejecute el trabajo. Fija la capacidad legal para contratar, el uso aceptable, las causales de suspensión y la ley aplicable. Todo lo demás de esta biblioteca es un anexo de este documento, así que ninguna otra política puede contradecirlo.',
    readMinutes: 12,
    updatedAt: '2026-09-12',
    pinned: true,
  },
  {
    id: 'RES-02',
    title: 'Aviso de Privacidad (LFPDPPP)',
    category: 'Legal / Cumplimiento',
    body: 'Explica qué datos personales se recogen, con qué finalidad y durante cuánto tiempo se conservan, en los términos de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. Cubre la identidad del responsable, el ejercicio de los derechos de acceso, rectificación, cancelación y oposición, y cómo revocar el consentimiento. El resumen para quien evalúa: los datos de contacto no se comercializan, y el perfil público de un estudiante expone su seudónimo y su universidad, nunca su nombre legal.',
    readMinutes: 9,
    updatedAt: '2026-09-12',
    pinned: false,
  },
  {
    id: 'RES-03',
    title: 'Política de Prevención de Lavado de Dinero (PLD)',
    category: 'Legal / Cumplimiento',
    body: 'Describe cómo se verifica la identidad de las empresas que depositan y de los estudiantes que cobran, porque una plataforma que mueve dinero entre dos partes es, por definición, un punto ciego potencial para el lavado. Incluye la debida diligencia en el alta, el seguimiento de operaciones inusuales, los umbrales a partir de los cuales se pide documentación adicional y la obligación de reportar ante la autoridad competente. Existe para que un revisor institucional compruebe que el flujo de fondos tiene trazabilidad desde el primer día.',
    readMinutes: 11,
    updatedAt: '2026-08-19',
    pinned: false,
  },
  {
    id: 'RES-04',
    title: 'Deslinde de Responsabilidad (Disclaimer)',
    category: 'Legal / Cumplimiento',
    body: 'Aclara los límites de lo que la plataforma promete. No garantiza que un programa vaya a producir hallazgos, ni que un reporte vaya a ser aceptado, ni que la recompensa publicada se pague si nadie encuentra nada. Tampoco responde por el uso que cada parte dé a la información intercambiada ni por el daño que un tercero pueda causar. En una frase: se garantiza el proceso y el depósito en garantía, no el resultado de la investigación.',
    readMinutes: 4,
    updatedAt: '2026-09-02',
    pinned: false,
  },

  // ---------------------------------------------------------------------- Pagos
  {
    id: 'RES-05',
    title: 'Política de Pagos y Retención de Depósito (Escrow)',
    category: 'Pagos',
    body: 'Es el documento que responde a la pregunta más obvia: de dónde sale el dinero. La empresa deposita el monto de la recompensa antes de que el programa se publique, así que la plataforma nunca promete dinero que no exista. El estudiante cobra cuando su reporte se aprueba, no cuando la empresa decide corregir. Los fondos no los retenemos nosotros: viven en una cuenta de custodia de un proveedor de pagos regulado y la plataforma sólo da la instrucción de liberación. Si el programa se cancela sin hallazgos, el depósito vuelve íntegro a la empresa.',
    readMinutes: 10,
    updatedAt: '2026-09-15',
    pinned: true,
  },
  {
    id: 'RES-06',
    title: 'Política de Reembolsos y Cancelaciones',
    category: 'Pagos',
    body: 'Define qué ocurre cuando algo se deshace. Una empresa puede cancelar un programa antes de recibir el primer reporte y recuperar su depósito; después de ese punto sólo puede retirar los fondos de las recompensas que aún no se han adjudicado. Del lado del estudiante, un reporte rechazado no genera cobro ni penalización, y una recompensa ya liquidada no se revierte salvo fraude comprobado. El objetivo es que ninguna de las dos partes pueda usar la cancelación como herramienta de presión.',
    readMinutes: 7,
    updatedAt: '2026-08-27',
    pinned: false,
  },
  {
    id: 'RES-07',
    title: 'Tabla de Comisiones y Tarifas',
    category: 'Pagos',
    body: 'Es la hoja de precios, sin letra pequeña. Detalla el porcentaje que retiene la plataforma sobre cada recompensa liquidada, quién absorbe la comisión de la pasarela de pago y qué operaciones son gratuitas: publicar un programa, presentar un reporte y retirar por debajo del umbral mensual. Ninguna comisión se descuenta del monto publicado en la convocatoria, de modo que el estudiante ve desde el primer día la cifra exacta que va a cobrar.',
    readMinutes: 5,
    updatedAt: '2026-09-08',
    pinned: false,
  },

  // ------------------------------------------------------ Propiedad intelectual
  {
    id: 'RES-08',
    title: 'Política de Propiedad Intelectual (transferencia al pagar)',
    category: 'Propiedad intelectual',
    body: 'Resuelve la pregunta que más frena a un estudiante antes de presentar algo: de quién es lo que encontró. El reporte y la prueba de concepto siguen siendo suyos hasta que la recompensa se paga; en ese momento los derechos sobre el hallazgo y su reproducción se transfieren a la empresa, que es lo que le permite corregirlo y divulgarlo. La autoría intelectual y el derecho a firmar el hallazgo como propio nunca se transfieren.',
    readMinutes: 9,
    updatedAt: '2026-09-10',
    pinned: true,
  },
  {
    id: 'RES-09',
    title: 'Acuerdo de Confidencialidad / NDA estándar',
    category: 'Propiedad intelectual',
    body: 'Es el acuerdo que impide que la información vista durante una investigación salga de ahí. Cubre qué se considera confidencial, cuánto dura la obligación y las excepciones habituales: información que ya era pública, que se recibió por otra vía o que debe revelarse por orden legal. Es un documento único y de adhesión: ni la empresa puede pedir un NDA a medida, ni el estudiante puede imponer condiciones distintas a las de la convocatoria.',
    readMinutes: 6,
    updatedAt: '2026-07-31',
    pinned: false,
  },
  {
    id: 'RES-10',
    title: 'Política de Uso de Propuestas No Ganadoras',
    category: 'Propiedad intelectual',
    body: 'Protege el trabajo de quien no se lleva la recompensa. Una empresa que recibe una propuesta perdedora no puede reutilizarla, incorporarla a su hoja de ruta ni pedirle a su autor que la desarrolle por fuera de la plataforma. El documento fija además cuánto tiempo conserva la empresa acceso al material no adjudicado y cómo se destruye. Es el contrapeso necesario al acuerdo de confidencialidad: si se obliga a callar, hay que garantizar que la idea no se use sin pagar.',
    readMinutes: 6,
    updatedAt: '2026-08-05',
    pinned: false,
  },

  // -------------------------------------------------- Resolución de conflictos
  {
    id: 'RES-11',
    title: 'Política de Disputas y Mediación',
    category: 'Resolución de conflictos',
    body: 'Describe qué ocurre cuando las dos partes no se ponen de acuerdo sobre una severidad, un duplicado o un pago. La ruta es escalonada: primero una revisión interna por alguien que no participó en el triaje original, después una mediación con la plataforma como tercero y, sólo si eso falla, el arbitraje previsto en el contrato. Los plazos son fijos y públicos, y una disputa abierta congela el depósito en lugar de liberarlo, para que nadie gane por desgaste.',
    readMinutes: 8,
    updatedAt: '2026-08-14',
    pinned: false,
  },
  {
    id: 'RES-12',
    title: 'Código de Conducta / Reglas de la Comunidad',
    category: 'Resolución de conflictos',
    body: 'Es el mínimo no negociable de convivencia. Prohíbe el acoso, la divulgación de datos de terceros, la ingeniería social contra el personal de una empresa y la publicación de hallazgos antes del plazo acordado. También cubre el otro lado: una empresa no puede presionar a un estudiante para que rebaje la severidad ni amenazarlo con consecuencias académicas. Las sanciones van del aviso a la expulsión permanente y son las mismas para las dos partes.',
    readMinutes: 7,
    updatedAt: '2026-06-24',
    pinned: false,
  },

  // ----------------------------------------------------- Reputación y calidad
  {
    id: 'RES-13',
    title: 'Sistema de Calificaciones y Reputación',
    category: 'Reputación y calidad',
    body: 'Explica cómo se construye el puntaje que aparece en el perfil y en la clasificación. No es un promedio de estrellas: pondera la severidad del hallazgo, la dificultad del alcance y, sobre todo, la precisión del autor, es decir la proporción de reportes aceptados frente a los rechazados o duplicados. La reputación caduca si se deja de presentar reportes, para que un historial antiguo no sostenga indefinidamente una posición en el ranking.',
    readMinutes: 8,
    updatedAt: '2026-09-01',
    pinned: false,
  },
  {
    id: 'RES-14',
    title: 'Política de Verificación de Empresas y Estudiantes',
    category: 'Reputación y calidad',
    body: 'Detalla quién puede entrar y con qué comprobantes. Las empresas acreditan existencia legal, representante con facultades y capacidad de depositar en garantía antes de publicar su primer programa. Los estudiantes acreditan identidad y vínculo con una institución educativa, y eso es lo que desbloquea el cobro. El documento separa lo que se verifica una sola vez de lo que se revisa en cada pago, y explica por qué el perfil público muestra un seudónimo en lugar del nombre legal.',
    readMinutes: 9,
    updatedAt: '2026-08-11',
    pinned: false,
  },

  // ------------------------------------------------------------------ Onboarding
  {
    id: 'RES-15',
    title: 'Contrato/Acuerdo de Uso para Empresas',
    category: 'Onboarding',
    body: 'Es el contrato específico que firma una empresa al abrir su cuenta. Además de aceptar los términos generales, se compromete a financiar el depósito en garantía antes de publicar, a respetar las bandas de recompensa que declaró, a no contactar estudiantes por fuera de la plataforma y a sostener un tiempo de respuesta comprometido para el triaje. Incluye las causales de suspensión de su cuenta y la obligación de divulgar de forma coordinada cuando un hallazgo afecte a sus propios usuarios.',
    readMinutes: 13,
    updatedAt: '2026-07-22',
    pinned: false,
  },
  {
    id: 'RES-16',
    title: 'Contrato/Acuerdo de Uso para Estudiantes',
    category: 'Onboarding',
    body: 'Es el equivalente del lado del estudiante: qué acepta a cambio de poder presentar reportes. Se compromete a investigar sólo dentro del alcance publicado, a no acceder a datos personales, a no divulgar antes del plazo acordado y a declarar cualquier conflicto de interés, como que el activo pertenezca a su propia institución. A cambio, la plataforma garantiza el puerto seguro, la confidencialidad de su identidad frente a terceros y el pago a través del depósito en garantía.',
    readMinutes: 12,
    updatedAt: '2026-07-22',
    pinned: false,
  },

  // ----------------------------------------------------------- Seguridad de datos
  {
    id: 'RES-17',
    title: 'Política de Seguridad de la Información',
    category: 'Seguridad de datos',
    body: 'Describe cómo se protege lo que circula por la plataforma, no lo que se investiga. Cifrado en tránsito y en reposo, acceso al contenido de un reporte limitado a las personas que participan en su triaje, registro de auditoría de cada consulta y revisión periódica de permisos. Es un documento interno que se publica a propósito: quien va a reportar una vulnerabilidad tiene derecho a saber con qué seriedad se trata la información que entrega.',
    readMinutes: 10,
    updatedAt: '2026-09-04',
    pinned: false,
  },
  {
    id: 'RES-18',
    title: 'Política de Retención y Eliminación de Datos',
    category: 'Seguridad de datos',
    body: 'Fija cuánto tiempo vive cada cosa y qué se borra. Los reportes y su evidencia se conservan mientras el programa esté activo más el plazo legal aplicable; los documentos de verificación de identidad se destruyen al cerrar la cuenta; los datos agregados y anonimizados pueden conservarse indefinidamente para métricas. Cualquier persona puede solicitar la eliminación de su cuenta, y el documento describe con precisión qué sobrevive a esa solicitud y por qué.',
    readMinutes: 6,
    updatedAt: '2026-06-30',
    pinned: false,
  },

  // --------------------------------------------------------------------- Negocio
  {
    id: 'RES-19',
    title: 'Modelo de Ingresos y Estructura de Costos',
    category: 'Negocio',
    body: 'Explica de dónde sale el dinero de la plataforma y en qué se va. El ingreso principal es una comisión sobre cada recompensa liquidada; no se cobra por publicar un programa ni por presentar un reporte, porque interesa que crezca el volumen de intentos. El costo se concentra en tres partidas: la comisión del proveedor de pagos, el equipo de triaje y revisión, y la infraestructura. El documento muestra el punto de equilibrio por programa activo y por qué el modelo escala con el número de empresas y no con el de estudiantes.',
    readMinutes: 14,
    updatedAt: '2026-09-18',
    pinned: false,
  },
  {
    id: 'RES-20',
    title: 'Plan de Validación / Investigación de Mercado',
    category: 'Negocio',
    body: 'Es el documento que explica cómo se sabe que esto tiene demanda, en lugar de suponerlo. Resume la investigación con empresas de distintos tamaños sobre cuánto pagan hoy por un hallazgo y cuánto tardan en enterarse de uno; el piloto con instituciones educativas y las métricas que se comprometió a mover; y los indicadores que se siguen de cerca cada trimestre. Incluye de forma explícita los resultados que obligarían a cambiar el modelo, no sólo los que lo confirman.',
    readMinutes: 11,
    updatedAt: '2026-09-18',
    pinned: false,
  },
]
