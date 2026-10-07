'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Heart,
  MessageSquare,
  Users,
  Activity,
  ShieldAlert,
  Loader2,
  Volume2,
  FileText,
  Plus,
  Send,
  VolumeX,
  Smile,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function DoctorTelemedicine() {
  // Call States
  const [inCall, setInCall] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [vitalsSync, setVitalsSync] = useState(true);

  // Chat/Notes Panel States
  const [activeTab, setActiveTab] = useState<'vital' | 'transcription' | 'chat'>('vital');
  const [chatMessage, setChatMessage] = useState('');
  const [chatList, setChatList] = useState([
    { sender: 'Patient', time: '14:02', text: "Docteur, j'ai bien pris mon traitement ce matin mais ma tension reste élevée." },
    { sender: 'Docteur', time: '14:03', text: "Entendu. Avez-vous mesuré votre tension il y a 30 minutes ?" }
  ]);

  // Voice transcript simulation
  const [transcript, setTranscript] = useState<string[]>([
    "[14:00] Dr. Awa Ndiaye : Bonjour M. Diop. Comment vous sentez-vous ?",
    "[14:01] Cheikh Tidiane Diop : Bonjour docteur. J'ai encore des maux de tête importants et des vertiges.",
    "[14:02] Dr. Awa Ndiaye : Avez-vous pu relever votre tension artérielle avec votre tensiomètre connecté ?"
  ]);

  useEffect(() => {
    if (!inCall) return;

    // Simulate real-time speech transcription every 10 seconds
    const intervals = [
      " [14:04] Cheikh Tidiane Diop : Oui, j'ai mesuré 165 sur 95 il y a quelques minutes.",
      " [14:05] Dr. Awa Ndiaye : C'est effectivement trop élevé. Avez-vous de la fièvre ou des nausées ?",
      " [14:06] Cheikh Tidiane Diop : Pas de fièvre docteur, mais de légères nausées au lever."
    ];

    let current = 0;
    const timer = setInterval(() => {
      if (current < intervals.length) {
        setTranscript(prev => [...prev, intervals[current]]);
        current++;
      }
    }, 12000);

    return () => clearInterval(timer);
  }, [inCall]);

  const handleEndCall = () => {
    setInCall(false);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setChatList(prev => [...prev, {
      sender: 'Docteur',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      text: chatMessage
    }]);
    setChatMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/doctor/dashboard" className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Salon de Téléconsultation</h1>
            <p className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">WebRTC Sécurisé de bout en bout</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${inCall ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
            {inCall ? "CONSULTATION EN COURS" : "COMMUNICATION TERMINÉE"}
          </span>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="max-w-7xl mx-auto w-full flex-grow px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* WebRTC Video Room Panel (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-slate-900 rounded-3xl border border-slate-800/80 p-6 flex flex-col justify-between items-center relative overflow-hidden shadow-2xl min-h-[500px]">
            
            {/* Primary Large Video (Patient Feed) */}
            <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
              {inCall ? (
                videoEnabled ? (
                  <div 
                    className="w-full h-full bg-cover bg-center opacity-85"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop')` }}
                  />
                ) : (
                  <div className="text-center text-slate-500 flex flex-col items-center gap-3">
                    <VideoOff className="h-16 w-16 opacity-30 text-sky-400" />
                    <p className="text-xs">Le flux vidéo du patient est désactivé</p>
                  </div>
                )
              ) : (
                <div className="text-center text-slate-500 flex flex-col items-center gap-4 p-8">
                  <PhoneOff className="h-16 w-16 text-red-500 bg-red-500/10 p-4 rounded-full border border-red-500/20" />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-300">Téléconsultation Terminée</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">La connexion WebRTC avec le patient a été fermée. Vous pouvez retourner au tableau de bord pour rédiger votre compte-rendu.</p>
                  </div>
                  <a href="/doctor/dashboard" className="h-10 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center transition-colors">
                    Retourner au tableau de bord
                  </a>
                </div>
              )}
            </div>

            {/* Overlap PIP Box (Doctor's Local Feed) */}
            {inCall && videoEnabled && (
              <div className="absolute bottom-6 right-6 w-36 h-48 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl z-10">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop')` }}
                />
                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] text-white font-bold uppercase tracking-wider">
                  Moi
                </div>
              </div>
            )}

            {/* Float Overlay Info (Vitals Watermark) */}
            {inCall && vitalsSync && (
              <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-sm border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-2">
                <span className="text-[8px] text-sky-400 font-extrabold uppercase tracking-wider block">Bio-capteurs Patient</span>
                
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-red-400 animate-pulse">
                    <Heart className="h-4 w-4 fill-red-500/10" />
                    <span>82 bpm</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Activity className="h-4 w-4" />
                    <span>Tension: 16.5 / 9.5</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action WebRTC Controller Buttons */}
            {inCall && (
              <div className="relative z-10 mt-auto bg-black/50 backdrop-blur-md border border-slate-800 p-4 rounded-3xl flex gap-4 shadow-2xl items-center mb-2">
                {/* Toggle Mic */}
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    audioEnabled 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>

                {/* Toggle Video */}
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    videoEnabled 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                      : 'bg-red-600 hover:bg-red-500 text-white'
                  }`}
                >
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>

                {/* Share Screen */}
                <button
                  onClick={() => setScreenShare(!screenShare)}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    screenShare 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <Monitor className="h-5 w-5" />
                </button>

                {/* End call button */}
                <button
                  onClick={handleEndCall}
                  className="h-12 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  <PhoneOff className="h-5 w-5" />
                  Raccrocher
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Side: Interactive Bio Dashboard Panel (1 Column) */}
        <div className="lg:col-span-1 space-y-6">
          
          <section className="bg-slate-900 rounded-3xl border border-slate-800/80 flex flex-col h-[500px] shadow-glass backdrop-blur-glass overflow-hidden">
            
            {/* Tabs Header bar */}
            <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-900/60">
              <button
                onClick={() => setActiveTab('vital')}
                className={`py-3 text-[10px] font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'vital' ? 'border-sky-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Capteurs
              </button>
              <button
                onClick={() => setActiveTab('transcription')}
                className={`py-3 text-[10px] font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'transcription' ? 'border-sky-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Transcription
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-3 text-[10px] font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'chat' ? 'border-sky-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                Tchat Patient
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {/* Tab 1: Bio Sensor Vitals */}
              {activeTab === 'vital' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">État physiologiques (IoT)</h4>
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">Connecté</span>
                  </div>

                  <div className="space-y-4">
                    {/* Heart Rate */}
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Fréquence Cardiaque</span>
                        <span className="text-xl font-black text-red-400 mt-1 block">82 bpm</span>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center">
                        <Heart className="h-5 w-5 fill-red-500/5 animate-pulse" />
                      </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Tension Artérielle</span>
                        <span className="text-xl font-black text-emerald-400 mt-1 block">16.5 / 9.5</span>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <Activity className="h-5 w-5" />
                      </div>
                    </div>

                    {/* SpO2 Oxygen */}
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block uppercase">Saturation Oxygène (SpO2)</span>
                        <span className="text-xl font-black text-sky-400 mt-1 block">98%</span>
                      </div>
                      <div className="h-10 w-10 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold text-xs">
                        O₂
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Speech to Text Clinical Transcript */}
              {activeTab === 'transcription' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Dictée vocale en continu</h4>
                    <span className="text-[8px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold animate-pulse flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
                      REC
                    </span>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 max-h-[340px] overflow-y-auto font-mono text-[10px] text-slate-400 leading-relaxed scrollbar-thin">
                    {transcript.map((line, idx) => (
                      <p key={idx} className="border-b border-slate-900 pb-1.5 last:border-0">{line}</p>
                    ))}
                    {inCall && (
                      <div className="flex items-center gap-2.5 text-slate-500 italic mt-4">
                        <Loader2 className="h-3 w-3 animate-spin text-sky-400" />
                        Écoute du signal audio WebRTC...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Tchat Text Secure */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="space-y-4 max-h-[290px] overflow-y-auto pr-1">
                    {chatList.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === 'Docteur' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 text-[8px] text-slate-500 font-bold mb-1">
                          <span>{msg.sender}</span>
                          <span>&bull;</span>
                          <span>{msg.time}</span>
                        </div>
                        <p className={`p-3 rounded-xl text-xs max-w-[90%] leading-relaxed ${
                          msg.sender === 'Docteur' 
                            ? 'bg-sky-600 text-white rounded-tr-none' 
                            : 'bg-slate-950 border border-slate-850 text-slate-300 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Send Form */}
                  <form onSubmit={handleSendChat} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={e => setChatMessage(e.target.value)}
                      placeholder="Tapez un message..."
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-white"
                    />
                    <button type="submit" className="h-8 w-8 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition-colors cursor-pointer shadow-lg flex-shrink-0">
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </div>

          </section>

        </div>

      </main>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800">
        &copy; {new Date().getFullYear()} Sunu Santé - Téléconsultation Sécurisée RTC.
      </footer>
    </div>
  );
}
