
import React, { useState } from 'react';

interface EditCategoriesViewProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  onBack: () => void;
}

const EditCategoriesView: React.FC<EditCategoriesViewProps> = ({ categories, setCategories, onBack }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleRemove = (cat: string) => {
    if (confirm(`Deseja realmente excluir a marca "${cat}"? Isso não afetará os produtos já cadastrados, mas eles ficarão sem categoria válida no filtro.`)) {
      setCategories(categories.filter(c => c !== cat));
    }
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto bg-background-light dark:bg-background-dark min-h-screen pb-24 text-neutral-900 dark:text-neutral-50">
      <div className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Gerenciar Marcas</h1>
      </div>

      <div className="p-4 flex flex-col gap-6">
        <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
          <label className="block text-sm font-bold mb-3">Nova Marca</label>
          <div className="flex gap-2">
            <input 
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ex: Coca-Cola, Elma Chips, Nestlé..."
              className="flex-1 rounded-xl border-border-light dark:border-border-dark bg-background-light dark:bg-black/20 px-4 py-3 text-sm focus:ring-primary focus:border-primary"
            />
            <button 
              onClick={handleAdd}
              className="px-4 bg-primary text-black font-bold rounded-xl active:scale-95 transition-transform"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold px-1 text-text-sub dark:text-gray-400">Marcas Existentes</h2>
          {categories.map(cat => (
            <div key={cat} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-border-light dark:border-border-dark rounded-xl group transition-all hover:border-primary/30 shadow-sm">
              <span className="font-medium">{cat}</span>
              <button 
                onClick={() => handleRemove(cat)}
                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-10 text-text-sub dark:text-gray-500 italic">
              Nenhuma marca cadastrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCategoriesView;
