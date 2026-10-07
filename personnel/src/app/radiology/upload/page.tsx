'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Upload,
  ShieldCheck,
  EyeOff,
  Database,
  FileText,
  AlertTriangle,
  Loader2,
  CheckCircle,
  FileBadge,
  Sparkles,
  Lock
} from 'lucide-react';
import Link from 'next/link';

export default function RadiologyUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examType, setExamType] = useState('Lung X-Ray (Face)');
  const [patientId, setPatientId] = useState('P-103');
  
  // Security Checklist States
  const [anonymizeChecked, setAnonymizeChecked] = useState(true);

  // Upload progress States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Fake DICOM metadata representation
  const originalMetadata = {
    patientName: "Cheikh Tidiane Diop",
    socialSecurity: "1 67 02 201 021 54",
    birthDate: "12/04/1959",
    location: "Clinique Dakar Plateau - Bloc B",
    deviceModel: "GE Optima CT660",
    modality: "CT"
  };

  const anonymizedMetadata = {
    patientName: "ANONYMOUS_P_103",
    socialSecurity: "X XX XX XXX XXX XX",
    birthDate: "XX/XX/1959 (67 ans)",
    location: "Region: Dakar (Sensible Masqué)",
    deviceModel: "GE Optima CT660",
    modality: "CT"
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Simulating Shift-Left Client Anonymizer and backend Cloudinary secure upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier DICOM / Image.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      // Simulate Anonymization process
      setTimeout(() => {
        setUploadProgress(45);
        
        // Simulating requesting signature from backend and uploading
        setTimeout(() => {
          setUploadProgress(85);
          
          setTimeout(() => {
            setUploadProgress(100);
            setIsUploading(false);
            setUploadSuccess(true);
            // Public safe illustration chest xray
            setUploadedUrl("https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop");
          }, 1000);
        }, 12000 / 100);
      }, 800);

    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("Une erreur technique s'est produite lors de l'anonymisation.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/radiology/dashboard" className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Téléverser des images médicales</h1>
            <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Passerelle DICOM Sécurisée & Anonymiseur</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-400" />
            Protocole Shift-Left Actif
          </span>
        </div>
      </header>

      {/* Main Form container */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload and metadata form (2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-glass backdrop-blur-glass">
            
            <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
              <Upload className="h-5 w-5 text-purple-400" />
              <h3 className="font-extrabold text-base tracking-tight">Fiche de Transfert d'Imagerie Clinique</h3>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Select Exam Type */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400">Type d'examen requis</label>
                  <select
                    value={examType}
                    onChange={e => setExamType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-500 text-slate-300 transition-colors"
                  >
                    <option value="Lung X-Ray (Face)">Radiographie Pulmonaire - Face</option>
                    <option value="Knee X-Ray (Profil)">Radiographie Genou - Profil</option>
                    <option value="Abdominal CT Scan">Scanner Abdominal</option>
                    <option value="Brain MRI">IRM Cérébrale</option>
                  </select>
                </div>

                {/* ID Patient */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400">ID Patient (Registre)</label>
                  <input
                    type="text"
                    required
                    value={patientId}
                    onChange={e => setPatientId(e.target.value)}
                    placeholder="Ex: P-103"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-500 text-white transition-colors"
                  />
                </div>

              </div>

              {/* Upload Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400">Fichier DICOM / Image Scannée</label>
                
                <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 bg-slate-950/20 rounded-2xl p-8 text-center transition-colors relative">
                  <input
                    type="file"
                    accept=".dcm,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                      <FileBadge className="h-6 w-6" />
                    </div>
                    {selectedFile ? (
                      <div>
                        <h4 className="font-extrabold text-slate-200 text-xs">{selectedFile.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Taille : {(selectedFile.size / (1024 * 1024)).toFixed(2)} Mo</p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-extrabold text-slate-300 text-xs">Glissez-déposez le cliché médical</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Formates supportés : DICOM (.dcm), PNG, JPG (Max 50Mo)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shift Left Anonymization checklist toggler */}
              <div className="p-4 bg-purple-600/5 border border-purple-500/20 rounded-xl space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-200">Anonymisation Client Shift-Left (Recommandé)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                        Le chiffrement et le hachage des métadonnées s'effectuent localement dans votre navigateur avant transfert. Aucune donnée privée en clair n'atteint le cloud.
                      </p>
                    </div>
                  </div>
                  
                  <input
                    type="checkbox"
                    checked={anonymizeChecked}
                    onChange={e => setAnonymizeChecked(e.target.checked)}
                    className="h-4 w-4 bg-slate-900 border-slate-800 rounded accent-purple-500"
                  />
                </div>
              </div>

              {/* Upload Action buttons */}
              <div className="flex justify-end gap-4">
                <Link
                  href="/radiology/dashboard"
                  className="h-12 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                >
                  Annuler
                </Link>
                
                <button
                  type="submit"
                  disabled={isUploading || uploadSuccess}
                  className="h-12 px-8 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/10 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Anonymisation & Envoi ({uploadProgress}%)
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle className="h-4.5 w-4.5 text-white" />
                      Image archivée en PACS !
                    </>
                  ) : (
                    <>
                      Anonymiser & Téléverser (PACS)
                    </>
                  )}
                </button>
              </div>

            </form>

          </section>

        </div>

        {/* Right Side: Shift-Left Anonymizer preview (1 column) */}
        <div className="lg:col-span-1 space-y-6">
          
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col justify-between shadow-glass backdrop-blur-glass min-h-[450px]">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-4">
                <EyeOff className="h-5 w-5 text-purple-400" />
                <h3 className="font-extrabold text-sm text-slate-200">Aperçu de l'Anonymisation</h3>
              </div>

              {anonymizeChecked ? (
                <div className="space-y-4 text-[10px]">
                  
                  <div className="p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl space-y-2">
                    <span className="font-bold text-red-400 block uppercase tracking-wider">Données En Clair Détectées</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono">
                      <span>Nom:</span> <span className="text-slate-200">{originalMetadata.patientName}</span>
                      <span>Num. SS:</span> <span className="text-slate-200">{originalMetadata.socialSecurity}</span>
                      <span>Lieu:</span> <span className="text-slate-200 leading-tight">{originalMetadata.location}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-2">
                    <span className="font-bold text-emerald-400 block uppercase tracking-wider">Transmis vers Cloudinary</span>
                    <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono">
                      <span>Nom:</span> <span className="text-emerald-400 font-extrabold">{anonymizedMetadata.patientName}</span>
                      <span>Num. SS:</span> <span className="text-emerald-400">{anonymizedMetadata.socialSecurity}</span>
                      <span>Lieu:</span> <span className="text-emerald-400">{anonymizedMetadata.location}</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <AlertTriangle className="h-10 w-10 mx-auto opacity-30 text-amber-500 animate-bounce" />
                  <h4 className="font-bold text-xs text-slate-400">Anonymisation désactivée</h4>
                  <p className="text-[11px] leading-relaxed">
                    Attention : Désactiver l'anonymisation expose l'établissement à des infractions réglementaires strictes de protection des données de santé (CDP Sénégal).
                  </p>
                </div>
              )}
            </div>

            {uploadSuccess && uploadedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-slate-200 mt-6 space-y-2"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle className="h-4.5 w-4.5" />
                  Enregistrement Réussi !
                </div>
                <p className="text-[10px] text-slate-400">L'image a été chiffrée puis stockée sous l'identifiant PACS unique.</p>
                <Link href="/radiology/dashboard" className="text-xs text-purple-400 hover:underline font-bold block pt-1">
                  Retourner à la file d'attente
                </Link>
              </motion.div>
            )}

          </section>

        </div>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Passerelle Sécurisée PACS.
      </footer>
    </div>
  );
}
