import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock,
  DollarSign,
  Sun,
  CloudRain,
  CloudSun,
  Car,
  Home,
  Mic,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Footprints,
  ExternalLink,
  Check,
  Info,
  Lock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const PROFILES = [
  { id: "cindy", name: "Cindy", type: "adult", initial: "C" },
  { id: "aracely", name: "Aracely", type: "adult", initial: "A" },
  { id: "diego", name: "Diego", type: "adult", initial: "D" },
  { id: "aria", name: "Aria", type: "kid", initial: "★" },
];

const ADULT_IDS = PROFILES.filter((p) => p.type === "adult").map((p) => p.id);

// Real forecast for the Durham / Asheboro area this weekend.
const WEATHER = {
  sat: { high: 93, low: 71, rain: 35, note: "Caluroso, con chance de tormenta por la tarde" },
  sun: { high: 80, low: 66, rain: 15, note: "Templado y agradable — buen día para el zoológico" },
};

const img = (seed) => `https://picsum.photos/seed/${seed}/640/420`;

const ZOO_LINK = "https://www.nczoo.org";
const ZOO_TICKETS_LINK = "https://tickets.nczoo.org/Info.aspx?EventID=10";

const ZOO_OPTIONS = [
  {
    id: "zoo-classic",
    title: "Recorrido clásico a pie",
    kidTitle: "Caminar y ver animales 🚶‍♀️🦒",
    desc: "Recorrido libre por las zonas de África y Norteamérica, con más de 5 millas de senderos y 1,800 animales.",
    kidDesc: "Caminamos y vemos elefantes, leones, osos y muchos animales más.",
    cost: "Incluido en la entrada",
    duration: "3 h aprox.",
    intensity: "moderate",
    image: img("zoo-walk"),
    link: `${ZOO_LINK}/experiences/attractions`,
  },
  {
    id: "zoo-zoofari",
    title: "Zoofari — tour en vehículo safari",
    kidTitle: "Paseo en camioneta safari 🚙",
    desc: "Recorrido guiado en un vehículo abierto por las 40 acres de Watani Grasslands: rinocerontes, jirafas, kudús y más.",
    kidDesc: "Nos subimos a una camioneta abierta y vemos animales bien de cerca, sin caminar.",
    cost: "+$25 por persona",
    duration: "45 – 60 min",
    intensity: "relaxed",
    image: img("zoo-zoofari"),
    link: "https://nczoo.org/experiences/attractions/zoofari",
  },
  {
    id: "zoo-airhike",
    title: "Air Hike — curso de cuerdas",
    kidTitle: "¡Aventura entre los árboles! 🌳",
    desc: "Curso de cuerdas elevado entre los árboles con 23 obstáculos, arnés y guía incluido.",
    kidDesc: "Un camino de cuerdas arriba entre los árboles, con casco y arnés de seguridad.",
    cost: "+$18 por persona",
    duration: "30 – 60 min",
    intensity: "heavy",
    image: img("zoo-airhike"),
    link: "https://nczoo.org/experiences/attractions/air-hike-ropes-course",
  },
  {
    id: "zoo-butterfly",
    title: "Jardín de mariposas + Kidzone",
    kidTitle: "Mariposas y área de juegos 🦋",
    desc: "Paseo tranquilo por el jardín de mariposas y la zona Kidzone, con juegos de agua y área de arena.",
    kidDesc: "Un jardín lleno de mariposas y una zona para jugar con agüita y arena.",
    cost: "Incluido en la entrada",
    duration: "45 min",
    intensity: "relaxed",
    image: img("zoo-butterfly"),
    link: `${ZOO_LINK}/experiences/attractions`,
  },
];

