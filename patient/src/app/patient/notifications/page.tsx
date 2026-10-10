'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Calendar,
  Pill,
  FileText,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Trash2,
  Check,
  X,
  Filter,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

type NotifCategory = 'all' | 'rdv' | 'ordonnance' | 'medical' | 'systeme';
type NotifPriority = 'urgent' | 'info' | 'success' | 'warning';

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  category: Omit<NotifCategory, 'all'>;
  priority: NotifPriority;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
  icon: 'calendar' | 'pill' | 'file' | 'heart' | 'alert' | 'sparkles' | 'info' | 'check';
}

const INITIAL_NOTIFS: Notification[] = [
  {
    id: 'n1',
    title: 'Rappel rendez-vous demain',
    body: 'Vous avez un rendez-vous avec Dr. Abdoulaye Diallo demain a 09h30. Cabinet Medical Sunu, Dakar.',
    time: 'Aujourd\'hui, 14h22',
    category: 'rdv',
    priority: 'urgent',
    read: false,
    icon: 'calendar',
    actionLabel: 'Voir le RDV',
    actionHref: '/patient/appointments',
  },
  {
    id: 'n2',
    title: 'Ordonnance bientot expiree',
    body: 'Votre ordonnance ORD-9201 (Lisinopril + Amlodipine) expire le 12 Juin 2026. Pensez a contacter votre medecin.',
    time: 'Aujourd\'hui, 11h05',
    category: 'ordonnance',
    priority: 'warning',
    read: false,
    icon: 'pill',
    actionLabel: 'Voir l\'ordonnance',
    actionHref: '/patient/prescriptions',
  },
  {
    id: 'n3',
    title: 'Analyse IA de votre dossier',
    body: 'Health AI IA a analyse votre dossier medical et detecte une coherence therapeutique optimale. Aucune interaction medicamenteuse signale.',
    time: 'Hier, 16h48',
    category: 'medical',
    priority: 'success',
    read: false,
    icon: 'sparkles',
    actionLabel: 'Voir le rapport',
    actionHref: '/patient/records',
  },
  {
    id: 'n4',
    title: 'Prise de sang a jeun - Rappel',
    body: 'Votre bilan biologique du 28 Mai necessite d\'etre a jeun depuis 12h. Pensez a vous presenter avant 10h.',
    time: 'Hier, 09h15',
    category: 'medical',
    priority: 'info',
    read: true,
    icon: 'heart',
    actionLabel: 'Voir le dossier',
    actionHref: '/patient/records',
  },
  {
    id: 'n5',
    title: 'Rendez-vous confirme',
    body: 'Votre rendez-vous du 25 Mai 2026 a 09h30 avec Dr. Abdoulaye Diallo a ete confirme avec succes.',
    time: '23 Mai, 10h30',
    category: 'rdv',
    priority: 'success',
    read: true,
    icon: 'check',
    actionLabel: 'Voir le RDV',
    actionHref: '/patient/appointments',
  },
  {
    id: 'n6',
    title: 'Mise a jour de vos conditions',
    body: 'Les conditions generales d\'utilisation de Health AI ont ete mises a jour. Consultez les changements dans votre espace.',
    time: '20 Mai, 08h00',
    category: 'systeme',
    priority: 'info',
    read: true,
    icon: 'info',
  },
];

