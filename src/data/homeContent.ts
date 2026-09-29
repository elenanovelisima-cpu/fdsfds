/**
 * ============================================================================
 * ARCHIVO CENTRAL DE TEXTOS DE LA PÁGINA DE INICIO (HOME PAGE CONTENT)
 * ============================================================================
 * Puedes editar cualquier texto, título, subtítulo, botón, descripción o
 * etiqueta aquí directamente. Todos los cambios que hagas aquí se reflejan
 * automáticamente en la página web.
 * ============================================================================
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface FeatureBadge {
  title: string;
  subtitle: string;
  toastMessage: string;
}

export interface StarPlayerSummary {
  number: string;
  pos: string;
  name: string;
  team: string;
  stat1: string;
  stat2: string;
  stat3: string;
  image?: string;
}

export interface ProToolItem {
  id: string;
  name: string;
  badge: 'ACTIVO' | 'PRÓXIMAMENTE';
  description: string;
  iconType: 'bot' | 'panel' | 'trending' | 'calendar' | 'scout' | 'search' | 'video' | 'crown';
  modalTitle: string;
  modalCategory: string;
  statsPreview: { label: string; value: string; detail: string }[];
  actionPrompt: string;
}

export interface HomePageContent {
  header: {
    brandName: string;
    brandSubtitle: string;
    navLinks: NavLink[];
    ctaButton: string;
    signInButton: string;
  };
  hero: {
    headline: {
      line1: string;
      line2: string;
      line3: string;
    };
    tagline: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    features: [FeatureBadge, FeatureBadge, FeatureBadge, FeatureBadge];
  };
  panel1Comparison: {
    badge: string;
    title: string;
    matchup: string;
    description: string;
    player1Name: string;
    player2Name: string;
    vsBadge: string;
    buttonText: string;
    toastMessage: string;
  };
  panel2TopPlayers: {
    badge: string;
    viewAllText: string;
    players: StarPlayerSummary[];
  };
  panel3Collection: {
    badge: string;
    exportButton: string;
    exportToast: string;
    counters: {
      games: { value: string; label: string };
      players: { value: string; label: string };
      teams: { value: string; label: string };
    };
    recentSearchesTitle: string;
    recentSearches: { query: string; time: string; toast: string }[];
  };
  tutorials: {
    headline: {
      line1: string;
      line2: string;
    };
    subtitle: {
      line1: string;
      line2: string;
    };
    description: string;
    badges: {
      videos: { line1: string; line2: string; toast: string };
      levels: { line1: string; line2: string; toast: string };
      practical: { line1: string; line2: string; toast: string };
    };
    imageAlt: string;
    imageSrc: string;
  };
  proTools: {
    banner: {
      headline: string;
      badge: string;
    };
    sectionHeader: {
      title: string;
      subtitle: string;
    };
    tools: ProToolItem[];
  };
  modals: {
    checklist: {
      title: string;
      closeButton: string;
    };
    joinPlatform: {
      title: string;
      subtitle: string;
      bulletPoints: string[];
      launchButton: string;
      welcomeToast: string;
    };
  };
  howItWorks: {
    banner: {
      headline1: string;
      headline2: string;
      columns: {
        title: string;
        description: string;
      }[];
    };
    sectionHeader: {
      title: string;
      subtitle: string;
    };
    steps: {
      number: string;
      title: string;
      description: string;
      options?: string[];
    }[];
  };
  footer: {
    brandName: string;
    brandSubtitle: string;
    navLinks: { label: string; href?: string }[];
    copyright: string;
  };
}

export const homeContent: HomePageContent = {
  // --------------------------------------------------------------------------
  // 1. ENCABEZADO / NAVBAR
  // --------------------------------------------------------------------------
  header: {
    brandName: "BASKETDATA",
    brandSubtitle: "ANALYTICS",
    navLinks: [
      { label: "COMO FUNCIONA", href: "#how-it-works" },
      { label: "HERRAMIENTAS PRO", href: "#features" },
      { label: "JUGADORES", href: "#pricing" },
      { label: "EQUIPOS", href: "#blog" },
      { label: "PRECIOS", href: "#store" },
      { label: "CONTACTO", href: "#pro-tools" },
    ],
    ctaButton: "COMENZAR",
    signInButton: "ENTRAR",
  },

  // --------------------------------------------------------------------------
  // 2. SECCIÓN PRINCIPAL (HERO)
  // --------------------------------------------------------------------------
  hero: {
    headline: {
      line1: "DATOS",
      line2: "OFICIALES",
      line3: "FEB 26/27",
    },
    tagline: "LA PLATAFORMA DE ANÁLISIS MÁS COMPLETA",
    description:
      "Transforma números en ventajas tácticas. Estadísticas avanzadas, telemetría y modelos predictivos para entrenadores, analistas y amantes del baloncesto.",
    primaryButton: "EXPLORAR HERRAMIENTAS PRO",
    secondaryButton: "VER EJEMPLOS INFORMES",
    features: [
      {
        title: "HISTÓRICOS",
        subtitle: "10+ AÑOS",
        toastMessage: "Base de datos con más de 10 años de estadísticas históricas",
      },
      {
        title: "ACTUALIZACIÓN",
        subtitle: "DIARIA",
        toastMessage: "Datos sincronizados y actualizados diariamente tras cada jornada",
      },
      {
        title: "MÉTRICAS",
        subtitle: "AVANZADAS",
        toastMessage: "PER, True Shooting %, USG %, BPM y métricas predictivas",
      },
      {
        title: "EXPORTACIÓN",
        subtitle: "COMPLETA",
        toastMessage: "Exporta tablas y gráficos a PDF, CSV e informes ejecutivos",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. PANEL INFERIOR 1: COMPARATIVA DESTACADA (DONČIĆ VS JOKIĆ)
  // --------------------------------------------------------------------------
  panel1Comparison: {
    badge: "ANÁLISIS COMPARATIVO",
    title: "COMPARATIVA DESTACADA",
    matchup: "CARLOS VS LORENZO",
    description: "Rendimiento ofensivo, ratio de asistencias y valor predictivo por posesión.",
    player1Name: "CARLOS",
    player2Name: "LORENZO",
    vsBadge: "VS",
    buttonText: "VER COMPARATIVA COMPLETA",
    toastMessage: "Cargando comparativa avanzada: Luka Dončić vs Nikola Jokić",
  },

  // --------------------------------------------------------------------------
  // 4. PANEL INFERIOR 2: JUGADORES DESTACADOS
  // --------------------------------------------------------------------------
  panel2TopPlayers: {
    badge: "DESTACADOS",
    viewAllText: "VER TODOS (8)",
    players: [
      {
        number: "#77",
        pos: "G-F",
        name: "Luka Dončić",
        team: "DAL • 2023-24",
        stat1: "33.9 PPG",
        stat2: "9.2 RPG",
        stat3: "9.8 APG",
        image: "/jugador_1.png",
      },
      {
        number: "#15",
        pos: "C",
        name: "Nikola Jokić",
        team: "DEN • 2023-24",
        stat1: "26.4 PPG",
        stat2: "12.4 RPG",
        stat3: "9.0 APG",
        image: "/jugador_2.png",
      },
      {
        number: "#34",
        pos: "F",
        name: "Giannis Antetokounmpo",
        team: "MIL • 2023-24",
        stat1: "30.4 PPG",
        stat2: "11.5 RPG",
        stat3: "6.5 APG",
        image: "/jugador_3.png",
      },
      {
        number: "#2",
        pos: "G",
        name: "Shai Gilgeous-Alexander",
        team: "OKC • 2023-24",
        stat1: "30.1 PPG",
        stat2: "5.5 RPG",
        stat3: "6.2 APG",
        image: "/jugador_4.png",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. PANEL INFERIOR 3: COLECCIÓN & BUSCADOR
  // --------------------------------------------------------------------------
  panel3Collection: {
    badge: "COLECCIÓN",
    exportButton: "EXPORTAR",
    exportToast: "Exportando dataset completo (CSV / JSON)...",
    counters: {
      games: { value: "1,230", label: "PARTIDOS ANALIZADOS" },
      players: { value: "450+", label: "JUGADORES ACTIVOS" },
      teams: { value: "30", label: "FRANQUICIAS NBA" },
    },
    recentSearchesTitle: "BÚSQUEDAS RECIENTES",
    recentSearches: [
      { query: "Luka Dončić vs Jokić (2024)", time: "hace 2 min", toast: "Cargando búsqueda: Dončić vs Jokić" },
      { query: "Top 3-Point Shooters post-AllStar", time: "hace 18 min", toast: "Filtrando: Top tiradores 3P" },
      { query: "Celtics Offensive Rating con Tatum", time: "hace 1 h", toast: "Abriendo telemetría Celtics" },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. TUTORIALES PASO A PASO (NUEVA SECCIÓN)
  // --------------------------------------------------------------------------
  tutorials: {
    headline: {
      line1: "TUTORIALES",
      line2: "PASO A PASO.",
    },
    subtitle: {
      line1: "APRENDE A SACAR EL MÁXIMO",
      line2: "PARTIDO A LA PLATAFORMA.",
    },
    description:
      "Hemos creado una serie de tutoriales en vídeo para que puedas aprender, desde cero, a utilizar todas las herramientas de HoopData Analytics. Sin complicaciones, a tu ritmo y con ejemplos reales.",
    badges: {
      videos: {
        line1: "VÍDEOS",
        line2: "PASO A PASO",
        toast: "Tutoriales en vídeo paso a paso: Disponibles con tu suscripción",
      },
      levels: {
        line1: "DESDE CERO",
        line2: "HASTA AVANZADO",
        toast: "Nivel inicial hasta avanzado para scouts y técnicos",
      },
      practical: {
        line1: "ENFOCADOS",
        line2: "EN LA PRÁCTICA",
        toast: "Enfocados 100% en la práctica y situaciones reales",
      },
    },
    imageAlt: "Tutoriales Reales - Entrenadora BasketData",
    imageSrc: "/assets/images/chica.png",
  },

  // --------------------------------------------------------------------------
  // 7. HERRAMIENTAS PRO & PIZARRA TÉCNICA
  // --------------------------------------------------------------------------
  proTools: {
    banner: {
      headline: "DATOS OFICIALES DE LA FEB  TEMP. 26/27",
      badge: "GANA VENTAJA EN CADA PARTIDO",
    },
    sectionHeader: {
      title: "HERRAMIENTAS PRO",
      subtitle:
        "Lleva tu análisis al siguiente nivel. Herramientas especializadas para entrenadores, analistas y jugadores que buscan más que estadísticas.",
    },
    tools: [
      {
        id: "asistente-auto",
        name: "ASISTENTE AUTOMÁTICO",
        badge: "ACTIVO",
        description: "Configura una vez y recibe alertas e informes sin hacer nada más.",
        iconType: "bot",
        modalTitle: "ASISTENTE AUTOMÁTICO DE SCOUTING & ALERTAS",
        modalCategory: "AUTOMATIZACIÓN & ALERTAS EN TIEMPO REAL",
        statsPreview: [
          { label: "Informes Enviados", value: "1,420+", detail: "Entregados tras cada partido" },
          { label: "Tiempo de Ahorro", value: "4.5 hrs/sem", detail: "Por analista principal" },
          { label: "Precisión Disparador", value: "99.4%", detail: "Filtros de telemetría" },
        ],
        actionPrompt: "CONFIGURAR REGLAS DE ALERTA",
      },
      {
        id: "panel-analisis",
        name: "PANEL DE ANÁLISIS PRO",
        badge: "ACTIVO",
        description: "Rendimiento, predicciones IA y alertas de fatiga en un solo panel.",
        iconType: "panel",
        modalTitle: "PANEL DE ANÁLISIS PRO CON TELEMETRÍA",
        modalCategory: "MÉTRICAS AVANZADAS & PREDICTIVAS",
        statsPreview: [
          { label: "Offensive Rating", value: "119.8", detail: "Top 5% en la liga" },
          { label: "Predictive Win%", value: "78.4%", detail: "Modelo probabilístico IA" },
          { label: "Índice de Fatiga", value: "18.2%", detail: "Nivel óptimo de recuperación" },
        ],
        actionPrompt: "ABRIR TELEMETRÍA EN DIRECTO",
      },
      {
        id: "tendencias-tiempo-real",
        name: "TENDENCIAS EN TIEMPO REAL",
        badge: "ACTIVO",
        description: "Rachas, cambios tácticos y rendimiento en vivo cuarto a cuarto.",
        iconType: "trending",
        modalTitle: "DETECTOR DE TENDENCIAS EN VIVO",
        modalCategory: "DINÁMICAS CUARTO A CUARTO",
        statsPreview: [
          { label: "Puntos en Transición", value: "+14.2", detail: "Últimos 3 encuentros" },
          { label: "Defensive Net", value: "+8.9", detail: "Con cuadro titular" },
          { label: "Racha de Tiro", value: "54.2%", detail: "En tiros tras pase" },
        ],
        actionPrompt: "INICIAR RADAR DE TENDENCIAS",
      },
      {
        id: "planificador-temporada",
        name: "PLANIFICADOR DE TEMPORADA",
        badge: "ACTIVO",
        description: "Simulador de rotaciones, carga de minutos y análisis de rivales futuros.",
        iconType: "calendar",
        modalTitle: "PLANIFICADOR TÁCTICO & ROTACIONES",
        modalCategory: "GESTIÓN DE MINUTOS Y FATIGA",
        statsPreview: [
          { label: "Partidos Restantes", value: "24", detail: "14 en casa / 10 fuera" },
          { label: "Dificultad Calendario", value: "0.534", detail: "Top 10 SOS en conferencia" },
          { label: "Carga Proyectada", value: "32.1 min", detail: "Minutos jugador franquicia" },
        ],
        actionPrompt: "SIMULAR PRÓXIMO ENCUENTRO",
      },
      {
        id: "scouting-rivales",
        name: "SCOUTING DE RIVALES",
        badge: "ACTIVO",
        description: "Genera informes completos de rivales en segundos: debilidades y mapas de tiro.",
        iconType: "scout",
        modalTitle: "GENERADOR DE DOSSIER DE SCOUTING",
        modalCategory: "INTELIGENCIA COMPETITIVA",
        statsPreview: [
          { label: "Tendencia Defensiva", value: "Drop Pick&Roll", detail: "Vulnerable en esquinas" },
          { label: "Zona de Tiro Clave", value: "Pintura 68%", detail: "Alta efectividad rim" },
          { label: "Puntos en Pérdidas", value: "18.4 ppp", detail: "Oportunidad de contraataque" },
        ],
        actionPrompt: "DESCARGAR DOSSIER TÁCTICO",
      },
      {
        id: "buscador-jugadores",
        name: "BUSCADOR DE JUGADORES",
        badge: "ACTIVO",
        description: "Filtra por métricas avanzadas, compara perfiles y encuentra jugadores similares.",
        iconType: "search",
        modalTitle: "RADAR Y BUSCADOR DE PERFILES",
        modalCategory: "FILTRADO AVANZADO & COMPARADOR",
        statsPreview: [
          { label: "Perfiles Similares", value: "4 Coincidencias", detail: "Índice de similitud > 92%" },
          { label: "Rango Salarial", value: "$4M - $12M", detail: "Eficiencia valor / producción" },
          { label: "Métrica Estrella", value: "62.4% TS", detail: "Top tier tirador abierto" },
        ],
        actionPrompt: "LANZAR COMPARADOR DE TALENTO",
      },
      {
        id: "video-analisis",
        name: "VÍDEO ANÁLISIS VINCULADO",
        badge: "PRÓXIMAMENTE",
        description: "Haz clic en cualquier estadística para ver el clip exacto de esa jugada.",
        iconType: "video",
        modalTitle: "VÍDEO ANÁLISIS VINCULADO (BETA)",
        modalCategory: "INTEGRACIÓN CLIP A DATO",
        statsPreview: [
          { label: "Clips Indexados", value: "125,000+", detail: "Temporada regular en HD" },
          { label: "Latencia de Búsqueda", value: "< 1.2s", detail: "Por tiro o posesión" },
          { label: "Exportación de Clips", value: "MP4 / GIF", detail: "Con telemetría integrada" },
        ],
        actionPrompt: "NOTIFICARME EN EL LANZAMIENTO",
      },
      {
        id: "informes-personalizados",
        name: "INFORMES PERSONALIZADOS",
        badge: "ACTIVO",
        description: "Crea tus propias plantillas con tu logo y los datos que realmente te interesan.",
        iconType: "crown",
        modalTitle: "CREADOR DE INFORMES CORPORATIVOS",
        modalCategory: "PERSONALIZACIÓN & EXPORTACIÓN",
        statsPreview: [
          { label: "Plantillas Listas", value: "12 Modelos", detail: "Post-partido y pre-partido" },
          { label: "Personalización", value: "Logo & Colores", detail: "Branding de tu club" },
          { label: "Formato Entrega", value: "PDF & Web interactiva", detail: "Listo para compartir" },
        ],
        actionPrompt: "CREAR NUEVA PLANTILLA",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 8. MODALES
  // --------------------------------------------------------------------------
  modals: {
    checklist: {
      title: "CHECKLIST OFICIAL • SERIE COMPLETA",
      closeButton: "CERRAR",
    },
    joinPlatform: {
      title: "JOIN BASKETDATA PLATFORM",
      subtitle: "Desbloquea el análisis profesional de baloncesto con datos en tiempo real.",
      bulletPoints: [
        "✓ Acceso ilimitado a telemetría y comparativas avanzadas",
        "✓ Métricas avanzadas (PER, TS%, USG%, BPM, VORP)",
        "✓ Base de datos completa Temporada 2023-24 e históricas",
        "✓ Exportación de informes a PDF, CSV y JSON",
      ],
      launchButton: "ACCEDER A LA PLATAFORMA",
      welcomeToast: "¡Bienvenido a BASKETDATA Analytics!",
    },
  },

  // --------------------------------------------------------------------------
  // 9. SECCIÓN ASISTENTE & ¿CÓMO FUNCIONA?
  // --------------------------------------------------------------------------
  howItWorks: {
    banner: {
      headline1: "TU ASISTENTE,",
      headline2: "SIEMPRE VIGILANDO.",
      columns: [
        {
          title: "MONITOREA",
          description: "Datos, partidos y rendimiento en tiempo real.",
        },
        {
          title: "DETECTA",
          description: "Patrones, cambios y anomalías.",
        },
        {
          title: "AVISA",
          description: "Alertas útiles, cuando las necesitas.",
        },
      ],
    },
    sectionHeader: {
      title: "¿CÓMO FUNCIONA?",
      subtitle:
        "En 3 simples pasos, tu asistente se encarga de todo el proceso. Tú solo recibes los avisos.",
    },
    steps: [
      {
        number: "01",
        title: "CONFIGURA TUS ALERTAS",
        description:
          "Elige qué quieres monitorear (jugadores, equipos, estadísticas) y define tus preferencias.",
        options: ["Rendimiento", "Lesiones", "Tendencias", "Oportunidades"],
      },
      {
        number: "02",
        title: "EL ASISTENTE ANALIZA",
        description:
          "Procesa miles de datos, detecta patrones y encuentra lo que realmente importa.",
      },
      {
        number: "03",
        title: "RECIBE EL AVISO",
        description:
          "Te enviamos alertas claras y accionables por email y en tu panel.",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 10. PIE DE PÁGINA (FOOTER)
  // --------------------------------------------------------------------------
  footer: {
    brandName: "BASKETDATA",
    brandSubtitle: "ANALYTICS",
    navLinks: [
      { label: "HOW IT WORKS", href: "#how-it-works" },
      { label: "FEATURES", href: "#features" },
      { label: "PRICING", href: "#pricing" },
      { label: "BLOG", href: "#blog" },
      { label: "STORE", href: "#store" },
    ],
    copyright: "© 2024 HoopData Analytics. All rights reserved.",
  },
};