const SLOTS = {
  sat: [
    {
      id: "sat-morning",
      time: "9:00 AM",
      title: "Mañana",
      kidTitle: "¡A empezar el día! ☀️",
      intro: "La mañana es la parte más fresca del día antes del calor y la posible tormenta de la tarde — buen momento para lo más activo.",
      kidIntro: "Empezamos el día bien tempranito, cuando todavía no hace tanto calor.",
      votable: true,
      options: [
        {
          id: "sat-jordan-lake",
          title: "Kayak y playa en Jordan Lake",
          kidTitle: "¡Aventura en el lago! 🚣",
          desc: "Renta de kayaks y zona de playa en Jordan Lake State Recreation Area, a unos 30 min de Durham.",
          kidDesc: "Remamos en kayak y jugamos en la arena junto al lago. ¡Lleva traje de baño!",
          cost: "$$ · ~$25–40 por persona (renta de kayak)",
          duration: "2.5 – 3 h",
          intensity: "heavy",
          image: img("jordan-lake"),
          link: "https://www.google.com/maps/search/Jordan+Lake+State+Recreation+Area+Beach",
        },
        {
          id: "sat-eno-river",
          title: "Caminata en Eno River State Park",
          kidTitle: "Caminata junto al río 🌲",
          desc: "Senderos junto al río Eno, con puentes colgantes y zonas de piedra poco profundas para meter los pies.",
          kidDesc: "Caminamos junto a un río bonito y podemos meter los pies en el agua.",
          cost: "Gratis",
          duration: "1.5 – 2 h",
          intensity: "moderate",
          image: img("eno-river"),
          link: "https://www.ncparks.gov/state-parks/eno-river-state-park",
        },
        {
          id: "sat-museum",
          title: "Museum of Life and Science",
          kidTitle: "Museo de dinosaurios 🦕",
          desc: "Buen plan techado por si llega la tormenta de la tarde: dinosaurios, mariposario y ciencia interactiva.",
          kidDesc: "¡Museo con dinosaurios de verdad, mariposas y cosas para tocar y jugar!",
          cost: "$$ · ~$18–24 por persona",
          duration: "2 – 2.5 h",
          intensity: "moderate",
          image: img("museum"),
          link: "https://www.google.com/maps/search/Museum+of+Life+and+Science+Durham+NC",
        },
        {
          id: "sat-bowling",
          title: "Boliche en familia",
          kidTitle: "¡A tirar bolos! 🎳",
          desc: "Opción techada y tranquila, ideal si prefieren empezar el día con calma.",
          kidDesc: "Jugamos a tirar los bolos todos juntos, bajo techo.",
          cost: "$ · ~$15 por persona",
          duration: "1.5 h",
          intensity: "relaxed",
          image: img("bowling"),
          link: "https://www.google.com/maps/search/bowling+alley+Durham+NC",
        },
      ],
    },
    {
      id: "sat-lunch",
      time: "12:30 PM",
      title: "Almuerzo",
      kidTitle: "¡Hora de comer! 🌮",
      intro: "Parada relajada para descansar antes de la actividad de la tarde.",
      kidIntro: "Comemos algo rico y descansamos las piernitas.",
      votable: true,
      options: [
        {
          id: "sat-foodtrucks",
          title: "Food trucks en Durham Central Park",
          kidTitle: "Camioncitos de comida 🚚",
          desc: "Variedad de food trucks en el corazón de Durham — cada quien elige lo que se le antoje.",
          kidDesc: "Camiones con comida rica, cada quien pide lo que quiera.",
          cost: "$ · ~$12–15 por persona",
          duration: "1 h",
          intensity: "relaxed",
          image: img("foodtrucks"),
          link: "https://www.google.com/maps/search/Durham+Central+Park+food+trucks",
        },
        {
          id: "sat-pizza",
          title: "Pizzería local en el centro",
          kidTitle: "¡Pizza! 🍕",
          desc: "Pizzería clásica del centro de Durham, buena opción segura para todos.",
          kidDesc: "Pizza rica para todos.",
          cost: "$ · ~$12–16 por persona",
          duration: "1 h",
          intensity: "relaxed",
          image: img("pizza"),
          link: "https://www.google.com/maps/search/pizza+downtown+Durham+NC",
        },
        {
          id: "sat-bbq",
          title: "BBQ estilo Carolina del Norte",
          kidTitle: "Costillitas BBQ 🍖",
          desc: "Barbacoa tradicional de Carolina del Norte, con guarniciones clásicas sureñas.",
          kidDesc: "Carnita ahumada bien rica con papitas.",
          cost: "$$ · ~$15–20 por persona",
          duration: "1 h",
          intensity: "relaxed",
          image: img("bbq"),
          link: "https://www.google.com/maps/search/NC+BBQ+restaurant+Durham+NC",
        },
      ],
    },
    {
      id: "sat-afternoon",
      time: "3:00 PM",
      title: "Tarde",
      kidTitle: "¡Tarde de paseo! 🌸",
      intro: "Ritmo suave para la tarde, sobre todo si la mañana fue una actividad pesada.",
      kidIntro: "Un paseo tranquilo para la tarde.",
      votable: true,
      options: [
        {
          id: "sat-duke-gardens",
          title: "Sarah P. Duke Gardens",
          kidTitle: "Jardín de flores 🌷",
          desc: "Paseo tranquilo entre flores, terrazas y un estanque con peces. Entrada gratuita.",
          kidDesc: "Caminata bonita entre flores de muchos colores.",
          cost: "Gratis",
          duration: "1.5 h",
          intensity: "relaxed",
          image: img("duke-gardens"),
          link: "https://www.google.com/maps/search/Sarah+P+Duke+Gardens+Durham+NC",
        },
        {
          id: "sat-farmers-market",
          title: "Durham Farmers Market",
          kidTitle: "Mercado de frutas 🍓",
          desc: "Mercado local con productores de la zona, música en vivo y puestos de comida.",
          kidDesc: "Un mercado con frutas, flores y a veces música.",
          cost: "Gratis (compras opcionales)",
          duration: "1 h",
          intensity: "relaxed",
          image: img("farmers-market"),
          link: "https://www.google.com/maps/search/Durham+Farmers+Market",
        },
        {
          id: "sat-minigolf",
          title: "Mini golf en familia",
          kidTitle: "¡Mini golf! ⛳",
          desc: "Actividad ligera y divertida para todas las edades, buena opción de ritmo medio.",
          kidDesc: "Jugamos mini golf todos juntos.",
          cost: "$ · ~$10–14 por persona",
          duration: "1 h",
          intensity: "moderate",
          image: img("minigolf"),
          link: "https://www.google.com/maps/search/mini+golf+Durham+NC",
        },
      ],
    },
    {
      id: "sat-evening",
      time: "7:00 PM",
      title: "Noche en casa de Cindy",
      kidTitle: "¡Noche en casa! 🌙",
      intro: "Cierre tranquilo del día en casa de Cindy, donde se quedan a dormir esta noche.",
      kidIntro: "Nos vamos a dormir a casa de Cindy esta noche.",
      votable: true,
      options: [
        {
          id: "sat-movie",
          title: "Noche de películas",
          kidTitle: "¡Pelis y palomitas! 🍿",
          desc: "Pijamas, cobijas y una película elegida entre todos.",
          kidDesc: "Pijama puesta, cobija calientita y una peli que elijamos todos.",
          cost: "Gratis (o ~$5 de snacks)",
          duration: "2 h",
          intensity: "relaxed",
          image: img("movie-night"),
        },
        {
          id: "sat-boardgames",
          title: "Juegos de mesa",
          kidTitle: "¡Juegos de mesa! 🎲",
          desc: "Noche de juegos de mesa aptos para todas las edades.",
          kidDesc: "Jugamos juegos de mesa todos juntos.",
          cost: "Gratis",
          duration: "1.5 h",
          intensity: "relaxed",
          image: img("boardgames"),
        },
        {
          id: "sat-bonfire",
          title: "Fogata y s'mores",
          kidTitle: "¡Fogata con bombones! 🔥",
          desc: "Si no llueve, una pequeña fogata en el patio con s'mores — depende del clima de la noche.",
          kidDesc: "Hacemos una fogata afuera y asamos bombones (si no llueve).",
          cost: "$ · ~$8 en ingredientes",
          duration: "1.5 h",
          intensity: "relaxed",
          image: img("bonfire"),
        },
      ],
    },
  ],
  sun: [
    {
      id: "sun-zoo",
      time: "9:00 AM",
      title: "NC Zoo — Asheboro",
      kidTitle: "¡El zoológico! 🦁🐘",
      intro:
        "Plan confirmado del domingo: el NC Zoo está casi a medio camino entre Durham y Concord (~1 hora desde cada lado). La entrada general (adulto $18 / niño $14 / senior $16) se compra por separado. Elijan cómo quieren vivirlo:",
      kidIntro: "¡Hoy sí o sí vamos al zoológico! Está como a una horita en carro.",
      infoLink: ZOO_TICKETS_LINK,
      infoLinkLabel: "Ver precios y horario de entrada",
      fixed: true,
      votable: true,
      options: ZOO_OPTIONS,
    },
    {
      id: "sun-lunch",
      time: "1:30 PM",
      title: "Almuerzo cerca del zoo",
      kidTitle: "¡Hora de comer! 🍽️",
      intro: "Parada de almuerzo en Asheboro después de la caminata del zoológico.",
      kidIntro: "Comemos algo rico después de ver tantos animales.",
      votable: true,
      options: [
        {
          id: "lunch-steaks",
          title: "Something Different Steaks & Kabobs",
          kidTitle: "Brochetas de carne 🍢",
          desc: "Cocina mediterránea-griega con kabobs, ensaladas frescas y platos a la parrilla.",
          kidDesc: "Brochetas de carne y ensaladas ricas.",
          cost: "$$ · ~$14–20 por persona",
          duration: "1 h",
          intensity: "relaxed",
          image: img("lunch-kabobs"),
          link: "https://www.google.com/maps/search/Something+Different+Steaks+%26+Kabobs+Asheboro+NC",
        },
        {
          id: "lunch-magnolia",
          title: "Magnolia 23",
          kidTitle: "Pollo frito sureño 🍗",
          desc: "Comida sureña casera: pollo y albóndigas, pollo frito, pastel de manzana frito de postre.",
          kidDesc: "Pollo fríto delicioso y pastelito de manzana de postre.",
          cost: "$$ · ~$12–18 por persona",
          duration: "1 h",
          intensity: "relaxed",
          image: img("lunch-magnolia"),
          link: "https://www.google.com/maps/search/Magnolia+23+Asheboro+NC",
        },
        {
          id: "lunch-taco",
          title: "The Taco Loco",
          kidTitle: "Tacos mexicanos 🌮",
          desc: "Restaurante mexicano del centro de Asheboro: tacos, enchiladas, nachos y quesabirria.",
          kidDesc: "Tacos y quesadillas ricas.",
          cost: "$ · ~$10–14 por persona",
          duration: "1 h",
          intensity: "relaxed",
          image: img("lunch-taco"),
          link: "https://www.google.com/maps/search/The+Taco+Loco+Asheboro+NC",
        },
        {
          id: "lunch-nanny",
          title: "Nanny Mae's Cafe",
          kidTitle: "Cafecito y pastelitos 🥐",
          desc: "Cafetería con sándwiches ligeros, pretzels, macarons y pasteles horneados cada mañana.",
          kidDesc: "Sándwiches y pastelitos dulces.",
          cost: "$ · ~$8–12 por persona",
          duration: "45 min",
          intensity: "relaxed",
          image: img("lunch-nanny"),
          link: "https://www.google.com/maps/search/Nanny+Mae%27s+Cafe+Asheboro+NC",
        },
      ],
    },
    {
      id: "sun-before-home",
      time: "3:00 PM",
      title: "Antes de volver a casa (opcional)",
      kidTitle: "Un ratito más antes de irnos",
      intro: "Después de un día pesado en el zoo, algo corto y relajado antes de manejar de regreso — o pueden saltarse este paso e irse directo a casa.",
      kidIntro: "Un ratito tranquilo antes de irnos a casa, si todos quieren.",
      votable: true,
      options: [
        {
          id: "sun-citylake",
          title: "Asheboro City Lake Park",
          kidTitle: "Lago con lanchitas 🚣‍♀️",
          desc: "Parque tranquilo junto al lago, con paseo en botes de pedal y zona de juegos infantiles.",
          kidDesc: "Un lago con lanchitas y juegos para niños.",
          cost: "$ · renta de botes ~$8",
          duration: "45 min – 1 h",
          intensity: "relaxed",
          image: img("city-lake"),
          link: "https://www.google.com/maps/search/Asheboro+City+Lake+Park",
        },
        {
          id: "sun-petty",
          title: "Richard Petty Museum",
          kidTitle: "Museo de carros de carreras 🏎️",
          desc: "Museo sobre la familia Petty y las carreras NASCAR, en Randleman, cerca de Asheboro.",
          kidDesc: "Carros de carreras muy rápidos para ver de cerca.",
          cost: "$ · ~$8 por persona",
          duration: "45 min",
          intensity: "relaxed",
          image: img("petty-museum"),
          link: "https://www.google.com/maps/search/Richard+Petty+Museum+Randleman+NC",
        },
        {
          id: "sun-direct-home",
          title: "Ir directo a casa",
          kidTitle: "Irnos directo a casa 🚗",
          desc: "Sin paradas extra — manejar directo de regreso después del almuerzo.",
          kidDesc: "Nos subimos al carro y nos vamos derechito a casa.",
          cost: "—",
          duration: "—",
          intensity: "relaxed",
          image: img("drive-home"),
        },
      ],
    },
  ],
};

