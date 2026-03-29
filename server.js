const express = require("express");
const fs = require("fs");
const path = require("path");

let nodemailer = null;
try {
  nodemailer = require("nodemailer");
} catch (_error) {
  nodemailer = null;
}

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = String(process.env.HOST || "0.0.0.0").trim() || "0.0.0.0";
const DATA_DIR = path.resolve(process.env.DATA_DIR || __dirname);

const DEFAULT_ADMIN = {
  name: "Administrateur Principal",
  email: "admin@unipod.local",
  password: "Admin@123"
};

const APP = {
  env: String(process.env.NODE_ENV || "development").trim().toLowerCase(),
  secureCookies: /^(1|true|yes)$/i.test(String(process.env.FORCE_SECURE_COOKIE || ""))
    || String(process.env.NODE_ENV || "").trim().toLowerCase() === "production",
  allowedOrigins: String(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
};

const FILES = {
  registrations: path.join(DATA_DIR, "registrations.json"),
  admins: path.join(DATA_DIR, "admins.json"),
  resetTokens: path.join(DATA_DIR, "admin-reset-tokens.json"),
  menus: path.join(DATA_DIR, "menus.json"),
  kpis: path.join(DATA_DIR, "kpis.json")
};

const AUTH = {
  sessionCookie: "unipod_admin_token",
  sessionTtlMs: 8 * 60 * 60 * 1000,
  resetTtlMs: 15 * 60 * 1000
};

const SMTP = {
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  from: process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@unipod.local"
};

const adminSessions = new Map();

app.set("trust proxy", 1);

function isAllowedLocalOrigin(origin) {
  if (!origin) {
    return false;
  }

  try {
    const normalizedOrigin = String(origin).trim();
    if (APP.allowedOrigins.includes(normalizedOrigin)) {
      return true;
    }

    const { protocol, hostname } = new URL(normalizedOrigin);
    if (!/^https?:$/i.test(protocol)) {
      return false;
    }

    if (/^(localhost|127\.0\.0\.1)$/i.test(hostname)) {
      return true;
    }

    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return true;
    }

    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return true;
    }

    const match172 = hostname.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
    if (match172) {
      const secondOctet = Number(match172[1]);
      return secondOctet >= 16 && secondOctet <= 31;
    }
  } catch (_error) {
    return false;
  }

  return false;
}

app.use((req, res, next) => {
  const origin = String(req.headers.origin || "");
  const isLocalOrigin = isAllowedLocalOrigin(origin);

  if (isLocalOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use(express.static(__dirname));

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    env: APP.env,
    dataDir: DATA_DIR
  });
});

function ensureDataFiles() {
  const envAdminEmail = toText(process.env.ADMIN_EMAIL).toLowerCase();
  const envAdminPassword = String(process.env.ADMIN_PASSWORD || "").trim();
  const envAdminName = toText(process.env.ADMIN_NAME) || DEFAULT_ADMIN.name;

  fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(FILES.registrations)) {
    writeJsonArray(FILES.registrations, []);
  }

  if (!fs.existsSync(FILES.resetTokens)) {
    writeJsonArray(FILES.resetTokens, []);
  }

  if (!fs.existsSync(FILES.admins)) {
    if (envAdminEmail && envAdminPassword) {
      writeJsonArray(FILES.admins, [
        {
          name: envAdminName,
          email: envAdminEmail,
          password: envAdminPassword
        }
      ]);
    } else {
      writeJsonArray(FILES.admins, []);
      console.warn("Aucun administrateur initialise. Definissez ADMIN_EMAIL et ADMIN_PASSWORD avant le deploiement.");
    }
  } else if (envAdminEmail && envAdminPassword) {
    const admins = readJsonArray(FILES.admins);
    if (admins.length === 1 && isDefaultAdmin(admins[0])) {
      writeJsonArray(FILES.admins, [
        {
          name: envAdminName,
          email: envAdminEmail,
          password: envAdminPassword
        }
      ]);
    }
  }

  if (!fs.existsSync(FILES.menus)) {
    writeJsonArray(FILES.menus, [
      {
        day: "Lundi",
        items: [
          {
            name: "Pinon au poisson",
            price: 1500,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80"
          },
          {
            name: "Riz curie + viande de boeuf",
            price: 2000,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80"
          }
        ]
      },
      {
        day: "Mardi",
        items: [
          {
            name: "Riz banc + sauce de mouton",
            price: 2500,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80"
          },
          {
            name: "Patte de mais + Gboma",
            price: 1500,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=500&q=80"
          }
        ]
      },
      {
        day: "Mercredi",
        items: [
          {
            name: "Petit poids a la viande + saucisse",
            price: 2000,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=500&q=80"
          },
          {
            name: "Couscous au gras + poulets",
            price: 2500,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80"
          }
        ]
      },
      {
        day: "Jeudi",
        items: [
          {
            name: "Frites au poulet",
            price: 2000,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=500&q=80"
          },
          {
            name: "Spaghetti a la boulette de viande",
            price: 2500,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80"
          }
        ]
      },
      {
        day: "Vendredi",
        items: [
          {
            name: "Riz au gras + poulet braise",
            price: 2500,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"
          },
          {
            name: "Pate rouge + poisson",
            price: 2000,
            currency: "FCFA",
            imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80"
          }
        ]
      }
    ]);
  }

  if (!fs.existsSync(FILES.kpis)) {
    fs.writeFileSync(FILES.kpis, JSON.stringify({
      entrepreneurs: {
        key: "entrepreneurs",
        title: "Entrepreneurs formés",
        value: 250,
        prefix: "+",
        suffix: "",
        target: 300,
        targetSuffix: "",
        unit: "",
        displayValue: "+250"
      },
      incubation: {
        key: "incubation",
        title: "Startups incubées",
        value: 35,
        prefix: "",
        suffix: "",
        target: 50,
        targetSuffix: "",
        unit: "",
        displayValue: "35"
      },
      femmes: {
        key: "femmes",
        title: "Taux de participation féminine",
        value: 46,
        prefix: "",
        suffix: "%",
        target: 50,
        targetSuffix: "%",
        unit: "%",
        displayValue: "46%"
      },
      partenaires: {
        key: "partenaires",
        title: "Partenaires actifs",
        value: 15,
        prefix: "",
        suffix: "",
        target: 20,
        targetSuffix: "",
        unit: "",
        displayValue: "15"
      }
    }, null, 2), "utf-8");
  }
}

