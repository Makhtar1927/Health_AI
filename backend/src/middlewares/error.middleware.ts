import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  // Journaliser l'erreur en interne
  console.error(`[ERROR] ${req.method} ${req.path} :`, err.message || err);
  if (err.stack && env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Ne pas exposer les détails techniques de l'erreur en production (Shift-Left Security)
  const response = {
    error: err.name || 'Server Error',
    message: err.message || 'Une erreur interne est survenue sur le serveur.',
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};
