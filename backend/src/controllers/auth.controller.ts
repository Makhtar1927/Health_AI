import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const DB_PATH = path.join(__dirname, '../../users-db.json');

export interface LocalUserRecord {
  email: string;
  passwordHash: string;
  role: 'doctor' | 'nurse' | 'radiology' | 'pharmacist' | 'reception' | 'cashier' | 'patient' | 'admin_hospital' | 'admin_pharmacy' | 'superadmin';
  name: string;
  suspended?: boolean;
  details: any;
}

// Helpers for file reading/writing
const readDb = (): LocalUserRecord[] => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (e) {
    console.error('Error reading auth database', e);
    return [];
  }
};

const writeDb = (users: LocalUserRecord[]) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error('Error writing auth database', e);
  }
};

export class AuthController {
  /**
   * Connexion utilisateur
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
        role: z.enum(['doctor', 'nurse', 'radiology', 'pharmacist', 'reception', 'cashier', 'patient', 'admin_hospital', 'admin_pharmacy', 'superadmin'])
      });

      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation Error', details: parsed.error.format() });
      }

      const { email, password, role } = parsed.data;
      const users = readDb();
      let matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      // Auto-creation behavior for mock database convenience
      if (!matchedUser) {
        const defaultName = email.split('@')[0].toUpperCase();
        matchedUser = {
          email,
          passwordHash: password, // Store in plain text for mock simplicity
          role,
          name: defaultName,
          suspended: false,
          details: { mock: true }
        };
        users.push(matchedUser);
        writeDb(users);
      }

      // Validations
      if (matchedUser.suspended) {
        return res.status(403).json({ error: 'Ce compte a été suspendu par un administrateur.' });
      }

      if (matchedUser.role !== role) {
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

      return res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