function toText(value) {
  return String(value || "").trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return !phone || /^[+0-9\s-]{7,20}$/.test(phone);
}

function normalizePaymentMethod(value) {
  const map = {
    mixx: "mixx",
    flooz: "flooz",
    ussd: "ussd",
    sur_place: "sur_place"
  };

  return map[String(value || "").trim().toLowerCase()] || "";
}

function normalizePaymentStatus(value) {
  const map = {
    en_attente: "en_attente",
    paye: "paye"
  };

  return map[String(value || "").trim().toLowerCase()] || "en_attente";
}

function getNextId(items) {
  const maxId = items.reduce((max, item) => {
    const value = Number(item.id) || 0;
    return value > max ? value : max;
  }, 0);
  return maxId + 1;
}

function parseCookies(cookieHeader) {
  const parsed = {};
  if (!cookieHeader) return parsed;

  cookieHeader.split(";").forEach((chunk) => {
    const [key, ...rest] = chunk.trim().split("=");
    if (!key) return;
    parsed[key] = decodeURIComponent(rest.join("=") || "");
  });

  return parsed;
}

function readJsonArray(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`JSON read error for ${path.basename(filePath)}:`, error.message);
    return [];
  }
}

function writeJsonArray(filePath, items) {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
}

function readJsonObject(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`JSON read error for ${path.basename(filePath)}:`, error.message);
    return fallback;
  }
}

function writeJsonObject(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf-8");
}

function readAdmins() {
  return readJsonArray(FILES.admins);
}

function isDefaultAdmin(admin) {
  return String(admin?.email || "").trim().toLowerCase() === DEFAULT_ADMIN.email
    && String(admin?.password || "") === DEFAULT_ADMIN.password;
}

function readRegistrations() {
  return readJsonArray(FILES.registrations);
}

function writeRegistrations(items) {
  writeJsonArray(FILES.registrations, items);
}

function readMenus() {
  return readJsonArray(FILES.menus);
}

function writeMenus(items) {
  writeJsonArray(FILES.menus, items);
}

function readResetTokens() {
  return readJsonArray(FILES.resetTokens);
}

function writeResetTokens(tokens) {
  writeJsonArray(FILES.resetTokens, tokens);
}

function getDefaultKpis() {
  return {
    entrepreneurs: {
      key: "entrepreneurs",
      title: "Entrepreneurs formés",
      value: 250,
      prefix: "+",
      suffix: "",
      target: 300,
      targetSuffix: "",
      unit: "",
      displayValue: "+250"
    },
    incubation: {
      key: "incubation",
      title: "Startups incubées",
      value: 35,
      prefix: "",
      suffix: "",
      target: 50,
      targetSuffix: "",
      unit: "",
      displayValue: "35"
    },
    femmes: {
      key: "femmes",
      title: "Taux de participation féminine",
      value: 46,
      prefix: "",
      suffix: "%",
      target: 50,
      targetSuffix: "%",
      unit: "%",
      displayValue: "46%"
    },
    partenaires: {
      key: "partenaires",
      title: "Partenaires actifs",
      value: 15,
      prefix: "",
      suffix: "",
      target: 20,
      targetSuffix: "",
      unit: "",
      displayValue: "15"
    }
  };
}

function sanitizeKpiKey(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

function normalizeKpiEntry(key, raw = {}) {
  const value = Number(raw.value);
  const target = Number(raw.target);
  const safeValue = Number.isFinite(value) ? value : 0;
  const safeTarget = Number.isFinite(target) && target > 0 ? target : 100;
  const prefix = toText(raw.prefix);
  const suffix = toText(raw.suffix);
  const targetSuffix = toText(raw.targetSuffix || suffix);
  const title = toText(raw.title) || key;

  return {
    key,
    title,
    value: safeValue,
    prefix,
    suffix,
    target: safeTarget,
    targetSuffix,
    unit: toText(raw.unit || suffix),
    displayValue: `${prefix}${safeValue}${suffix}`
  };
}

function readKpis() {
  const defaults = getDefaultKpis();
  const saved = readJsonObject(FILES.kpis, defaults);
  const normalized = {};

  Object.entries({ ...defaults, ...saved }).forEach(([key, value]) => {
    normalized[key] = normalizeKpiEntry(key, value);
  });

  return normalized;
}

function writeKpis(items) {
  writeJsonObject(FILES.kpis, items);
}

function normalizeDomain(value) {
  const map = {
    formations: "formations",
    events: "events",
    network: "network",
    videos: "videos",
    mobile: "mobile",
    commande: "commande",
    reservation: "reservation",
    cafe: "cafe",
    autre: "autre"
  };

  return map[String(value || "").trim().toLowerCase()] || "autre";
}

function cleanupExpiredSessions() {
  const now = Date.now();
  adminSessions.forEach((session, token) => {
    if (session.expiresAt <= now) {
      adminSessions.delete(token);
    }
  });
}

function getAdminSession(req) {
  cleanupExpiredSessions();
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[AUTH.sessionCookie];
  if (!token) return null;

  const session = adminSessions.get(token);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    adminSessions.delete(token);
    return null;
  }

  return { token, ...session };
}

