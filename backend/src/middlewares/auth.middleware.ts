import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// Déclarer les propriétés personnalisées sur l'objet Request Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role: string; // DB roles: doctor | radiology | reception | cashier | pharmacist | admin_hospital | superadmin | patient
      };
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Jeton de sécurité manquant ou invalide.'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Détection du mode développement local hors-ligne avec jeton fictif
    if (token.startsWith('mock-token-')) {
      const parts = token.split('-');
      const feRole = parts[2];
      const email = parts.slice(3).join('-');

      let role: string = 'doctor';
      if (feRole === 'radiology' || feRole === 'radiologue') {
        role = 'radiology';
      } else if (feRole === 'reception' || feRole === 'accueil') {
        role = 'reception';
      } else if (feRole === 'cashier' || feRole === 'caisse') {
        role = 'cashier';
      } else if (feRole === 'pharmacist' || feRole === 'pharmacien') {
        role = 'pharmacist';
      } else if (feRole === 'patient') {
        role = 'patient';
      } else if (feRole === 'admin_hospital' || feRole === 'superadmin' || feRole === 'admin') {
        role = feRole;
      }

      req.user = {
        id: 'mock-user-id',
        email: email || 'mock@example.com',
        role
      };
      return next();
    }
    
    // Valider le jeton avec Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Session expirée ou invalide. Veuillez vous reconnecter.'
      });
    }

    // Récupérer le profil et le rôle de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({
        error: 'Accès Interdit',
        message: 'Profil utilisateur introuvable.'
      });
    }

    // Attacher l'utilisateur authentifié à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: profile.role
    };

    next();
  } catch (error) {
    return res.status(500).json({
      error: 'Erreur Serveur',
      message: 'Une erreur est survenue lors de l\'authentification.'
    });
  }
};

// Middleware pour restreindre l'accès à des rôles spécifiques
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Non authentifié',
        message: 'Veuillez vous authentifier.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès Interdit',
        message: 'Vous ne possédez pas les autorisations nécessaires pour effectuer cette action.'
      });
    }

    next();
  };
};
