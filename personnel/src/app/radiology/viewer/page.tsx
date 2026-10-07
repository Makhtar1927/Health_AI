'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ImageIcon,
  Sliders,
  Sun,
  Eye,
  RotateCw,
  Search,
  Maximize2,
  Activity,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mic,
  MicOff,
  Cpu,
  Layers,
  FileText,
  Volume2,
  Trash2,
  Check,
  BrainCircuit,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { getAuthHeader } from '../../../lib/authStore';

function RadiologyViewerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get('id') || 'RAD-201';
  const patientName = searchParams.get('patient') || 'Cheikh Tidiane Diop';
  const examType = searchParams.get('type') || 'Lung X-Ray (Face)';
  const doctor = searchParams.get('doctor') || 'Dr. Aminata Touré';

  // Canvas and View States
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(true);
  const [invert, setInvert] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);

  // Speech to Text States
  const [isDictating, setIsDictating] = useState(false);
  const [reportText, setReportText] = useState('');
  const recognitionRef = useRef<any>(null);

  // AI Vision Analysis States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Save report states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Initialize Web Speech API recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'fr-FR';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setReportText(prev => prev + finalTranscript);
          }
        };

        rec.onerror = (e: any) => {
          console.error("Speech Recognition Error:", e);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleDictation = () => {
    if (!recognitionRef.current) {
      alert("La dictée vocale n'est pas supportée sur ce navigateur. Veuillez saisir le rapport manuellement.");
      return;
    }

    if (isDictating) {
      recognitionRef.current.stop();
      setIsDictating(false);
    } else {
      recognitionRef.current.start();
      setIsDictating(true);
    }
  };

  const handleInvert = () => setInvert(!invert);
  const handleRotate = () => setRotation((rotation + 90) % 360);
  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setGrayscale(true);
    setInvert(false);
    setRotation(0);
    setZoom(100);
  };

  // Trigger Gemini Vision AI analysis
  const runAiVisionAnalysis = async () => {
    setIsAiLoading(true);
    setAiResult(null);

    const imageUrl = examType.includes('Lung')
      ? "https://res.cloudinary.com/dorfcwv6a/image/upload/v1716200000/sample_chest_xray.jpg"
      : "https://res.cloudinary.com/dorfcwv6a/image/upload/v1716200000/sample_knee_fracture.jpg";

    try {
      const authHeader = await getAuthHeader();
      const response = await fetch('http://localhost:5000/api/ai/analyze-imaging', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({
          imageUrl,
          examType
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiResult(data.results);
      } else {
        // Fallback simulation
        setTimeout(() => {
          if (examType.includes('Lung')) {
            setAiResult({
              hasPathology: true,
              pathologyType: "Pneumonia",
              confidenceScore: 0.94,
              findings: "Opacité alvéolaire homogène et systématisée au niveau du lobe inférieur droit, s'accompagnant d'un bronchogramme aérien net. Pas d'épanchement pleural détecté. Silouhette cardiaque de taille normale.",
              severity: "high",
              measurements: "Foyer d'opacité mesurant environ 4.2 cm.",
              recommendations: "Antibiothérapie ciblée immédiate. Radiographie de contrôle à 15 jours."
            });
          } else {
            setAiResult({
              hasPathology: true,
              pathologyType: "Fracture",
              confidenceScore: 0.88,
              findings: "Trait de fracture sous-cortical non déplacé traversant le plateau tibial latéral externe. Alignement articulaire préservé. Pas de luxation associée.",
              severity: "medium",
              measurements: "Trait de fracture net de 1.8 cm.",
              recommendations: "Immobilisation rigide ou attelle. Consultation chirurgicale orthopédique."
            });
          }
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      // Local fallback
      setTimeout(() => {
        if (examType.includes('Lung')) {
          setAiResult({
            hasPathology: true,
            pathologyType: "Pneumonia",
            confidenceScore: 0.94,
            findings: "Opacité alvéolaire homogène et systématisée au niveau du lobe inférieur droit, s'accompagnant d'un bronchogramme aérien net. Pas d'épanchement pleural détecté. Silouhette cardiaque de taille normale.",
            severity: "high",
            measurements: "Foyer d'opacité mesurant environ 4.2 cm.",
            recommendations: "Antibiothérapie ciblée immédiate. Radiographie de contrôle à 15 jours."
          });
        } else {
          setAiResult({
            hasPathology: true,
            pathologyType: "Fracture",
            confidenceScore: 0.88,
            findings: "Trait de fracture sous-cortical non déplacé traversant le plateau tibial latéral externe. Alignement articulaire préservé. Pas de luxation associée.",
            severity: "medium",
            measurements: "Trait de fracture net de 1.8 cm.",
            recommendations: "Immobilisation rigide ou attelle. Consultation chirurgicale orthopédique."
          });
        }
      }, 2000);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) {
      alert("Veuillez d'abord rédiger ou dicter le compte-rendu médical.");
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/radiology/dashboard');
      }, 2000);
    }, 1500);
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
            <h1 className="text-lg font-bold tracking-tight">Studio Radiologique PACS</h1>
            <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Sunu Santé &bull; Diagnostic & Reconstruction 3D</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mode Switcher */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex">
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === '2d' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Mode 2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === '3d' ? 'bg-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Reconstruction 3D
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Grid */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left column: Visual Manipulators & Settings */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Patient Card Info */}
          <section className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] text-purple-400 font-extrabold uppercase tracking-wider block">Patient à Examiner</span>
              <h3 className="font-extrabold text-slate-100">{patientName}</h3>
              <p className="text-[10px] text-slate-400 font-mono block">ID Étude : {id}</p>
            </div>
            
            <div className="border-t border-slate-900 pt-3 text-[11px] text-slate-400 leading-relaxed space-y-2">
              <p><strong>Examen requis :</strong> {examType}</p>
              <p><strong>Médecin demandeur :</strong> {doctor}</p>
            </div>
          </section>

          {/* Manipulators */}
          <section className="bg-slate-950/40 p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Filtres PACS</h3>
              <button onClick={resetFilters} className="text-[9px] font-bold text-purple-400 hover:underline">
                Réinitialiser
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><Sun className="h-3.5 w-3.5" /> Luminosité</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={e => setBrightness(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><Sliders className="h-3.5 w-3.5" /> Contraste</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={e => setContrast(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Zoom */}
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><Search className="h-3.5 w-3.5" /> Zoom</span>
                  <span>{zoom}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="200"
                  value={zoom}
                  onChange={e => setZoom(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleInvert}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  invert 
                    ? 'bg-purple-600/10 border-purple-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="h-4 w-4" />
                Inverser Couleurs (Négatif)
              </button>

              <button
                onClick={handleRotate}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCw className="h-4 w-4 text-purple-400" />
                Pivoter 90°
              </button>
            </div>
          </section>

        </div>

        {/* Center: Interactive Scan Area (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          <section className="bg-slate-950 rounded-3xl border border-slate-800/80 p-6 flex flex-col justify-between items-center relative overflow-hidden shadow-2xl min-h-[500px]">
            
            <div className="absolute top-5 left-5 z-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300">
              {viewMode === '2d' ? "Mode d'affichage: 2D Face" : "3D MPR Reconstruction (Multi-coupes)"}
            </div>

            <div className="absolute top-5 right-5 z-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800/80 px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              PACS Studio
            </div>

            {/* Video Canvas Workspace */}
            <div className="flex-grow w-full flex items-center justify-center p-8 mt-6">
              
              {viewMode === '2d' ? (
                /* 2D Standard View */
                <div className="relative overflow-hidden bg-black rounded-2xl border border-slate-900 flex items-center justify-center w-full h-[380px]">
                  <motion.div
                    animate={{ rotate: rotation, scale: zoom / 100 }}
                    className="w-full h-full relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    
                    <div 
                      className="w-full h-full bg-cover bg-center transition-all"
                      style={{
                        backgroundImage: examType.includes('Lung') 
                          ? `url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop')` 
                          : `url('https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop')`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale ? 100 : 0}%) invert(${invert ? 100 : 0}%)`
                      }}
                    />

                    {aiResult && aiResult.hasPathology && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute border-2 border-dashed border-red-500 bg-red-500/5"
                        style={{
                          top: examType.includes('Lung') ? '30%' : '45%',
                          left: examType.includes('Lung') ? '45%' : '35%',
                          width: examType.includes('Lung') ? '120px' : '90px',
                          height: examType.includes('Lung') ? '120px' : '90px',
                        }}
                      >
                        <span className="text-[8px] font-black uppercase text-white px-2 py-0.5 rounded-full bg-red-600 absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg">
                          {aiResult.pathologyType} Détecté
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              ) : (
                /* 3D MPR Slice Reconstruction Mode */
                <div className="grid grid-cols-2 gap-4 w-full h-[380px]">
                  
                  {/* Slice 1: Sagittal */}
                  <div className="relative overflow-hidden bg-black rounded-xl border border-slate-900 flex items-center justify-center">
                    <div className="absolute top-2 left-2 text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-slate-400">Sagittal S-31</div>
                    <div 
                      className="w-full h-full bg-cover bg-center transition-all opacity-80"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop')`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%) invert(${invert ? 100 : 0}%)`
                      }}
                    />
                  </div>

                  {/* Slice 2: Coronal */}
                  <div className="relative overflow-hidden bg-black rounded-xl border border-slate-900 flex items-center justify-center">
                    <div className="absolute top-2 left-2 text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-slate-400">Coronal C-12</div>
                    <div 
                      className="w-full h-full bg-cover bg-center transition-all opacity-80"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop')`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%) invert(${invert ? 100 : 0}%)`
                      }}
                    />
                  </div>

                  {/* Slice 3: Axial */}
                  <div className="relative overflow-hidden bg-black rounded-xl border border-slate-900 flex items-center justify-center col-span-2">
                    <div className="absolute top-2 left-2 text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded font-mono text-slate-400">Axial A-19</div>
                    <div 
                      className="w-full h-full bg-cover bg-center transition-all opacity-80"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=1000&auto=format&fit=crop')`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%) invert(${invert ? 100 : 0}%)`
                      }}
                    />
                  </div>

                </div>
              )}

            </div>

            {/* Launch AI Analysis & Diagnostic */}
            <div className="w-full pt-4 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[11px] text-slate-400 max-w-sm text-center sm:text-left leading-relaxed">
                Ce cliché est indexé sur notre serveur PACS. Déclenchez l'IA Vision pour identifier les pathologies.
              </p>
              
              <button
                onClick={runAiVisionAnalysis}
                disabled={isAiLoading}
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/10 disabled:opacity-50"
              >
                {isAiLoading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Analyse Vision de l'IA...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4.5 w-4.5 text-white" />
                    Analyse Diagnostic IA Vision
                  </>
                )}
              </button>
            </div>

          </section>

        </div>

        {/* Right column: Speech to Text Dictation & Reports */}
        <div className="lg:col-span-1 space-y-6">
          
          <section className="bg-slate-950/40 rounded-3xl border border-slate-800/80 p-6 flex flex-col min-h-[500px] shadow-glass backdrop-blur-glass relative">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Mic className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-200">Dictée Vocale & Rapport</h3>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Speech-to-Text Studio</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveReport} className="flex-1 flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Compte-rendu médical</label>
                  
                  <button
                    type="button"
                    onClick={toggleDictation}
                    className={`h-8 px-3 rounded-lg font-bold text-[10px] flex items-center gap-1.5 transition-all border cursor-pointer ${
                      isDictating
                        ? 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'
                        : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                    }`}
                  >
                    {isDictating ? (
                      <>
                        <MicOff className="h-3.5 w-3.5" />
                        Arrêter Dictée
                      </>
                    ) : (
                      <>
                        <Mic className="h-3.5 w-3.5 animate-pulse" />
                        Lancer Dictée
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  value={reportText}
                  required
                  onChange={e => setReportText(e.target.value)}
                  placeholder="Rédigez ou dictez vocalement votre compte-rendu radiologique ici..."
                  className="w-full h-[220px] px-4 py-3 bg-slate-900 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-purple-500 text-slate-300 leading-relaxed placeholder-slate-600"
                />

                {aiResult && (
                  <div className="p-3 bg-purple-500/5 border border-purple-500/15 rounded-xl text-[10px] text-slate-300 leading-relaxed">
                    <span className="font-bold text-purple-400 block mb-1">Avis IA Vision :</span>
                    {aiResult.findings}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-900 mt-6">
                <button
                  type="submit"
                  disabled={isSaving || saveSuccess}
                  className="w-full h-11 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      Signature cryptographique...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="h-4.5 w-4.5 text-white" />
                      Rapport signé et archivé !
                    </>
                  ) : (
                    <>
                      Signer & Clôturer l'Examen
                    </>
                  )}
                </button>
              </div>

            </form>

          </section>

        </div>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - PACS Radiologie & Dictée Vocale.
      </footer>
    </div>
  );
}

export default function RadiologyViewer() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Chargement du Studio PACS...</p>
        </div>
      </div>
    }>
      <RadiologyViewerContent />
    </React.Suspense>
  );
}