function requireAdminApi(req, res, next) {
  const session = getAdminSession(req);
  if (!session) {
    return res.status(401).json({ error: "Authentification admin requise." });
  }

  req.admin = session;
  return next();
}

function findAdminByCredentials(email, password) {
  const normalizedEmail = toText(email).toLowerCase();
  const normalizedPassword = String(password || "");

  return readAdmins().find((admin) =>
    String(admin.email || "").trim().toLowerCase() === normalizedEmail
    && String(admin.password || "") === normalizedPassword
  ) || null;
}

function updateAdminPassword(email, newPassword) {
  const normalizedEmail = toText(email).toLowerCase();
  let updated = false;
  const admins = readAdmins().map((admin) => {
    if (String(admin.email || "").trim().toLowerCase() !== normalizedEmail) {
      return admin;
    }

    updated = true;
    return {
      ...admin,
      password: String(newPassword)
    };
  });

  if (!updated) {
    return false;
  }

  writeJsonArray(FILES.admins, admins);
  return true;
}

function cleanupResetTokens(tokens) {
  const now = Date.now();
  return tokens.filter((token) => Number(token.expiresAt || 0) > now);
}

function isSmtpReady() {
  return Boolean(nodemailer && SMTP.host && SMTP.user && SMTP.pass);
}

async function sendResetCodeEmail(targetEmail, code) {
  if (!isSmtpReady()) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP.host,
    port: SMTP.port,
    secure: SMTP.port === 465,
    auth: {
      user: SMTP.user,
      pass: SMTP.pass
    }
  });

  await transporter.sendMail({
    from: SMTP.from,
    to: targetEmail,
    subject: "UNIPOD - Code de reinitialisation admin",
    text: `Votre code UNIPOD est: ${code}. Ce code expire dans 15 minutes.`,
    html: `<p>Votre code UNIPOD est: <strong>${code}</strong></p><p>Ce code expire dans 15 minutes.</p>`
  });

  return true;
}

const formations = [
  { id: 1, title: "Entrepreneuriat Digital", description: "Apprenez a lancer votre startup digitale." },
  { id: 2, title: "Marketing Digital", description: "Maîtrisez Facebook Ads, SEO et branding." },
  { id: 3, title: "Finance pour Entrepreneurs", description: "Gérez efficacement vos finances." }
];

const events = [
  { id: 1, title: "Atelier Startup", description: "Comment creer une startup a Lome." },
  { id: 2, title: "Conference Innovation", description: "Rencontrez des entrepreneurs inspirants." }
];

const network = [
  { id: 1, title: "Meetup Entrepreneurs", description: "Connectez-vous avec d'autres createurs." },
  { id: 2, title: "Afterwork UNIPOD", description: "Echanges et opportunites business." }
];

