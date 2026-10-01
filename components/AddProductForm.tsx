
import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductVariant, VariationPreset } from '../types';
import { supabase } from '../supabase';

interface AddProductFormProps {
  categories: string[];
  presets: VariationPreset[];
  storageReady?: boolean | 'error';
  productToEdit: Product | null;
  onSave: (product: Product) => Promise<void>;
  onCancel: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ categories, presets, productToEdit, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([{ id: Date.now().toString(), name: 'Padrão', price: 0, isActive: true, units_per_box: 1 }]);
  const [showPresets, setShowPresets] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image);
      setVariants(productToEdit.variants.map(v => ({ 
        ...v, 
        price: Number(v.price),
        units_per_box: v.units_per_box ?? 1
      })));
      setShowLinkInput(!productToEdit.image || !productToEdit.image.includes('supabase'));
    } else {
      setShowLinkInput(true);
    }
  }, [productToEdit]);

  const handleImageInput = (val: string) => {
    let raw = val.trim();
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    const plainUrlMatch = raw.match(/(https?:\/\/[^\s"'>]+)/i);
    
    if (srcMatch && srcMatch[1]) {
      raw = srcMatch[1];
    } else if (plainUrlMatch) {
      raw = plainUrlMatch[0];
    }
    setImage(raw);
  };

  const uploadFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `item-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setImage(data.publicUrl);
      setShowLinkInput(false);
    } catch (error: any) {
      alert(`Erro no upload: ${error.message}`);
    } finally { setIsUploading(false); }
  };

  const handleApplyPreset = (preset: VariationPreset) => {
    setVariants(preset.variants.map(v => ({ 
      ...v, 
      id: Math.random().toString(36).substr(2, 9), 
      isActive: true,
      units_per_box: v.units_per_box ?? 1
    })));
    setShowPresets(false);
  };

  const toggleVariantStatus = (id: string) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, isActive: !v.isActive } : v));
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) {
      alert("O produto deve ter pelo menos uma variação.");
      return;
    }
    if (confirm("Deseja realmente excluir esta variação?")) {
      setVariants(prev => prev.filter(x => x.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !category) {
      alert('Por favor, preencha o Nome do Produto e a Marca/Categoria.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        id: productToEdit ? productToEdit.id : String(Date.now()), 
        name: name.trim(), 
        category, 
        description: description.trim(),
        image: image.trim() || 'https://picsum.photos/400/400?text=Sem+Foto',
        isActive: productToEdit ? productToEdit.isActive : true,
        variants: variants.filter(v => v.name),
        order_index: productToEdit?.order_index
      });
    } catch (err) {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto bg-background-light dark:bg-background-dark min-h-screen pb-44 text-neutral-900 dark:text-neutral-50">
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-95 transition-all">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h1 className="font-black text-[11px] uppercase tracking-[0.2em]">{productToEdit ? 'Editar Produto' : 'Cadastrar Produto'}</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-white/5 p-3 rounded-[2rem] border border-neutral-100 dark:border-white/5 shadow-sm space-y-4">
          <div className="aspect-square rounded-[1.5rem] bg-neutral-50 dark:bg-black/40 overflow-hidden flex items-center justify-center border-2 border-dashed border-neutral-200 dark:border-white/10 relative">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[8px] font-black uppercase mt-3 text-primary tracking-widest">Enviando...</p>
              </div>
            ) : image ? (
              <>
                <img src={image} className="w-full h-full object-contain p-2" onError={(e) => e.currentTarget.src='https://picsum.photos/400/400?text=Link+Invalido'} />
                <button onClick={() => setImage('')} className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all z-10">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </>
            ) : (
              <div className="text-center opacity-30 flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl mb-2">image</span>
                <p className="text-[9px] font-black uppercase tracking-widest">Nenhuma foto</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all border border-emerald-100/50">
              <span className="material-symbols-outlined text-base">upload</span> 
              Trocar Arquivo
            </button>
            <button onClick={() => setShowLinkInput(!showLinkInput)} className="flex-1 py-3 bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 rounded-xl flex items-center justify-center gap-1.5 text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all border border-neutral-200/50">
              <span className="material-symbols-outlined text-base">link</span> 
              Link Manual
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])} />
          </div>

          {showLinkInput && (
            <div className="animate-in slide-in-from-top-2 px-1">
              <input 
                value={image} 
                onChange={(e) => handleImageInput(e.target.value)} 
                placeholder="Cole o link ou tag HTML aqui..." 
                className="w-full bg-neutral-50 dark:bg-black/20 p-4 rounded-2xl text-[11px] font-medium outline-none border border-neutral-200 dark:border-white/10 shadow-inner"
              />
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-neutral-100 dark:border-white/5 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Nome do Produto</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-neutral-50 dark:bg-black/20 p-4 rounded-2xl text-sm font-black outline-none border border-transparent focus:border-primary transition-all" placeholder="Ex: Cheetos Mix" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1">Marca / Categoria</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-neutral-50 dark:bg-black/20 p-4 rounded-2xl text-sm font-black outline-none border border-transparent focus:border-primary appearance-none transition-all">
              <option value="">Selecione...</option>
              {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-neutral-100 dark:border-white/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between px-1">
             <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Variações e Preços</label>
             <button onClick={() => setShowPresets(!showPresets)} className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:text-primary-dark transition-colors">
               <span className="material-symbols-outlined text-sm">auto_awesome</span> Presets
             </button>
          </div>

          {showPresets && (
            <div className="grid grid-cols-2 gap-2 p-2 bg-neutral-50 dark:bg-black/20 rounded-xl animate-in fade-in zoom-in duration-200">
              {presets.map(p => (
                <button key={p.id} onClick={() => handleApplyPreset(p)} className="p-3 text-[8px] font-black uppercase bg-white dark:bg-white/5 rounded-lg border border-neutral-100 dark:border-white/10 active:scale-95 transition-all">{p.name}</button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {variants.map((v, idx) => (
              <div key={v.id} className={`bg-neutral-50 dark:bg-black/10 p-3 rounded-2xl border border-neutral-100 dark:border-white/5 space-y-3 animate-in slide-in-from-left duration-200 ${!v.isActive ? 'opacity-50' : ''}`} style={{ animationDelay: `${idx * 40}ms` }}>
                <div className="flex items-center gap-2">
                  <input 
                    value={v.name} 
                    onChange={(e) => setVariants(prev => prev.map(x => x.id === v.id ? {...x, name: e.target.value} : x))} 
                    className={`flex-1 bg-white dark:bg-black/40 p-2.5 rounded-lg text-xs font-black outline-none transition-all ${!v.isActive ? 'line-through' : ''}`} 
                    placeholder="Nome (ex: 300ml)" 
                  />
                  <button onClick={() => toggleVariantStatus(v.id)} className={`relative w-10 h-6 rounded-full transition-all duration-300 outline-none shrink-0 shadow-inner ${v.isActive ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${v.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                  <button onClick={() => handleRemoveVariant(v.id)} className="w-8 h-8 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg active:scale-90 transition-all shrink-0">
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase tracking-widest ml-1">Preço Un.</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">R$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={v.price || ''} 
                        onChange={(e) => setVariants(prev => prev.map(x => x.id === v.id ? {...x, price: parseFloat(e.target.value) || 0} : x))} 
                        className="w-full bg-white dark:bg-black/40 p-2 pl-6 rounded-lg text-xs font-black outline-none border border-transparent focus:border-primary/30" 
                        placeholder="0,00" 
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase tracking-widest ml-1">Qtd p/ Caixa</label>
                    <input 
                      type="number" 
                      min="1"
                      value={v.units_per_box || ''} 
                      onChange={(e) => setVariants(prev => prev.map(x => x.id === v.id ? {...x, units_per_box: Math.max(1, parseInt(e.target.value) || 1)} : x))} 
                      className="w-full bg-white dark:bg-black/40 p-2 rounded-lg text-xs font-black outline-none border border-transparent focus:border-primary/30 text-center" 
                      placeholder="1" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setVariants([...variants, { id: Date.now().toString(), name: '', price: 0, isActive: true, units_per_box: 1 }])} className="w-full py-4 border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">+ Adicionar Nova Variação</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-neutral-100 dark:border-white/10 z-50 flex gap-4">
        <button onClick={onCancel} className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-neutral-100 dark:bg-white/5 active:scale-95 transition-all text-neutral-600 dark:text-neutral-300">Sair</button>
        <button 
          onClick={handleSubmit} 
          disabled={isSaving}
          className="flex-[2] py-5 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? 'Gravando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  );
};

export default AddProductForm;
