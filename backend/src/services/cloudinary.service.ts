import cloudinary from '../config/cloudinary';

export class CloudinaryService {
  /**
   * Génère une signature d'upload sécurisée à usage unique.
   * Le client utilise cette signature pour téléverser directement le média vers Cloudinary,
   * évitant d'engorger le serveur backend Node.js avec des fichiers lourds.
   */
  static generateUploadSignature(folder: string, publicId?: string) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Définir les paramètres requis pour l'upload privé
    const paramsToSign: Record<string, any> = {
      timestamp: timestamp,
      folder: `sunu_sante/${folder}`,
      type: 'authenticated', // Contenu privé nécessitant une authentification/signature pour la lecture
    };

    if (publicId) {
      paramsToSign.public_id = publicId;
    }

    // Générer la signature cryptographique en utilisant l'API SECRET
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      cloudinary.config().api_secret!
    );

    return {
      signature,
      timestamp,
      cloudName: cloudinary.config().cloud_name,
      apiKey: cloudinary.config().api_key,
      folder: paramsToSign.folder,
      type: paramsToSign.type
    };
  }

  /**
   * Génère une URL d'accès sécurisée et signée temporairement.
   * L'URL expirera automatiquement après la durée spécifiée (en secondes), interdisant toute fuite.
   */
  static getSecureRetrieveUrl(publicId: string, expirationSeconds: number = 300): string {
    return cloudinary.url(publicId, {
      type: 'authenticated', // Indique que c'est un média protégé
      sign_url: true,        // Active la signature
      expires_at: Math.round(new Date().getTime() / 1000) + expirationSeconds,
      secure: true           // Force le protocole HTTPS
    });
  }
}
