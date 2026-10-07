import rateLimit from 'express-rate-limit';

// Limiteur général pour l'ensemble de l'API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par IP par fenêtre
  standardHeaders: true, // Renvoie les en-têtes standard de limite
  legacyHeaders: false, // Désactive les en-têtes X-RateLimit
  message: {
    error: 'Too Many Requests',
    message: 'Trop de requêtes depuis cette adresse IP. Veuillez réessayer après 15 minutes.'
  }
});

// Limiteur plus strict pour les fonctionnalités d'IA (consommatrices de ressources) et de paiement
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 30, // Limite à 30 requêtes par IP par heure
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Vous avez dépassé la limite autorisée pour ce service. Veuillez réessayer dans une heure.'
  }
});
