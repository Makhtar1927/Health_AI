'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Truck, 
  ArrowUpRight, 
  Filter, 
  Calendar, 
  X,
  Pill,
  Sparkles,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import PharmacyShell from '@/components/pharmacist/PharmacyShell';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  dosage: string;
  stock: number;
  minStock: number;
  lot: string;
  expiry: string;
  price: number;
  status: 'optimal' | 'low' | 'out';
}

export default function PharmacistInventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'optimal'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal ajouter nouveau lot
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Antibiotique');
  const [newItemQty, setNewItemQty] = useState(50);

  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "INV-001",
      name: "Amoxicilline 500mg Gélules",
      category: "Antibiotique",
      dosage: "Boîte de 12 gélules",
      stock: 120,
      minStock: 30,
      lot: "LOT-2024-AMX89",
      expiry: "12/2027",
      price: 2500,
      status: "optimal"
    },
    {
      id: "INV-002",
      name: "Paracétamol 1g Comprimés",
      category: "Antalgique",
      dosage: "Boîte de 8 comprimés",
      stock: 15,
      minStock: 50,
      lot: "LOT-2024-PAR12",
      expiry: "08/2026",
      price: 1200,
      status: "low"
    },
    {
      id: "INV-003",
      name: "Salbutamol 100µg Aérosol",
      category: "Pneumologie",
      dosage: "Flacon pressurisé 200 doses",
      stock: 4,
      minStock: 20,
      lot: "LOT-2023-SAL04",
      expiry: "04/2026",
      price: 4500,
      status: "out"
    },
    {
      id: "INV-004",
      name: "Artéméther / Luméfantrine 20/120mg",
      category: "Antipaludéen",
      dosage: "Boîte de 24 comprimés dispersibles",
      stock: 85,
      minStock: 25,
      lot: "LOT-2024-PAL99",
      expiry: "11/2027",
      price: 3800,
      status: "optimal"
    },
    {
      id: "INV-005",
      name: "Ciprofloxacine 500mg",
      category: "Antibiotique",
      dosage: "Boîte de 10 comprimés",
      stock: 42,
      minStock: 20,
      lot: "LOT-2024-CIP41",
      expiry: "09/2027",
      price: 3200,
      status: "optimal"
    },
    {
      id: "INV-006",
      name: "Ibuprofène 400mg",
      category: "Anti-inflammatoire",
      dosage: "Boîte de 20 comprimés",
      stock: 8,
      minStock: 30,
      lot: "LOT-2024-IBU18",
      expiry: "05/2026",
      price: 1800,
      status: "low"
    }
  ]);

  const categories = ['all', 'Antibiotique', 'Antalgique', 'Pneumologie', 'Antipaludéen', 'Anti-inflammatoire'];

  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.lot.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchStatus = statusFilter === 'all' ||
                        (statusFilter === 'critical' && (item.status === 'low' || item.status === 'out')) ||
                        (statusFilter === 'optimal' && item.status === 'optimal');
    return matchSearch && matchCat && matchStatus;
  });

  const handleQuickReorder = (id: string, name: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          stock: item.stock + 60,
          status: 'optimal'
        };
      }
      return item;
    }));
    setToastMessage(`Bon de commande grossiste généré (+60 unités) pour ${name}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const newItem: InventoryItem = {
      id: `INV-00${items.length + 1}`,
      name: newItemName,
      category: newItemCategory,
      dosage: "Conditionnement standard",
      stock: Number(newItemQty),
      minStock: 20,
      lot: `LOT-2026-N${Math.floor(100 + Math.random() * 900)}`,
      expiry: "12/2028",
      price: 3000,
      status: newItemQty < 20 ? 'low' : 'optimal'
    };

    setItems([newItem, ...items]);
    setIsAddModalOpen(false);
    setNewItemName('');
    setToastMessage(`Nouveau produit ${newItemName} enregistré en officine.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const criticalCount = items.filter(i => i.status === 'low' || i.status === 'out').length;

  return (
    <PharmacyShell
      title="Gestion des Stocks & Inventaire"
      subtitle="Traçabilité des lots, alertes de péremption & commandes grossistes"
      onQuickAction={() => setIsAddModalOpen(true)}
      quickActionLabel="Ajouter un Médicament"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Toast de confirmation */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-xl bg-violet-50 border border-violet-200 text-violet-950 text-xs font-bold flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-violet-600" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-violet-700 hover:text-violet-900">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Métriques d'inventaire */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider block">
              Références en Rayon
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{items.length}</span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                100% Référencés
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider block">
              Alertes Rupture & Bas
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">{criticalCount}</span>
              <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                Action requise
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider block">
              Prochaine Livraison
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-extrabold text-slate-900">14h30</span>
              <span className="text-[11px] text-violet-700 font-bold bg-violet-50 px-2 py-0.5 rounded-md">
                COPHASE Dakar
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[10px] sm:text-xs text-slate-500 font-extrabold uppercase tracking-wider block">
              Valeur Estimée Stock
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">1 240 000 F</span>
              <span className="text-[10px] text-slate-400 font-semibold">TTC</span>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Champ recherche */}
            <div className="relative w-full md:w-96">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher médicament, DCI, numéro de lot..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
              />
            </div>

            {/* Boutons d'état & Ajout */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'all' ? 'bg-white text-violet-800 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  Tous ({items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('critical')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    statusFilter === 'critical' ? 'bg-white text-amber-700 shadow-xs' : 'hover:text-slate-900'
                  }`}
                >
                  Alertes ({criticalCount})
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs cursor-pointer transition-all shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Nouveau Produit</span>
              </button>
            </div>

          </div>

          {/* Filtres par catégorie */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-extrabold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Catégorie :
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'Toutes catégories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau des médicaments */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Médicament & Forme</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Lot & Péremption</th>
                  <th className="py-3.5 px-4 text-center">Stock Actuel</th>
                  <th className="py-3.5 px-4 text-center">État</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map(item => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Nom & dosage */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                            <Pill className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-black text-slate-900 block">{item.name}</span>
                            <span className="text-[11px] text-slate-400 block">{item.dosage}</span>
                          </div>
                        </div>
                      </td>

                      {/* Catégorie */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                      </td>

                      {/* Lot & Péremption */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[11px] text-slate-700 font-bold block">{item.lot}</span>
                          <span className="text-[10px] text-slate-400 block">Exp : {item.expiry}</span>
                        </div>
                      </td>

                      {/* Stock Actuel */}
                      <td className="py-4 px-4 text-center">
                        <span className="font-black text-sm text-slate-900">{item.stock}</span>
                        <span className="text-[10px] text-slate-400 block">Seuil min : {item.minStock}</span>
                      </td>

                      {/* Statut badge */}
                      <td className="py-4 px-4 text-center">
                        {item.status === 'optimal' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Optimal
                          </span>
                        )}
                        {item.status === 'low' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            Stock Bas
                          </span>
                        )}
                        {item.status === 'out' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                            <TrendingDown className="h-3 w-3 text-rose-600" />
                            Rupture
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          type="button"
                          onClick={() => handleQuickReorder(item.id, item.name)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-violet-800 font-bold text-[11px] inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200/80 hover:border-violet-200"
                        >
                          <Truck className="h-3.5 w-3.5 text-violet-600" />
                          Commander (+60)
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Ajout Nouveau Médicament */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Enregistrer un Médicament</h3>
                    <p className="text-[10px] text-slate-500">Ajout au registre d&apos;inventaire officinal</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Dénomination Commune ou Nom Commercial</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Céfuroxime 500mg"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Famille Thérapeutique</label>
                  <select
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  >
                    <option value="Antibiotique">Antibiotique</option>
                    <option value="Antalgique">Antalgique</option>
                    <option value="Anti-inflammatoire">Anti-inflammatoire</option>
                    <option value="Antipaludéen">Antipaludéen</option>
                    <option value="Pneumologie">Pneumologie</option>
                    <option value="Cardiologie">Cardiologie</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Quantité Initiale Reçue</label>
                  <input
                    type="number"
                    min={1}
                    value={newItemQty}
                    onChange={e => setNewItemQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-violet-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold shadow-sm transition-all"
                  >
                    Valider l&apos;entrée en stock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </PharmacyShell>
  );
}