const DAYS = [
  { id: "sat", label: "Sábado" },
  { id: "sun", label: "Domingo" },
];

const INTENSITY_META = {
  heavy: { label: "Actividad fuerte", color: "var(--clay)" },
  moderate: { label: "Ritmo medio", color: "var(--mustard)" },
  relaxed: { label: "Relajado", color: "var(--sky)" },
};

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

function WeatherIcon({ rain, size = 18 }) {
  if (rain >= 30) return <CloudRain size={size} />;
  if (rain >= 15) return <CloudSun size={size} />;
  return <Sun size={size} />;
}

function WeatherStrip({ day, kid }) {
  const w = WEATHER[day];
  return (
    <div className={`weather-strip ${kid ? "weather-strip-kid" : ""}`}>
      <WeatherIcon rain={w.rain} size={kid ? 26 : 20} />
      <div className="weather-strip-text">
        <span className="weather-strip-temps">{w.high}° / {w.low}°F</span>
        <span className="weather-strip-note">{kid ? (w.rain >= 30 ? "Puede llover un poco 🌧️" : "¡Buen día para jugar afuera! ☀️") : `${w.note} · ${w.rain}% de lluvia`}</span>
      </div>
    </div>
  );
}

function ProfileBar({ current, onPick }) {
  return (
    <div className="profile-bar">
      {PROFILES.map((p) => (
        <button
          key={p.id}
          onClick={() => onPick(p.id)}
          className={`profile-chip ${current === p.id ? "profile-chip-active" : ""}`}
          style={p.type === "kid" ? { fontFamily: "var(--font-kid)" } : {}}
        >
          <span className="profile-chip-avatar">{p.initial}</span>
          {p.name}
        </button>
      ))}
    </div>
  );
}