const videos = [
  { id: 1, title: "Spot institutionnel", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 2, title: "Temoignage startup", embedUrl: "https://www.youtube.com/embed/ysz5S6PUM-U" },
  { id: 3, title: "Aftermovie evenement", embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw" }
];

const topEntrepreneurshipBooks = [
  { title: "L'art de se lancer", author: "Guy Kawasaki", theme: "Création d'entreprise", level: "Débutant", year: 2004 },
  { title: "La méthode Lean Startup", author: "Eric Ries", theme: "Innovation", level: "Intermédiaire", year: 2011 },
  { title: "De zéro à un", author: "Peter Thiel", theme: "Stratégie", level: "Intermédiaire", year: 2014 },
  { title: "Commencer par pourquoi", author: "Simon Sinek", theme: "Leadership", level: "Débutant", year: 2009 },
  { title: "Réinventer son entreprise", author: "Jason Fried et David Heinemeier Hansson", theme: "Exécution", level: "Débutant", year: 2010 },
  { title: "Créer son business model", author: "Alexander Osterwalder et Yves Pigneur", theme: "Business model", level: "Débutant", year: 2010 },
  { title: "Concevoir une proposition de valeur", author: "Alexander Osterwalder", theme: "Business model", level: "Intermédiaire", year: 2014 },
  { title: "Tester son marché", author: "Rob Fitzpatrick", theme: "Validation client", level: "Débutant", year: 2013 },
  { title: "Accélérer sa croissance", author: "Gabriel Weinberg et Justin Mares", theme: "Croissance", level: "Intermédiaire", year: 2014 },
  { title: "Concevoir un produit irrésistible", author: "Nir Eyal", theme: "Produit", level: "Intermédiaire", year: 2014 },
  { title: "Mesurer ce qui compte", author: "John Doerr", theme: "Pilotage", level: "Intermédiaire", year: 2018 },
  { title: "De la performance à l'excellence", author: "Jim Collins", theme: "Leadership", level: "Avancé", year: 2001 },
  { title: "Bâtir pour durer", author: "Jim Collins et Jerry I. Porras", theme: "Leadership", level: "Avancé", year: 1994 },
  { title: "Le dilemme de l'innovateur", author: "Clayton M. Christensen", theme: "Innovation", level: "Avancé", year: 1997 },
  { title: "Les 7 habitudes de ceux qui réalisent tout ce qu'ils entreprennent", author: "Stephen R. Covey", theme: "Productivité", level: "Débutant", year: 1989 },
  { title: "Réfléchissez et devenez riche", author: "Napoleon Hill", theme: "Mindset", level: "Débutant", year: 1937 },
  { title: "Père riche, père pauvre", author: "Robert T. Kiyosaki", theme: "Finance startup", level: "Débutant", year: 1997 },
  { title: "L'art de la victoire", author: "Phil Knight", theme: "Création d'entreprise", level: "Débutant", year: 2016 },
  { title: "Steve Jobs", author: "Walter Isaacson", theme: "Leadership", level: "Intermédiaire", year: 2011 },
  { title: "Principes", author: "Ray Dalio", theme: "Leadership", level: "Avancé", year: 2017 },
  { title: "Un rien peut tout changer", author: "James Clear", theme: "Productivité", level: "Débutant", year: 2018 },
  { title: "Le travail en profondeur", author: "Cal Newport", theme: "Productivité", level: "Intermédiaire", year: 2016 },
  { title: "La vache pourpre", author: "Seth Godin", theme: "Marketing digital", level: "Débutant", year: 2003 },
  { title: "Influence et manipulation", author: "Robert B. Cialdini", theme: "Vente & négociation", level: "Intermédiaire", year: 1984 },
  { title: "Ne coupez jamais la poire en deux", author: "Chris Voss", theme: "Vente & négociation", level: "Intermédiaire", year: 2016 },
  { title: "Vendre ou se faire vendre", author: "Grant Cardone", theme: "Vente & négociation", level: "Débutant", year: 2011 },
  { title: "La startup à 100 euros", author: "Chris Guillebeau", theme: "Création d'entreprise", level: "Débutant", year: 2012 },
  { title: "Lean Analytics", author: "Alistair Croll et Benjamin Yoskovitz", theme: "Pilotage", level: "Avancé", year: 2013 },
  { title: "Passer à l'échelle", author: "Verne Harnish", theme: "Croissance", level: "Avancé", year: 2014 },
  { title: "Manager pour réussir", author: "Andrew S. Grove", theme: "Management d'équipe", level: "Avancé", year: 1983 },
  { title: "Négocier sa levée de fonds", author: "Brad Feld et Jason Mendelson", theme: "Levée de fonds", level: "Avancé", year: 2011 },
  { title: "Les fondateurs à l'oeuvre", author: "Jessica Livingston", theme: "Création d'entreprise", level: "Intermédiaire", year: 2007 },
  { title: "Blitzscaling", author: "Reid Hoffman et Chris Yeh", theme: "Croissance", level: "Avancé", year: 2018 },
  { title: "Une entreprise à taille humaine", author: "Paul Jarvis", theme: "Stratégie", level: "Débutant", year: 2019 },
  { title: "Le profit d'abord", author: "Mike Michalowicz", theme: "Finance startup", level: "Intermédiaire", year: 2014 },
  { title: "Le MBA personnel", author: "Josh Kaufman", theme: "Business model", level: "Débutant", year: 2010 },
  { title: "Originaux", author: "Adam Grant", theme: "Innovation", level: "Intermédiaire", year: 2016 },
  { title: "L'art de la persévérance", author: "Angela Duckworth", theme: "Mindset", level: "Débutant", year: 2016 },
  { title: "Osez réussir", author: "Carol S. Dweck", theme: "Mindset", level: "Débutant", year: 2006 },
  { title: "Commencer petit pour durer", author: "Rob Walling", theme: "Création d'entreprise", level: "Intermédiaire", year: 2010 },
  { title: "Entrepreneuriat discipliné", author: "Bill Aulet", theme: "Création d'entreprise", level: "Intermédiaire", year: 2013 },
  { title: "Piloter sa startup avec méthode", author: "Ash Maurya", theme: "Validation client", level: "Intermédiaire", year: 2012 },
  { title: "Les quatre étapes de l'épiphanie", author: "Steve Blank", theme: "Validation client", level: "Avancé", year: 2005 },
  { title: "Le manuel du créateur de startup", author: "Steve Blank et Bob Dorf", theme: "Création d'entreprise", level: "Avancé", year: 2012 },
  { title: "L'intelligence financière pour entrepreneurs", author: "Karen Berman et Joe Knight", theme: "Finance startup", level: "Intermédiaire", year: 2008 },
  { title: "Made to Stick", author: "Chip Heath et Dan Heath", theme: "Marketing digital", level: "Débutant", year: 2007 },
  { title: "Contagieux", author: "Jonah Berger", theme: "Marketing digital", level: "Intermédiaire", year: 2013 }
];

const entrepreneurshipBooks = Array.from({ length: 5000 }, (_, index) => {
  const id = index + 1;
  const base = topEntrepreneurshipBooks[index % topEntrepreneurshipBooks.length];
  const volume = Math.floor(index / topEntrepreneurshipBooks.length) + 1;

  return {
    id,
    title: volume === 1 ? base.title : `${base.title} - Guide pratique ${volume}`,
    author: base.author,
    theme: base.theme,
    year: base.year,
    level: base.level,
    language: "Français",
    summary: `Collection entrepreneuriat basée sur "${base.title}" pour progresser en ${base.theme.toLowerCase()}.`
  };
});

function buildBookReadingContent(book) {
  return {
    intro: `Ce guide pratique autour de "${book.title}" aide l'entrepreneur à structurer une vision claire, tester ses hypothèses et accélérer sa croissance.`,
    chapters: [
      {
        title: "Chapitre 1 - Clarifier la vision entrepreneuriale",
        content: "Définir le problème réel à résoudre, comprendre le client idéal et exprimer une proposition de valeur lisible. Ce chapitre insiste sur la cohérence entre vision, marché et exécution."
      },
      {
        title: "Chapitre 2 - Valider le marché rapidement",
        content: "Construire un cycle court d'expérimentation: entretiens clients, prototype minimum, mesures concrètes et ajustements rapides. L'objectif est de réduire le risque en apprenant vite."
      },
      {
        title: "Chapitre 3 - Mettre en place un modèle économique durable",
        content: "Identifier les sources de revenus, les coûts critiques et les indicateurs de rentabilité. Le chapitre montre comment piloter la marge et la trésorerie dès le début."
      },
      {
        title: "Chapitre 4 - Passer à l'échelle",
        content: "Formaliser les processus, renforcer l'équipe et prioriser les canaux de croissance performants. L'entrepreneur apprend à croître sans perdre qualité ni culture interne."
      }
    ],
    keyPoints: [
      `Thème principal: ${book.theme}`,
      `Niveau recommandé: ${book.level}`,
      "Priorité à l'action terrain et aux retours clients",
      "Pilotage par objectifs simples et mesures fréquentes"
    ]
  };
}

const OPEN_LIBRARY = {
  searchBase: "https://openlibrary.org/search.json",
  workBase: "https://openlibrary.org/works"
};

async function fetchJsonWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`OpenLibrary HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeOpenLibraryWorkId(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.replace(/^\/works\//i, "");
}

function mapOpenLibraryDoc(doc) {
  const key = normalizeOpenLibraryWorkId(doc.key);
  const firstAuthor = Array.isArray(doc.author_name) ? String(doc.author_name[0] || "").trim() : "";
  const firstYear = Number(doc.first_publish_year) || null;
  const coverId = Number(doc.cover_i) || 0;
  const firstLanguage = Array.isArray(doc.language) ? String(doc.language[0] || "").trim() : "";
  const firstSubject = Array.isArray(doc.subject) ? String(doc.subject[0] || "").trim() : "";

  return {
    id: key || String(doc.cover_edition_key || doc.edition_key?.[0] || Date.now()),
    title: String(doc.title || "Sans titre").trim(),
    author: firstAuthor || "Auteur inconnu",
    theme: firstSubject || "Entrepreneuriat",
    year: firstYear || null,
    level: "Tous niveaux",
    language: firstLanguage || "N/A",
    summary: "Resultat provenant d'une bibliotheque en ligne (Open Library).",
    coverUrl: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "",
    sourceUrl: key ? `https://openlibrary.org/works/${key}` : "https://openlibrary.org"
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "unipod-api" });
});

