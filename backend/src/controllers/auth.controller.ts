import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DbService } from '../services/db.service';
import { supabaseAdmin } from '../config/supabase';

export interface LocalUserRecord {
  email: string;
  passwordHash: string;
  role: 'doctor' | 'nurse' | 'radiology' | 'pharmacist' | 'reception' | 'cashier' | 'patient' | 'admin_hospital' | 'admin_pharmacy' | 'superadmin';
  name: string;
  suspended?: boolean;
  details: any;
}

// Helpers avec persistance locale et synchronisation
const readDb = (): LocalUserRecord[] => DbService.readLocalUsers();
const writeDb = (users: LocalUserRecord[]) => DbService.writeLocalUsers(users);

export class AuthController {
  /**
   * Connexion utilisateur
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['doctor', 'nurse', 'radiology', 'pharmacist', 'reception', 'cashier', 'patient', 'admin_hospital', 'admin_pharmacy', 'superadmin']).optional()
      });

      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const { email, password, role } = parsed.data;
      const users = readDb();
      let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
        return res.status(401).json({ error: 'Identifiants invalides ou compte introuvable.' });
      }

      // Validations
      if (matchedUser.suspended) {
        return res.status(403).json({ error: 'Ce compte a été suspendu par un administrateur.' });
      }

      if (role && matchedUser.role !== role) {
        return res.status(400).json({ error: `Identifiants corrects, mais ce compte n'a pas le rôle de ${role}.` });
      }

      if (matchedUser.passwordHash !== password) {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }

      return res.status(200).json({
        success: true,
        user: {
          email: matchedUser.email,
          role: matchedUser.role,
          name: matchedUser.name,
          details: matchedUser.details
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const registerSchema = z.object({
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['doctor', 'nurse', 'radiology', 'pharmacist', 'reception', 'cashier', 'patient', 'admin_hospital', 'admin_pharmacy', 'superadmin']),
        name: z.string().min(2),
        details: z.record(z.any())
      });

      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const { email, password, role, name, details } = parsed.data;
      const users = readDb();

      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé par un autre compte.' });
      }

      const newUser: LocalUserRecord = {
        email,
        passwordHash: password,
        role,
        name,
        suspended: false,
        details
      };

      users.push(newUser);
      writeDb(users);
      await DbService.syncUserToSupabase(newUser);

      return res.status(200).json({
        success: true,
        user: {
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
          details: newUser.details
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer les utilisateurs par rôle
   */
  static async getUsersByRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const rolesParam = req.query.roles as string;
      if (!rolesParam) {
        return res.status(400).json({ error: 'Le paramètre roles est requis.' });
      }

      const roles = rolesParam.split(',') as LocalUserRecord['role'][];
      const users = readDb();
      const filtered = users.filter(u => roles.includes(u.role));

      return res.status(200).json({
        success: true,
        users: filtered.map(u => ({
          email: u.email,
          role: u.role,
          name: u.name,
          suspended: !!u.suspended,
          details: u.details
        }))
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Création de compte personnel par un administrateur
   */
  static async createStaffAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const createSchema = z.object({
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['doctor', 'nurse', 'radiology', 'pharmacist', 'reception', 'cashier', 'patient', 'admin_hospital', 'admin_pharmacy', 'superadmin']),
        name: z.string().min(2),
        details: z.record(z.any())
      });

      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const { email, password, role, name, details } = parsed.data;
      const users = readDb();

      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà.' });
      }

      const newRecord: LocalUserRecord = {
        email,
        passwordHash: password,
        role,
        name,
        suspended: false,
        details
      };

      users.push(newRecord);
      writeDb(users);
      await DbService.syncUserToSupabase(newRecord);

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activer / suspendre un utilisateur
   */
  static async toggleUserSuspension(req: Request, res: Response, next: NextFunction) {
    try {
      const toggleSchema = z.object({
        email: z.string().email()
      });

      const parsed = toggleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const { email } = parsed.data;
      const users = readDb();
      const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIdx === -1) {
        return res.status(404).json({ error: 'Utilisateur introuvable.' });
      }

      users[userIdx].suspended = !users[userIdx].suspended;
      writeDb(users);
      await DbService.syncUserToSupabase(users[userIdx]);

      return res.status(200).json({ success: true, suspended: users[userIdx].suspended });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transfert d'affectation
   */
  static async transferUserAffiliation(req: Request, res: Response, next: NextFunction) {
    try {
      const transferSchema = z.object({
        email: z.string().email(),
        newAffiliation: z.string().min(2)
      });

      const parsed = transferSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const { email, newAffiliation } = parsed.data;
      const users = readDb();
      const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIdx === -1) {
        return res.status(404).json({ error: 'Utilisateur introuvable.' });
      }

      const user = users[userIdx];
      if (user.role === 'pharmacist') {
        user.details = {
          ...user.details,
          pharmacyName: newAffiliation
        };
      } else {
        user.details = {
          ...user.details,
          hospital: newAffiliation
        };
      }

      writeDb(users);
      await DbService.syncUserToSupabase(user);

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Suppression définitive d'un compte utilisateur (Pouvoir Superadmin)
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const deleteSchema = z.object({
        email: z.string().email()
      });

      const parsed = deleteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const { email } = parsed.data;
      const users = readDb();
      const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIdx === -1) {
        return res.status(404).json({ error: 'Utilisateur introuvable.' });
      }

      // Supprimer l'utilisateur de la base locale
      users.splice(userIdx, 1);
      writeDb(users);
      await DbService.deleteUserFromSupabase(email);

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Demande de réinitialisation de mot de passe (Mot de passe oublié)
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const forgotSchema = z.object({
        email: z.string().email(),
        redirectTo: z.string().url().optional()
      });

      const parsed = forgotSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Adresse email invalide.', details: parsed.error.format() });
      }

      const { email, redirectTo } = parsed.data;

      // On tente d'envoyer l'email de récupération via Supabase
      try {
        await supabaseAdmin.auth.resetPasswordForEmail(email.toLowerCase(), {
          redirectTo: redirectTo || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password`
        });
      } catch (sbErr) {
        console.warn('Supabase resetPasswordForEmail avertissement :', sbErr);
      }

      return res.status(200).json({
        success: true,
        message: 'Si cette adresse email est associée à un compte, un lien de réinitialisation vous a été envoyé.'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Réinitialisation effective du mot de passe avec le nouveau mot de passe
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const resetSchema = z.object({
        email: z.string().email(),
        newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
      });

      const parsed = resetSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Données invalides.', details: parsed.error.format() });
      }

      const { email, newPassword } = parsed.data;
      const users = readDb();
      const userIdx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIdx !== -1) {
        users[userIdx].passwordHash = newPassword;
        writeDb(users);
        await DbService.syncUserToSupabase(users[userIdx]);
      }

      // Tenter également de mettre à jour le mot de passe dans Supabase Auth
      try {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const authUser = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (authUser) {
          await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
            password: newPassword
          });
        }
      } catch (authErr) {
        console.warn('Mise à jour Supabase Auth mot de passe (non bloquant) :', authErr);
      }

      return res.status(200).json({
        success: true,
        message: 'Votre mot de passe a été réinitialisé avec succès.'
      });
    } catch (error) {
      next(error);
    }
  }
}

