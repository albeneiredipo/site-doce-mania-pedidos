
import React, { useState } from 'react';
import { VariationPreset, ProductVariant } from '../types';

interface EditVariationsViewProps {
  presets: VariationPreset[];
  setPresets: React.Dispatch<React.SetStateAction<VariationPreset[]>>;
  onBack: () => void;
}

const EditVariationsView: React.FC<EditVariationsViewProps> = ({ presets, setPresets, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newVariants, setNewVariants] = useState<ProductVariant[]>([{ id: '1', name: '', price: 0, isActive: true }]);

  const handleAddVariantRow = () => {
    setNewVariants([...newVariants, { id: Date.now().toString(), name: '', price: 0, isActive: true }]);
  };

  const handleVariantChange = (id: string, field: keyof ProductVariant, value: any) => {
    setNewVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleSavePreset = () => {
    if (!newName) return;
    const preset: VariationPreset = {
      id: Date.now().toString(),
      name: newName,
      variants: newVariants.filter(v => v.name)
    };
    setPresets([...presets, preset]);
    setIsAdding(false);
    setNewName('');
    setNewVariants([{ id: '1', name: '', price: 0, isActive: true }]);
  };

  const handleRemovePreset = (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o preset "${name}"?`)) {
      setPresets(presets.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto bg-background-light dark:bg-background-dark min-h-screen pb-24 text-neutral-900 dark:text-neutral-50">
      <div className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Presets de Variação</h1>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {isAdding ? (
          <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-primary/50 shadow-lg animate-in slide-in-from-top-4 duration-300">
            <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">add_circle</span>
              Criar Novo Preset
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-sub mb-1.5 uppercase tracking-wider">Nome do Grupo</label>
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Tamanhos de Bebida"
                  className="w-full rounded-xl border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 px-4 py-3 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-text-sub uppercase tracking-wider">Variações Incluídas</label>
                {newVariants.map(v => (
                  <div key={v.id} className="flex gap-2">
                    <input 
                      value={v.name}
                      onChange={(e) => handleVariantChange(v.id, 'name', e.target.value)}
                      placeholder="Nome (Ex: 300ml)"
                      className="flex-1 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 px-3 py-2 text-xs"
                    />
                    <input 
                      type="number"
                      value={v.price}
                      onChange={(e) => handleVariantChange(v.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="R$"
                      className="w-20 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 px-3 py-2 text-xs"
                    />
                  </div>
                ))}
                <button onClick={handleAddVariantRow} className="text-xs font-bold text-primary flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">add</span> Adicionar Outra
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-sm font-bold border border-border-light dark:border-border-dark rounded-xl">Cancelar</button>
                <button onClick={handleSavePreset} className="flex-1 py-3 text-sm font-bold bg-primary text-black rounded-xl">Salvar</button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Novo Preset de Variação
          </button>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-bold px-1 text-text-sub dark:text-gray-400">Seus Presets</h2>
          {presets.map(preset => (
            <div key={preset.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-base">{preset.name}</h3>
                  <p className="text-xs text-text-sub dark:text-gray-400">{preset.variants.length} variações</p>
                </div>
                <button 
                  onClick={() => handleRemovePreset(preset.id, preset.name)}
                  className="p-1 text-red-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {preset.variants.map(v => (
                  <span key={v.id} className="bg-neutral-100 dark:bg-black/30 px-2 py-1 rounded-md text-[10px] font-medium border border-neutral-200 dark:border-white/5">
                    {v.name} - R${v.price.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {presets.length === 0 && !isAdding && (
            <div className="text-center py-10 text-text-sub dark:text-gray-500 italic">
              Nenhum preset cadastrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditVariationsView;