app.get("/api/formations", (_req, res) => {
  res.json(formations);
});

app.get("/api/events", (_req, res) => {
  res.json(events);
});

app.get("/api/network", (_req, res) => {
  res.json(network);
});

app.get("/api/menus", (req, res) => {
  const dayQuery = String(req.query.day || "").trim().toLowerCase();
  const menus = readMenus();

  if (!dayQuery) {
    return res.json(menus);
  }

  const dayMenu = menus.find((entry) => String(entry.day || "").trim().toLowerCase() === dayQuery);
  if (!dayMenu) {
    return res.status(404).json({ error: "Menu introuvable pour ce jour." });
  }

  return res.json(dayMenu);
});

app.get("/api/kpis", (_req, res) => {
  res.json(readKpis());
});

app.put("/api/kpis", requireAdminApi, (req, res) => {
  const payload = req.body;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res.status(400).json({ error: "Format KPI invalide." });
  }

  const next = {};
  Object.entries(payload).forEach(([rawKey, value]) => {
    const key = sanitizeKpiKey(rawKey);
    if (!key || !value || typeof value !== "object" || Array.isArray(value)) {
      return;
    }
    next[key] = normalizeKpiEntry(key, value);
  });

  if (!Object.keys(next).length) {
    return res.status(400).json({ error: "Aucun KPI valide à enregistrer." });
  }

  writeKpis(next);
  return res.json(readKpis());
});

app.post("/api/menus", requireAdminApi, (req, res) => {
  const day = toText(req.body?.day);
  const name = toText(req.body?.name);
  const price = Number(req.body?.price) || 0;
  const currency = toText(req.body?.currency) || "FCFA";
  const imageUrl = toText(req.body?.imageUrl);

  if (!day || !name || price <= 0) {
    return res.status(400).json({ error: "Jour, nom du plat et prix valides sont obligatoires." });
  }

  const menus = readMenus();
  const existingDay = menus.find((entry) => String(entry.day || "").trim().toLowerCase() === day.toLowerCase());
  const newItem = {
    id: Date.now(),
    name,
    price,
    currency,
    imageUrl
  };

  if (existingDay) {
    existingDay.items = Array.isArray(existingDay.items) ? existingDay.items : [];
    existingDay.items.push(newItem);
  } else {
    menus.push({
      day,
      items: [newItem]
    });
  }

  writeMenus(menus);
  return res.status(201).json(newItem);
});