function DayTabs({ day, onChange, kid }) {
  return (
    <div className="day-tabs">
      {DAYS.map((d, i) => (
        <React.Fragment key={d.id}>
          <button onClick={() => onChange(d.id)} className={`day-tab ${day === d.id ? "day-tab-active" : ""} ${kid ? "day-tab-kid" : ""}`}>
            <span className="day-tab-dot">{i + 1}</span>
            {d.label}
          </button>
          {i < DAYS.length - 1 && <span className="day-tab-line" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function OptionCard({ option, slotId, votes, profile, onVote, kid }) {
  const meta = INTENSITY_META[option.intensity];
  const slotVotes = votes[slotId] || {};
  const voteCount = Object.values(slotVotes).filter((v) => v === option.id).length;
  const myPick = slotVotes[profile] === option.id;
  const canVote = ADULT_IDS.includes(profile);

  return (
    <div className={`option-card ${kid ? "option-card-kid" : ""} ${myPick ? "option-card-picked" : ""}`}>
      <div className="option-card-img" style={{ backgroundImage: `url(${option.image})` }}>
        {voteCount > 0 && !kid && (
          <span className="option-vote-badge"><Check size={12} /> {voteCount} voto{voteCount > 1 ? "s" : ""}</span>
        )}
      </div>
      <div className="option-card-body">
        <h4>{kid ? option.kidTitle : option.title}</h4>
        <p>{kid ? option.kidDesc : option.desc}</p>
        {!kid && (
          <div className="option-meta">
            <span><Clock size={13} /> {option.duration}</span>
            <span><DollarSign size={13} /> {option.cost}</span>
            <span style={{ color: meta.color }}><Footprints size={13} /> {meta.label}</span>
          </div>
        )}
        <div className="option-actions">
          {option.link ? (
            <a href={option.link} target="_blank" rel="noopener noreferrer" className="option-link">
              <ExternalLink size={13} /> {kid ? "Ver más" : "Más información"}
            </a>
          ) : <span />}
          {canVote && !kid && (
            <button className={`option-vote-btn ${myPick ? "option-vote-btn-active" : ""}`} onClick={() => onVote(slotId, myPick ? null : option.id)}>
              {myPick ? "✓ Tu voto" : "Votar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SlotSection({ slot, votes, profile, onVote, kid }) {
  return (
    <div className="slot-section">
      <div className="slot-header">
        <span className="slot-time">{slot.time}</span>
        <h2>{kid ? slot.kidTitle : slot.title}</h2>
        {slot.fixed && !kid && <span className="slot-fixed-badge"><Lock size={11} /> Confirmado</span>}
      </div>
      <p className="slot-intro">{kid ? slot.kidIntro : slot.intro}</p>
      {slot.infoLink && !kid && (
        <a href={slot.infoLink} target="_blank" rel="noopener noreferrer" className="slot-info-link">
          <Info size={13} /> {slot.infoLinkLabel}
        </a>
      )}
      <div className="option-grid">
        {slot.options.map((o) => (
          <OptionCard key={o.id} option={o} slotId={slot.id} votes={votes} profile={profile} onVote={onVote} kid={kid} />
        ))}
      </div>
    </div>
  );
}

function DayFooterNote({ day, kid }) {
  if (day === "sat") {
    return (
      <div className={`footer-note ${kid ? "footer-note-kid" : ""}`}>
        <Home size={kid ? 22 : 18} />
        {kid ? <span>Esta noche todos dormimos en casa de Cindy. 🌙</span> : <span>Esta noche se quedan a dormir en casa de Cindy.</span>}
      </div>
    );
  }
  return (
    <div className={`footer-note ${kid ? "footer-note-kid" : ""}`}>
      <Car size={kid ? 22 : 18} />
      {kid ? <span>Después de esto, cada quien regresa manejando a su casa. ¡Hasta la próxima aventura! ✨</span> : <span>Al terminar el domingo, cada quien regresa manejando directo a su casa — no hay más noches fuera.</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ASSISTANT (Lucía the firefly) — sweet female voice                 */
/* ------------------------------------------------------------------ */

function buildItinerarySummary() {
  const lines = [];
  DAYS.forEach((d) => {
    lines.push(`${d.label}:`);
    SLOTS[d.id].forEach((s) => {
      lines.push(`  ${s.time} ${s.title}: ${s.kidIntro}`);
      s.options.forEach((o) => lines.push(`    - opción: ${o.kidTitle} — ${o.kidDesc}`));
    });
  });
  lines.push("El sábado duermen en casa de Cindy. El domingo, después del zoológico y lo que elijan, cada quien regresa manejando a su casa.");
  return lines.join("\n");
}

function pickSweetSpanishVoice(voices) {
  const spanish = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
  const pool = spanish.length ? spanish : voices;
  const preferredNames = ["paulina", "mónica", "monica", "lucia", "lucía", "helena", "sabina", "elena", "female", "mujer"];
  const byName = pool.find((v) => preferredNames.some((n) => v.name.toLowerCase().includes(n)));
  if (byName) return byName;
  const notMale = pool.find((v) => !v.name.toLowerCase().includes("male") && !v.name.toLowerCase().includes("jorge") && !v.name.toLowerCase().includes("diego"));
  return notMale || pool[0] || null;
}

function FireflyAssistant({ dayLabel }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const greeted = useRef(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const voiceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
      if (voices.length) voiceRef.current = pickSweetSpanishVoice(voices);
    };
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = useCallback(
    (text) => {
      if (muted) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "es-US";
        if (voiceRef.current) u.voice = voiceRef.current;
        u.pitch = 1.25;
        u.rate = 0.98;
        window.speechSynthesis.speak(u);
      } catch (e) {
        /* speech synthesis not available */
      }
    },
    [muted]
  );

  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      const greeting = `¡Hola, Aria! Soy Lucía, tu luciérnaga guía. Hoy es ${dayLabel} y nos espera una aventura genial. ¿Quieres que te cuente qué haremos o me preguntas lo que tú quieras?`;
      setMessages([{ role: "assistant", text: greeting }]);
      speak(greeting);
    }
  }, [open, dayLabel, speak]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      const nextMessages = [...messages, { role: "user", text: trimmed }];
      setMessages(nextMessages);
      setInput("");
      setBusy(true);
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            system: `Eres Lucía, una luciérnaga mágica, dulce y alegre que acompaña a Aria, una niña de 6 años, en un fin de semana familiar cerca de Durham y Asheboro, Carolina del Norte. Responde SIEMPRE en español, con oraciones cortas y sencillas para una niña pequeña, con calidez y ternura. Este es el plan real del fin de semana:\n${buildItinerarySummary()}\nSi Aria pregunta algo fuera del plan, responde con imaginación y cariño, y cuando tenga sentido regrésala amablemente al plan. Nunca uses lenguaje que dé miedo ni temas para adultos.`,
            messages: nextMessages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
          }),
        });
        const data = await response.json();
        const textBlock = (data.content || []).find((c) => c.type === "text");
        const reply = textBlock ? textBlock.text : "¡Ups! Se me apagó la lucecita un momento. ¿Puedes repetir eso?";
        setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
        speak(reply);
      } catch (e) {
        setMessages((prev) => [...prev, { role: "assistant", text: "Se me nubló la luz un segundito. ¿Intentamos otra vez?" }]);
      } finally {
        setBusy(false);
      }
    },
    [messages, busy, speak]
  );

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    if (listening) {
      recognitionRef.current && recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = "es-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const heard = e.results[0][0].transcript;
      setInput(heard);
      send(heard);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const hasSpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <>
      <button className="firefly-fab" onClick={() => setOpen(true)} aria-label="Abrir a Lucía, tu guía">
        <span className="firefly-glow" />
        <Sparkles size={26} />
      </button>

      {open && (
        <div className="firefly-panel">
          <div className="firefly-header">
            <div className="firefly-header-title"><Sparkles size={20} /> Lucía, tu luciérnaga guía</div>
            <div className="firefly-header-actions">
              <button onClick={() => setMuted((m) => !m)} aria-label="Silenciar voz">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
              <button onClick={() => setOpen(false)} aria-label="Cerrar"><X size={18} /></button>
            </div>
          </div>
          <div className="firefly-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`firefly-bubble ${m.role === "assistant" ? "firefly-bubble-bot" : "firefly-bubble-user"}`}>{m.text}</div>
            ))}
            {busy && <div className="firefly-bubble firefly-bubble-bot firefly-typing">Lucía está pensando…</div>}
          </div>
          <div className="firefly-input-row">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(input)} placeholder="Pregúntale algo a Lucía…" />
            {hasSpeechRecognition && (
              <button className={`firefly-mic ${listening ? "firefly-mic-active" : ""}`} onClick={toggleListening} aria-label="Hablar"><Mic size={18} /></button>
            )}
            <button className="firefly-send" onClick={() => send(input)} aria-label="Enviar"><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  APP                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [profile, setProfile] = useState(null);
  const [day, setDay] = useState("sat");
  const [votes, setVotes] = useState({});
  const [votesLoaded, setVotesLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await window.storage.get("family-weekend-votes-v2", true);
        if (saved && saved.value) setVotes(JSON.parse(saved.value));
      } catch (e) {
        /* no votes yet */
      } finally {
        setVotesLoaded(true);
      }
    })();
    (async () => {
      try {
        const savedProfile = await window.storage.get("family-weekend-profile", false);
        if (savedProfile && savedProfile.value) setProfile(savedProfile.value);
      } catch (e) {
        /* no saved profile */
      }
    })();
  }, []);

  const pickProfile = async (id) => {
    setProfile(id);
    try {
      if (id === null) await window.storage.delete("family-weekend-profile", false);
      else await window.storage.set("family-weekend-profile", id, false);
    } catch (e) {
      /* best effort */
    }
  };

  const castVote = async (slotId, optionId) => {
    setVotes((prev) => {
      const next = { ...prev, [slotId]: { ...(prev[slotId] || {}) } };
      if (optionId === null) delete next[slotId][profile];
      else next[slotId][profile] = optionId;
      window.storage.set("family-weekend-votes-v2", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  };

  const kid = profile === "aria";
  const dayLabel = DAYS.find((d) => d.id === day)?.label || "";

  return (
    <div className={`app-root ${kid ? "app-root-kid" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Baloo+2:wght@500;700;800&display=swap');

        :root {
          --pine: #2F4B3C;
          --clay: #B5533C;
          --parchment: #F3EEDD;
          --sky: #5C93B4;
          --mustard: #C98F2E;
          --ink: #23281F;
          --font-display: 'Fraunces', serif;
          --font-body: 'Inter', sans-serif;
          --font-kid: 'Baloo 2', cursive;
          --bubblegum: #FBC9DE;
          --lavender: #E4D3F5;
          --butter: #FFEFAE;
          --mint: #C3EFDD;
          --coral: #FFAFA0;
          --plum: #6A3D6E;
        }

        .app-root { font-family: var(--font-body); background: var(--parchment); color: var(--ink); min-height: 100%; padding: 20px 16px 100px; max-width: 780px; margin: 0 auto; }
        .app-root-kid { background: linear-gradient(180deg, var(--bubblegum) 0%, var(--lavender) 45%, var(--butter) 100%); color: var(--plum); }

        .brand-header { text-align: left; margin-bottom: 18px; }
        .brand-header h1 { font-family: var(--font-display); font-size: 27px; font-weight: 700; margin: 0 0 4px; color: var(--pine); }
        .app-root-kid .brand-header h1 { font-family: var(--font-kid); color: var(--plum); }
        .brand-header p { margin: 0; font-size: 14px; opacity: 0.75; }

        .profile-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .profile-chip { display: flex; align-items: center; gap: 6px; border: 1.5px solid var(--pine); background: transparent; color: var(--pine); padding: 7px 12px 7px 7px; border-radius: 999px; font-size: 14px; font-weight: 500; cursor: pointer; }
        .profile-chip-avatar { width: 22px; height: 22px; border-radius: 50%; background: var(--pine); color: var(--parchment); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
        .profile-chip-active { background: var(--pine); color: var(--parchment); }
        .profile-chip-active .profile-chip-avatar { background: var(--parchment); color: var(--pine); }

        .day-tabs { display: flex; align-items: center; margin-bottom: 14px; }
        .day-tab { display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; font-size: 13px; color: var(--ink); opacity: 0.55; font-weight: 500; padding: 4px 2px; }
        .day-tab-dot { width: 26px; height: 26px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .day-tab-active { opacity: 1; color: var(--clay); }
        .day-tab-active .day-tab-dot { background: var(--clay); color: white; border-color: var(--clay); }
        .day-tab-line { flex: 1; height: 2px; background: currentColor; opacity: 0.25; margin: 0 6px 18px; }
        .day-tab-kid.day-tab-active { color: var(--plum); }
        .day-tab-kid.day-tab-active .day-tab-dot { background: var(--plum); border-color: var(--plum); }

        .weather-strip { display: flex; align-items: center; gap: 10px; background: rgba(92,147,180,0.12); border: 1px solid rgba(92,147,180,0.3); border-radius: 14px; padding: 10px 14px; margin-bottom: 20px; color: var(--pine); }
        .weather-strip-kid { background: rgba(255,255,255,0.55); border-color: transparent; color: var(--plum); font-family: var(--font-kid); }
        .weather-strip-text { display: flex; flex-direction: column; font-size: 13px; }
        .weather-strip-temps { font-weight: 700; }
        .weather-strip-note { opacity: 0.8; }

        .slot-section { margin-bottom: 30px; }
        .slot-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px; flex-wrap: wrap; }
        .slot-time { font-size: 13px; font-weight: 700; color: var(--clay); background: rgba(181,83,60,0.1); padding: 3px 9px; border-radius: 999px; }
        .app-root-kid .slot-time { color: var(--plum); background: rgba(255,255,255,0.6); }
        .slot-header h2 { font-family: var(--font-display); font-size: 21px; margin: 0; color: var(--pine); }
        .app-root-kid .slot-header h2 { font-family: var(--font-kid); color: var(--plum); }
        .slot-fixed-badge { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; color: var(--clay); }
        .slot-intro { font-size: 14px; opacity: 0.8; margin: 6px 0 8px; line-height: 1.5; }
        .app-root-kid .slot-intro { font-size: 15.5px; }
        .slot-info-link { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--sky); text-decoration: none; margin-bottom: 12px; }
        .slot-info-link:hover { text-decoration: underline; }

        .option-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 520px) { .option-grid { grid-template-columns: 1fr; } }

        .option-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(35,40,31,0.08); border: 1.5px solid rgba(35,40,31,0.06); display: flex; flex-direction: column; }
        .option-card-picked { border-color: #4E9F6B; }
        .option-card-kid { border-radius: 22px; }
        .option-card-img { height: 120px; background-size: cover; background-position: center; position: relative; }
        .option-vote-badge { position: absolute; top: 8px; left: 8px; background: #2E7444; color: white; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; display: flex; align-items: center; gap: 4px; }
        .option-card-body { padding: 11px 12px 12px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .option-card-body h4 { font-family: var(--font-display); font-size: 15.5px; margin: 0; color: var(--pine); }
        .option-card-kid .option-card-body h4 { font-family: var(--font-kid); color: var(--plum); font-size: 17px; }
        .option-card-body p { font-size: 12.5px; margin: 0; opacity: 0.8; line-height: 1.4; }
        .option-card-kid .option-card-body p { font-size: 14.5px; }
        .option-meta { display: flex; flex-direction: column; gap: 3px; font-size: 11.5px; opacity: 0.85; }
        .option-meta span { display: flex; align-items: center; gap: 5px; }
        .option-actions { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 6px; padding-top: 6px; }
        .option-link { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: var(--sky); text-decoration: none; }
        .option-link:hover { text-decoration: underline; }
        .option-vote-btn { border: 1.5px solid var(--pine); background: none; color: var(--pine); border-radius: 999px; padding: 4px 11px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .option-vote-btn-active { background: #2E7444; border-color: #2E7444; color: white; }

        .footer-note { display: flex; align-items: center; gap: 10px; background: rgba(201,143,46,0.12); color: var(--mustard); border-radius: 14px; padding: 14px 16px; font-size: 13.5px; border: 1px dashed rgba(201,143,46,0.4); }
        .footer-note-kid { background: var(--mint); color: var(--plum); font-size: 15px; border: none; font-family: var(--font-kid); }

        .firefly-fab { position: fixed; bottom: 20px; right: 20px; width: 58px; height: 58px; border-radius: 50%; background: var(--plum); color: var(--butter); border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(106,61,110,0.4); cursor: pointer; z-index: 40; }
        .firefly-glow { position: absolute; inset: -6px; border-radius: 50%; background: radial-gradient(circle, rgba(255,239,174,0.7) 0%, rgba(255,239,174,0) 70%); animation: pulse 2.2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { transform: scale(0.9); opacity: 0.6; } 50% { transform: scale(1.25); opacity: 1; } }

        .firefly-panel { position: fixed; bottom: 90px; right: 16px; left: 16px; max-width: 380px; margin-left: auto; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(106,61,110,0.3); display: flex; flex-direction: column; height: min(480px, 65vh); z-index: 41; overflow: hidden; font-family: var(--font-kid); }
        .firefly-header { background: var(--plum); color: var(--butter); display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; font-size: 15px; font-weight: 700; }
        .firefly-header-title { display: flex; align-items: center; gap: 8px; }
        .firefly-header-actions { display: flex; gap: 10px; }
        .firefly-header-actions button { background: none; border: none; color: var(--butter); cursor: pointer; }
        .firefly-messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; background: var(--lavender); }
        .firefly-bubble { max-width: 85%; padding: 9px 13px; border-radius: 16px; font-size: 14.5px; line-height: 1.4; }
        .firefly-bubble-bot { background: white; color: var(--plum); align-self: flex-start; border-bottom-left-radius: 4px; }
        .firefly-bubble-user { background: var(--plum); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
        .firefly-typing { opacity: 0.7; font-style: italic; }
        .firefly-input-row { display: flex; gap: 6px; padding: 10px; background: white; }
        .firefly-input-row input { flex: 1; border: 1.5px solid var(--lavender); border-radius: 999px; padding: 8px 14px; font-size: 14px; font-family: var(--font-body); outline: none; }
        .firefly-mic, .firefly-send { width: 36px; height: 36px; border-radius: 50%; border: none; background: var(--mint); color: var(--plum); display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .firefly-send { background: var(--plum); color: white; }
        .firefly-mic-active { background: var(--coral); color: white; }

        .welcome-card { text-align: center; padding: 36px 20px; background: white; border-radius: 22px; box-shadow: 0 2px 10px rgba(35,40,31,0.08); }
        .welcome-card h1 { font-family: var(--font-display); color: var(--pine); font-size: 24px; margin-bottom: 6px; }
        .welcome-card p { opacity: 0.75; font-size: 14px; margin-bottom: 22px; }
        .welcome-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .welcome-btn { border: 1.5px solid var(--pine); background: none; border-radius: 16px; padding: 18px 10px; cursor: pointer; font-size: 15px; font-weight: 600; color: var(--pine); display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .welcome-btn-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--pine); color: var(--parchment); display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .welcome-btn-kid { border-color: var(--plum); color: var(--plum); font-family: var(--font-kid); }
        .welcome-btn-kid .welcome-btn-avatar { background: var(--plum); }

        .switch-profile { text-align: center; margin-top: 24px; }
        .switch-profile button { background: none; border: none; text-decoration: underline; font-size: 12.5px; opacity: 0.6; cursor: pointer; color: inherit; }
      `}</style>

      {!profile ? (
        <div className="welcome-card">
          <h1>Fin de semana en Durham</h1>
          <p>¿Quién está planeando hoy?</p>
          <div className="welcome-grid">
            {PROFILES.map((p) => (
              <button key={p.id} className={`welcome-btn ${p.type === "kid" ? "welcome-btn-kid" : ""}`} onClick={() => pickProfile(p.id)}>
                <span className="welcome-btn-avatar">{p.initial}</span>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="brand-header">
            <h1>{kid ? "¡Nuestra aventura! ✨" : "Fin de semana en Durham"}</h1>
            <p>{kid ? "Mira qué haremos cada día" : "Sábado completo en Durham + domingo con zoológico confirmado y regreso a casa"}</p>
          </div>

          <ProfileBar current={profile} onPick={pickProfile} />
          <DayTabs day={day} onChange={setDay} kid={kid} />
          <WeatherStrip day={day} kid={kid} />

          {votesLoaded && SLOTS[day].map((slot) => (
            <SlotSection key={slot.id} slot={slot} votes={votes} profile={profile} onVote={castVote} kid={kid} />
          ))}

          <DayFooterNote day={day} kid={kid} />

          <div className="switch-profile">
            <button onClick={() => pickProfile(null)}>Cambiar de perfil</button>
          </div>
        </>
      )}

      {kid && <FireflyAssistant dayLabel={dayLabel} />}
    </div>
  );
}