const PRIORITY_CONFIG: Record<NotifPriority, { bg: string; border: string; iconBg: string; iconColor: string; dot: string }> = {
  urgent:  { bg: 'bg-rose-50',    border: 'border-rose-200',    iconBg: 'bg-rose-100',    iconColor: 'text-rose-600',    dot: 'bg-rose-500' },
  warning: { bg: 'bg-amber-50',   border: 'border-amber-200',   iconBg: 'bg-amber-100',   iconColor: 'text-amber-600',   dot: 'bg-amber-500' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', dot: 'bg-emerald-500' },
  info:    { bg: 'bg-sky-50',     border: 'border-sky-200',     iconBg: 'bg-sky-100',     iconColor: 'text-sky-600',     dot: 'bg-sky-400' },
};

const CAT_CONFIG: Record<string, { label: string; color: string }> = {
  rdv:        { label: 'Rendez-vous', color: 'bg-blue-100 text-blue-700' },
  ordonnance: { label: 'Ordonnance',  color: 'bg-violet-100 text-violet-700' },
  medical:    { label: 'Medical',     color: 'bg-teal-100 text-teal-700' },
  systeme:    { label: 'Systeme',     color: 'bg-slate-100 text-slate-600' },
};

function NotifIcon({ icon, cls }: { icon: Notification['icon']; cls: string }) {
  const map = {
    calendar: Calendar,
    pill:     Pill,
    file:     FileText,
    heart:    HeartPulse,
    alert:    AlertTriangle,
    sparkles: Sparkles,
    info:     Info,
    check:    CheckCircle2,
  };
  const Icon = map[icon];
  return <Icon className={cls} />;
}

export default function PatientNotifications() {
  const { initialize } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [activeTab, setActiveTab] = useState<NotifCategory>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState({
    push: true,
    email: true,
    sms: false,
    rdv: true,
    ordonnance: true,
    medical: true,
    systeme: false,
  });

  useEffect(() => {
    initialize();
    setMounted(true);
  }, [initialize]);

  if (!mounted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white animate-pulse">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifs.filter(n => !n.read).length;

  const filtered = notifs.filter(n => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifs([]);

  const tabs: { key: NotifCategory; label: string; count?: number }[] = [
    { key: 'all',        label: 'Toutes',        count: notifs.length },
    { key: 'rdv',        label: 'RDV',            count: notifs.filter(n => n.category === 'rdv').length },
    { key: 'ordonnance', label: 'Ordonnances',    count: notifs.filter(n => n.category === 'ordonnance').length },
    { key: 'medical',    label: 'Medical',        count: notifs.filter(n => n.category === 'medical').length },
    { key: 'systeme',    label: 'Systeme',        count: notifs.filter(n => n.category === 'systeme').length },
  ];

  return (
    <div className="min-h-full bg-slate-50 pb-20 text-slate-900">

      {/* HERO HEADER */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 pt-5 pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  <Bell className="w-3 h-3" />
                  Centre de Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                    {unreadCount} non lues
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Alertes medicales, rappels de rendez-vous et mises a jour de votre dossier.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 mt-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tout marquer lu</span>
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl border text-slate-600 text-xs font-bold transition-colors cursor-pointer ${
                  showSettings ? 'bg-teal-50 border-teal-200 text-teal-700' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {[
              { label: 'Non lues',  value: String(unreadCount),                     color: 'text-rose-600' },
              { label: 'Ce mois',   value: String(notifs.length),                   color: 'text-teal-700' },
              { label: 'Urgentes',  value: String(notifs.filter(n => n.priority === 'urgent').length), color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5">
                <span className="text-[10px] font-semibold text-slate-500 block">{s.label}</span>
                <span className={`text-lg font-extrabold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 space-y-4">

        {/* SETTINGS PANEL */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-5">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-teal-600" />
                  Preferences de Notifications
                </h3>

                {/* Canaux */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Canaux d&apos;envoi</p>
                  <div className="space-y-2">
                    {[
                      { key: 'push' as const,  label: 'Notifications Push',     desc: 'Alertes instantanees sur votre appareil', icon: Smartphone },
                      { key: 'email' as const, label: 'Notifications par Email', desc: 'Recevez un recapitulatif quotidien',       icon: Mail },
                      { key: 'sms' as const,   label: 'Notifications par SMS',   desc: 'Rappels uniquement pour les urgences',    icon: Volume2 },
                    ].map(({ key, label, desc, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{label}</p>
                            <p className="text-[10px] text-slate-400">{desc}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                          className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${prefs[key] ? 'bg-teal-500' : 'bg-slate-200'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${prefs[key] ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Categories actives</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'rdv' as const,        label: 'Rendez-vous',  icon: Calendar },
                      { key: 'ordonnance' as const,  label: 'Ordonnances', icon: Pill },
                      { key: 'medical' as const,     label: 'Medical',     icon: HeartPulse },
                      { key: 'systeme' as const,     label: 'Systeme',     icon: Info },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                        className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                          prefs[key]
                            ? 'bg-teal-50 border-teal-200 text-teal-800'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                        {prefs[key] ? <Check className="w-3 h-3 ml-auto text-teal-600" /> : <X className="w-3 h-3 ml-auto text-slate-300" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FILTER TABS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
            {notifs.length > 0 && (
              <button
                onClick={clearAll}
                className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-3 h-3" />
                Tout effacer
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-extrabold text-slate-700">Aucune notification</p>
            <p className="text-xs text-slate-400 mt-1">
              Vous etes a jour ! Les nouvelles alertes apparaitront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {filtered.map((notif, idx) => {
                const pc = PRIORITY_CONFIG[notif.priority];
                const cat = CAT_CONFIG[notif.category as string];
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40, height: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`relative bg-white rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden transition-all ${
                      notif.read ? 'border-slate-200' : `${pc.border} ring-1 ring-inset ${pc.border}`
                    }`}
                    onClick={() => markRead(notif.id)}
                  >
                    {/* Unread indicator bar */}
                    {!notif.read && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${pc.dot}`} />
                    )}

                    <div className="flex gap-3 p-4 pl-5">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        notif.read ? 'bg-slate-100' : pc.iconBg
                      }`}>
                        <NotifIcon
                          icon={notif.icon}
                          cls={`w-4 h-4 ${notif.read ? 'text-slate-400' : pc.iconColor}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className={`text-xs font-extrabold leading-snug ${notif.read ? 'text-slate-600' : 'text-slate-900'}`}>
                              {notif.title}
                            </h4>
                            {!notif.read && (
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pc.dot}`} />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                            className="p-0.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className={`text-[11px] leading-relaxed mt-1 ${notif.read ? 'text-slate-400' : 'text-slate-600'}`}>
                          {notif.body}
                        </p>

                        <div className="flex items-center justify-between mt-2.5 gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cat.color}`}>
                              {cat.label}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock className="w-3 h-3" />
                              {notif.time}
                            </div>
                          </div>
                          {notif.actionLabel && (
                            <a
                              href={notif.actionHref}
                              onClick={e => e.stopPropagation()}
                              className={`inline-flex items-center gap-1 text-[10px] font-bold transition-colors ${
                                notif.read ? 'text-slate-400 hover:text-teal-600' : 'text-teal-700 hover:text-teal-900'
                              }`}
                            >
                              {notif.actionLabel}
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* PREFS FOOTER NOTE */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center pb-2">
          <VolumeX className="w-3.5 h-3.5" />
          <span>Gerer vos preferences de notification dans Parametres.</span>
        </div>
      </div>
    </div>
  );
}