app.delete("/api/menus/:day/:itemId", requireAdminApi, (req, res) => {
  const day = String(req.params.day || "").trim().toLowerCase();
  const itemId = Number(req.params.itemId) || 0;
  const menus = readMenus();
  const dayMenu = menus.find((entry) => String(entry.day || "").trim().toLowerCase() === day);

  if (!dayMenu) {
    return res.status(404).json({ error: "Jour de menu introuvable." });
  }

  const initialLength = Array.isArray(dayMenu.items) ? dayMenu.items.length : 0;
  dayMenu.items = (dayMenu.items || []).filter((item) => Number(item.id) !== itemId);

  if (dayMenu.items.length === initialLength) {
    return res.status(404).json({ error: "Plat introuvable." });
  }

  const cleanedMenus = menus.filter((entry) => String(entry.day || "").trim().toLowerCase() !== day || (entry.items || []).length > 0);
  writeMenus(cleanedMenus);
  return res.json({ ok: true });
});

app.get("/api/library/videos", (_req, res) => {
  res.json(videos);
});

app.get("/api/library/meta", (_req, res) => {
  const themes = [...new Set(entrepreneurshipBooks.map((book) => book.theme))].sort((a, b) => a.localeCompare(b));
  const levels = [...new Set(entrepreneurshipBooks.map((book) => book.level))].sort((a, b) => a.localeCompare(b));
  res.json({ themes, levels });
});

app.get("/api/library/books", async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
  const search = String(req.query.search || "").trim().toLowerCase();
  const theme = String(req.query.theme || "").trim().toLowerCase();
  const level = String(req.query.level || "").trim().toLowerCase();
  const sort = String(req.query.sort || "title_asc").trim().toLowerCase();

  let filtered = entrepreneurshipBooks;

  if (search) {
    filtered = filtered.filter((book) =>
      [book.title, book.author, book.theme, book.summary]
        .join(" ")
        .toLowerCase()
        .includes(search));
  }

  if (theme) {
    filtered = filtered.filter((book) => book.theme.toLowerCase() === theme);
  }

  if (level) {
    filtered = filtered.filter((book) => book.level.toLowerCase() === level);
  }

  const sortable = [...filtered];
  if (sort === "year_desc") {
    sortable.sort((a, b) => b.year - a.year);
  } else if (sort === "year_asc") {
    sortable.sort((a, b) => a.year - b.year);
  } else if (sort === "title_desc") {
    sortable.sort((a, b) => b.title.localeCompare(a.title));
  } else {
    sortable.sort((a, b) => a.title.localeCompare(b.title));
  }

  const total = sortable.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const items = sortable.slice(start, start + limit);

  return res.json({
    items,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages
    }
  });
});

