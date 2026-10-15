import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { apiLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/error.middleware';

// Importation des routes
import aiRoutes from './routes/ai.routes';
import mediaRoutes from './routes/media.routes';
import authRoutes from './routes/auth.routes';
import radiologyRoutes from './routes/radiology.routes';
import facilityRoutes from './routes/facility.routes';

const app = express();

// =====================================================================
// MIDDLEWARES DE SÉCURITÉ ET GLOBAUX (Security by Conception)
// =====================================================================

// En-têtes HTTP sécurisés avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co", "https://*.cloudinary.com", "https://res.cloudinary.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://res.cloudinary.com", "https://*.supabase.co"]
    }
  }
}));

// CORS multi-port et multi-environnement pour l'écosystème Sunu Santé
const baseLocalOrigins = [
  'http://localhost:3000', // Patient
  'http://localhost:3001', // Admin (Hôpital/Pharmacie)
  'http://localhost:3002', // Superadmin
  'http://localhost:3003'  // Personnel (Médecin/Accueil...)
];

app.use(cors({
  origin: (origin, callback) => {
    // Permettre les requêtes sans origine (comme Postman, curl, webhooks)
    if (!origin) return callback(null, true);
    
    // 1. Autoriser toutes les variantes locales (localhost & 127.0.0.1)
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // 2. Autoriser les déploiements Vercel (production & previews *.vercel.app)
    if (/^https:\/\/([a-zA-Z0-9_-]+\.)?vercel\.app$/.test(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // 3. Origines configurées explicitement via l'environnement
    const customOrigins = env.ALLOWED_ORIGINS 
      ? env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) 
      : [];
    
    if (baseLocalOrigins.includes(origin) || origin === env.FRONTEND_URL || customOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error(`Bloqué par la politique CORS de Sunu Santé : ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // Cache preflight 24h
}));

// Limitation globale des requêtes
app.use('/api/', apiLimiter);

// Parseurs JSON et Urlencoded
app.use(express.json({ limit: '10mb' })); // Limite pour les en-têtes JSON complexes
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Journalisation d'activité avec Morgan (Shift-Left Audit Trail)
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// =====================================================================
// ROUTES DE L'APPLICATION
// =====================================================================

// Route de diagnostic de santé pour Render (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: env.NODE_ENV
  });
});

// Enregistrement des routes de modules
app.use('/api/ai', aiRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/radiology', radiologyRoutes);
app.use('/api/facilities', facilityRoutes);

// =====================================================================
// GESTION GLOBALE DES ERREURS
// =====================================================================
app.use(errorHandler);

// Démarrage du Serveur
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 ==========================================================
  💡 Sunu Santé - API Principale Connectée
  🛡️  Mode Sécurité Actif (Helmet & Rate-Limits chargés)
  🌍 Environnement : ${env.NODE_ENV}
  🔌 Port d'écoute : http://localhost:${PORT}
  ==========================================================
  `);
});

// Arrêt propre (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('Signal SIGTERM reçu. Fermeture du serveur en cours...');
  server.close(() => {
    console.log('Serveur Express fermé proprement.');
    process.exit(0);
  });
});