app.get("/api/library/books/:id", async (req, res) => {
  const rawId = String(req.params.id || "").trim();
  if (!rawId) {
    return res.status(400).json({ error: "Identifiant livre invalide." });
  }

  const numericId = parseInt(rawId, 10);
  if (Number.isInteger(numericId) && numericId > 0) {
    const localBook = entrepreneurshipBooks.find((item) => item.id === numericId);
    if (localBook) {
      const reading = buildBookReadingContent(localBook);
      return res.json({ ...localBook, reading });
    }
  }

  const workId = normalizeOpenLibraryWorkId(rawId);
  if (!workId) {
    return res.status(400).json({ error: "Identifiant livre invalide." });
  }

  try {
    const work = await fetchJsonWithTimeout(`${OPEN_LIBRARY.workBase}/${encodeURIComponent(workId)}.json`);
    const title = String(work.title || "Sans titre").trim();
    const description = typeof work.description === "string"
      ? work.description
      : String(work.description?.value || "").trim();
    const subjects = Array.isArray(work.subjects) ? work.subjects.slice(0, 4) : [];

    const payload = {
      id: workId,
      title,
      author: "Auteur non precise",
      theme: subjects[0] || "Entrepreneuriat",
      year: null,
      level: "Tous niveaux",
      language: "N/A",
      summary: description || "Fiche livre provenant d'une bibliotheque en ligne.",
      sourceUrl: `https://openlibrary.org/works/${workId}`,
      reading: {
        intro: description || "Apercu du livre depuis Open Library.",
        chapters: [
          {
            title: "Presentation",
            content: description || "Description detaillee non disponible pour ce livre."
          },
          {
            title: "Themes principaux",
            content: subjects.length ? subjects.join(", ") : "Themes non renseignes."
          }
        ],
        keyPoints: subjects.length ? subjects : ["Consulter la fiche source pour plus d'informations."]
      }
    };

    return res.json(payload);
  } catch (_error) {
    return res.status(404).json({ error: "Livre introuvable." });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body || {};
  const admin = findAdminByCredentials(email, password);

  if (!admin) {
    return res.status(401).json({ error: "Identifiants admin invalides." });
  }

  const token = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  adminSessions.set(token, {
    email: String(admin.email).trim().toLowerCase(),
    name: String(admin.name || "Admin").trim(),
    expiresAt: Date.now() + AUTH.sessionTtlMs
  });

  res.setHeader(
    "Set-Cookie",
    `${AUTH.sessionCookie}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${Math.floor(AUTH.sessionTtlMs / 1000)}; SameSite=Lax${APP.secureCookies ? "; Secure" : ""}`
  );

  return res.json({
    ok: true,
    email: String(admin.email).trim().toLowerCase(),
    name: String(admin.name || "Admin").trim()
  });
});

app.post("/api/admin/request-reset", async (req, res) => {
  const { email } = req.body || {};
  const normalizedEmail = toText(email).toLowerCase();
  if (!normalizedEmail) {
    return res.status(400).json({ error: "Email obligatoire." });
  }

  const adminExists = readAdmins().some((admin) =>
    String(admin.email || "").trim().toLowerCase() === normalizedEmail
  );

  if (!adminExists) {
    return res.status(404).json({ error: "Aucun administrateur avec cet email." });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const tokens = cleanupResetTokens(readResetTokens()).filter((token) =>
    String(token.email || "").trim().toLowerCase() !== normalizedEmail
  );

  tokens.push({
    email: normalizedEmail,
    code,
    expiresAt: Date.now() + AUTH.resetTtlMs
  });

  writeResetTokens(tokens);

  try {
    const emailSent = await sendResetCodeEmail(normalizedEmail, code);

    if (emailSent) {
      return res.json({
        ok: true,
        emailSent: true,
        message: "Code envoye par email (valable 15 minutes)."
      });
    }

    return res.json({
      ok: true,
      emailSent: false,
      message: "SMTP non configure. Code de secours genere (valable 15 minutes).",
      resetCode: code
    });
  } catch (error) {
    console.error("Erreur envoi email reset:", error.message);
    return res.status(500).json({ error: "Impossible d'envoyer le code de reinitialisation par email." });
  }
});

app.post("/api/admin/confirm-reset", (req, res) => {
  const { email, code, newPassword } = req.body || {};
  const normalizedEmail = toText(email).toLowerCase();
  const normalizedCode = toText(code);
  const normalizedPassword = String(newPassword || "");

  if (!normalizedEmail || !normalizedCode || !normalizedPassword) {
    return res.status(400).json({ error: "Email, code et nouveau mot de passe sont obligatoires." });
  }

  if (normalizedPassword.length < 8) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caracteres." });
  }

  const tokens = cleanupResetTokens(readResetTokens());
  const token = tokens.find((item) =>
    String(item.email || "").trim().toLowerCase() === normalizedEmail
    && String(item.code || "").trim() === normalizedCode
  );

  if (!token) {
    return res.status(400).json({ error: "Code de reinitialisation invalide ou expire." });
  }

  const updated = updateAdminPassword(normalizedEmail, normalizedPassword);
  if (!updated) {
    return res.status(404).json({ error: "Administrateur introuvable." });
  }

  const remainingTokens = tokens.filter((item) =>
    !(String(item.email || "").trim().toLowerCase() === normalizedEmail
      && String(item.code || "").trim() === normalizedCode)
  );

  writeResetTokens(remainingTokens);
  return res.json({ ok: true, message: "Mot de passe reinitialise avec succes." });
});

app.get("/api/admin/session", (req, res) => {
  const session = getAdminSession(req);
  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({ authenticated: true, email: session.email, name: session.name || "Admin" });
});

app.post("/api/admin/logout", (req, res) => {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[AUTH.sessionCookie];
  if (token) {
    adminSessions.delete(token);
  }

  res.setHeader("Set-Cookie", `${AUTH.sessionCookie}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  return res.json({ ok: true });
});

app.post("/api/register", (req, res) => {
  const {
    fullName,
    email,
    phone,
    organization,
    domain,
    activityTitle,
    sourcePage,
    message,
    paymentMethod,
    paymentStatus,
    paymentNumber,
    paymentReference,
    paymentUssdCode,
    paymentAmount,
    consent
  } = req.body || {};

  const normalizedName = toText(fullName);
  const normalizedEmail = toText(email).toLowerCase();
  const normalizedPhone = toText(phone);
  const normalizedMessage = toText(message);
  const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
  const normalizedPaymentStatus = normalizePaymentStatus(paymentStatus);
  const normalizedPaymentNumber = toText(paymentNumber);
  const normalizedPaymentReference = toText(paymentReference);
  const normalizedPaymentUssdCode = toText(paymentUssdCode);
  const normalizedPaymentAmount = Number(paymentAmount) || 0;

  if (!normalizedName || !normalizedEmail || !domain) {
    return res.status(400).json({
      error: "Les champs 'fullName', 'email' et 'domain' sont obligatoires."
    });
  }

  if (normalizedName.length < 3) {
    return res.status(400).json({ error: "Le nom complet doit contenir au moins 3 caracteres." });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ error: "Adresse email invalide." });
  }

  if (!isValidPhone(normalizedPhone)) {
    return res.status(400).json({ error: "Numero de telephone invalide." });
  }

  if (normalizedPaymentMethod && !["mixx", "flooz", "ussd", "sur_place"].includes(normalizedPaymentMethod)) {
    return res.status(400).json({ error: "Moyen de paiement invalide." });
  }

  if (["mixx", "flooz"].includes(normalizedPaymentMethod) && !normalizedPaymentNumber) {
    return res.status(400).json({ error: "Numero mobile money obligatoire pour Mixx/Flooz." });
  }

  if (normalizedPaymentNumber && !isValidPhone(normalizedPaymentNumber)) {
    return res.status(400).json({ error: "Numero de paiement mobile money invalide." });
  }

  if (normalizedPaymentAmount < 0 || normalizedPaymentAmount > 10000000) {
    return res.status(400).json({ error: "Montant de paiement invalide." });
  }

  if (normalizedMessage.length < 10) {
    return res.status(400).json({ error: "Le message doit contenir au moins 10 caracteres." });
  }

  if (normalizedMessage.length > 600) {
    return res.status(400).json({ error: "Le message ne doit pas depasser 600 caracteres." });
  }

  if (!consent) {
    return res.status(400).json({ error: "Le consentement est obligatoire." });
  }

  const records = readRegistrations();
  const record = {
    id: getNextId(records),
    fullName: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    organization: toText(organization),
    domain: normalizeDomain(domain),
    activityTitle: toText(activityTitle),
    sourcePage: toText(sourcePage),
    message: normalizedMessage,
    paymentMethod: normalizedPaymentMethod || "non_precise",
    paymentStatus: normalizedPaymentStatus,
    paymentNumber: normalizedPaymentNumber,
    paymentReference: normalizedPaymentReference,
    paymentUssdCode: normalizedPaymentUssdCode,
    paymentAmount: normalizedPaymentAmount,
    consent: Boolean(consent),
    createdAt: new Date().toISOString()
  };

  records.push(record);
  writeRegistrations(records);

  return res.status(201).json(record);
});

app.get("/api/registrations", requireAdminApi, (req, res) => {
  const domain = req.query.domain ? normalizeDomain(req.query.domain) : null;
  const records = readRegistrations();

  if (!domain) {
    return res.json(records);
  }

  return res.json(records.filter((item) => item.domain === domain));
});

app.get("/api/registrations/grouped", requireAdminApi, (_req, res) => {
  const grouped = {
    formations: [],
    events: [],
    network: [],
    videos: [],
    mobile: [],
    commande: [],
    reservation: [],
    cafe: [],
    autre: []
  };

  readRegistrations().forEach((item) => {
    const key = normalizeDomain(item.domain);
    grouped[key].push(item);
  });

  return res.json(grouped);
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/inscription", (_req, res) => {
  res.sendFile(path.join(__dirname, "inscription.html"));
});

app.get("/bibliotheque", (_req, res) => {
  res.sendFile(path.join(__dirname, "bibliotheque.html"));
});

app.get("/cafe", (_req, res) => {
  res.sendFile(path.join(__dirname, "cafe.html"));
});

app.get("/pub-video", (_req, res) => {
  res.sendFile(path.join(__dirname, "pub-video.html"));
});

app.get("/livre/:id", (_req, res) => {
  res.sendFile(path.join(__dirname, "livre.html"));
});

app.get("/admin-login", (_req, res) => {
  res.sendFile(path.join(__dirname, "admin-login.html"));
});

app.get("/admin-reset", (_req, res) => {
  res.sendFile(path.join(__dirname, "admin-reset.html"));
});

app.get("/admin", (req, res) => {
  const session = getAdminSession(req);
  if (!session) {
    return res.redirect("/admin-login");
  }

  return res.sendFile(path.join(__dirname, "admin.html"));
});

app.get("/admin-menus", (req, res) => {
  const session = getAdminSession(req);
  if (!session) {
    return res.redirect("/admin-login");
  }

  return res.sendFile(path.join(__dirname, "admin-menus.html"));
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled API error:", err);
  return res.status(500).json({ error: "Erreur interne du serveur." });
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

ensureDataFiles();
app.listen(PORT, () => {
  const insecureAdmins = readAdmins().filter(isDefaultAdmin);
  if (APP.env === "production" && insecureAdmins.length > 0) {
    console.warn("Attention: des identifiants admin par defaut sont encore presents. Remplacez-les avant la mise en ligne.");
  }

  console.log(`UNIPOD backend running on http://${HOST}:${PORT}`);
});


// ============================================
// GESTION DES VIDEOS - API
// ============================================

const VIDEOS_FILE = path.join(__dirname, "videos.json");

// Lire les vidéos
function readVideos() {
  return readJsonArray(VIDEOS_FILE);
}

// Écrire les vidéos
function writeVideos(videos) {
  writeJsonArray(VIDEOS_FILE, videos);
}

// GET /api/videos - Récupérer toutes les vidéos (public)
app.get("/api/videos", (_req, res) => {
  try {
    const videos = readVideos();
    res.json(videos);
  } catch (error) {
    console.error("Erreur lecture vidéos:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/videos - Ajouter une vidéo (admin uniquement)
app.post("/api/videos", requireAdminApi, (req, res) => {
  try {
    const { title, embedUrl, category } = req.body;
    
    // Validation
    if (!title || !embedUrl) {
      return res.status(400).json({ error: "Titre et URL requis" });
    }
    
    // Validation URL YouTube
    if (!embedUrl.includes("youtube.com/embed/")) {
      return res.status(400).json({ error: "URL YouTube embed invalide" });
    }
    
    const videos = readVideos();
    const newVideo = {
      id: getNextId(videos),
      title: toText(title),
      embedUrl: toText(embedUrl),
      category: toText(category) || "Autre",
      createdAt: new Date().toISOString()
    };
    
    videos.push(newVideo);
    writeVideos(videos);
    
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Erreur ajout vidéo:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/videos/:id - Supprimer une vidéo (admin uniquement)
app.delete("/api/videos/:id", requireAdminApi, (req, res) => {
  try {
    const id = Number(req.params.id);
    let videos = readVideos();
    
    const initialLength = videos.length;
    videos = videos.filter(v => v.id !== id);
    
    if (videos.length === initialLength) {
      return res.status(404).json({ error: "Vidéo non trouvée" });
    }
    
    writeVideos(videos);
    res.json({ success: true, message: "Vidéo supprimée" });
  } catch (error) {
    console.error("Erreur suppression vidéo:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
