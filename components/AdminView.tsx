
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { supabase } from '../supabase';

interface AdminViewProps {
  logoUrl?: string;
  setLogoUrl: (url: string) => void;
  products: Product[];
  whatsappNumber: string;
  setWhatsappNumber: (num: string) => void;
  storageReady: boolean | 'error';
  onToggleStatus: (id: string) => void;
  onToggleVariantStatus: (pId: string, vId: string) => void;
  onReorderProduct: (id: string, direction: 'up' | 'down') => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onOpenCategories: () => void;
  onOpenVariations: () => void;
  onBack: () => void;
  onLogout: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  logoUrl,
  setLogoUrl,
  products, 
  whatsappNumber, 
  setWhatsappNumber, 
  onToggleStatus, 
  onToggleVariantStatus,
  onReorderProduct,
  onAddProduct, 
  onEditProduct,
  onDeleteProduct,
  onOpenCategories, 
  onOpenVariations,
  onBack, 
  onLogout 
}) => {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [tempPhone, setTempPhone] = useState(whatsappNumber);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleSavePhone = () => {
    const cleaned = tempPhone.replace(/\D/g, '');
    if (cleaned.length < 10) return;
    setWhatsappNumber(cleaned);
    setIsEditingPhone(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const fileName = `settings/logo-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setLogoUrl(data.publicUrl);
    } catch (err: any) {
      alert("Erro ao enviar logo: " + err.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto bg-background-light dark:bg-background-dark min-h-screen pb-32">
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-black text-sm uppercase tracking-widest">Painel Admin</h1>
        </div>
        <button onClick={onLogout} className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">Sair</button>
      </div>

      <div className="p-4 space-y-6">
        {/* Gestão Rápida */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 shadow-xl space-y-6">
          <div className="flex gap-3">
            <button onClick={onOpenCategories} className="flex-1 py-4 bg-neutral-100 dark:bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all group">
              <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">category</span> 
              Marcas
            </button>
            <button onClick={onOpenVariations} className="flex-1 py-4 bg-neutral-100 dark:bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all group">
              <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">list_alt</span> 
              Presets
            </button>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-black/20 rounded-3xl border border-neutral-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border shadow-sm p-1">
                  {logoUrl ? (
                    <img src={logoUrl} className="w-full h-full object-contain" />
                  ) : (
                    <span className="material-symbols-outlined text-neutral-300">image</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Logotipo App</span>
                  <span className="text-xs font-black">{isUploadingLogo ? 'Carregando...' : (logoUrl ? 'Configurado' : 'Não definido')}</span>
                </div>
              </div>
              <button onClick={() => logoInputRef.current?.click()} disabled={isUploadingLogo} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/10 text-primary rounded-xl border border-primary/20 shadow-sm active:scale-90 transition-all">
                <span className="material-symbols-outlined text-xl">upload_file</span>
              </button>
              <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-black/20 rounded-3xl border border-neutral-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center shadow-sm">
                   <svg className="w-6 h-6 text-green-500 fill-current" viewBox="0 0 24 24">
                     <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.539 2.016 2.126-.54c.808.432 1.91.707 3.162.708 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.771-5.768-5.771zm3.374 8.204c-.162.454-.81.856-1.291.957-.4.085-.903.111-2.581-.581-1.745-.719-2.883-2.433-2.969-2.548-.087-.116-.713-.933-.713-1.776 0-.843.442-1.258.598-1.433.158-.175.344-.219.458-.219.116 0 .233.001.335.006.106.004.248-.04.388.293.14.332.481 1.157.523 1.241.041.085.069.184.012.298-.057.114-.087.185-.172.285-.085.1-.182.224-.26.299-.085.086-.177.18-.077.35.099.172.441.727.947 1.176.65.58 1.196.76 1.368.846.172.086.274.072.375-.044.1-.116.427-.497.541-.667.114-.171.229-.143.387-.086.158.057 1.002.473 1.173.558.173.085.287.128.329.2.043.073.043.418-.12.871z"/>
                   </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Zap de Pedidos</span>
                  {isEditingPhone ? (
                    <input value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} onBlur={handleSavePhone} autoFocus className="bg-transparent border-b-2 border-primary outline-none font-black text-xs w-32 py-1" />
                  ) : (
                    <span className="font-black text-xs tracking-tight">{whatsappNumber}</span>
                  )}
                </div>
              </div>
              <button onClick={() => isEditingPhone ? handleSavePhone() : setIsEditingPhone(true)} className={`w-10 h-10 flex items-center justify-center rounded-xl border shadow-sm active:scale-90 transition-all ${isEditingPhone ? 'bg-primary text-black border-primary' : 'bg-white dark:bg-white/10 text-primary border-primary/20'}`}>
                <span className="material-symbols-outlined text-xl">{isEditingPhone ? 'check' : 'edit'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Seus Produtos ({products.length})</h2>
          </div>
          {products.map((product, index) => (
            <div key={product.id} className={`bg-white dark:bg-white/5 rounded-[2rem] border transition-all ${!product.isActive ? 'opacity-50 grayscale' : 'shadow-sm border-neutral-200 dark:border-white/5'}`}>
              <div className="p-4 flex items-center gap-4">
                <div onClick={() => toggleExpand(product.id)} className="cursor-pointer shrink-0 relative">
                  <img src={product.image} className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 border dark:border-white/10" onError={(e) => e.currentTarget.src='https://picsum.photos/100/100?text=IMG'} />
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-surface-dark rounded-full w-6 h-6 flex items-center justify-center border shadow-sm">
                    <span className="material-symbols-outlined text-[12px] text-neutral-400">{expandedId === product.id ? 'expand_less' : 'expand_more'}</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0" onClick={() => toggleExpand(product.id)}>
                  <h3 className="font-black text-sm truncate leading-tight">{product.name}</h3>
                  <p className="text-[9px] text-neutral-400 uppercase font-black tracking-widest mt-0.5">{product.category}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col gap-1 mr-2">
                    <button onClick={() => onReorderProduct(product.id, 'up')} disabled={index === 0} className="w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-white/5 rounded-full disabled:opacity-20 active:scale-90 transition-all"><span className="material-symbols-outlined text-xs">arrow_upward</span></button>
                    <button onClick={() => onReorderProduct(product.id, 'down')} disabled={index === products.length - 1} className="w-6 h-6 flex items-center justify-center bg-neutral-100 dark:bg-white/5 rounded-full disabled:opacity-20 active:scale-90 transition-all"><span className="material-symbols-outlined text-xs">arrow_downward</span></button>
                  </div>
                  <button onClick={() => onEditProduct(product)} className="w-10 h-10 flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 active:scale-90 transition-all"><span className="material-symbols-outlined text-xl">edit</span></button>
                  <button onClick={() => onToggleStatus(product.id)} className={`w-10 h-10 flex items-center justify-center rounded-xl active:scale-90 transition-all ${product.isActive ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-neutral-300 bg-neutral-100 dark:bg-white/5'}`}><span className="material-symbols-outlined text-xl">{product.isActive ? 'visibility' : 'visibility_off'}</span></button>
                  <button onClick={() => onDeleteProduct(product.id)} className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 active:scale-90 transition-all"><span className="material-symbols-outlined text-xl">delete</span></button>
                </div>
              </div>

              {expandedId === product.id && (
                <div className="bg-neutral-50 dark:bg-black/20 p-5 border-t border-neutral-100 dark:border-white/5 space-y-3 animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">inventory_2</span> Variações
                    </p>
                  </div>
                  {product.variants.map(v => (
                    <div key={v.id} className={`flex items-center justify-between bg-white dark:bg-white/5 p-4 rounded-2xl border transition-all ${v.isActive ? 'border-neutral-100 dark:border-white/10 shadow-sm' : 'border-dashed border-red-200/50 bg-red-50/10 grayscale'}`}>
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${!v.isActive ? 'text-neutral-400 line-through' : ''}`}>
                          {v.name}
                          {v.units_per_box && v.units_per_box > 1 && <span className="text-[8px] text-neutral-400 ml-2">({v.units_per_box}un)</span>}
                        </span>
                        <span className="text-sm font-black text-primary-dark">R$ {v.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${v.isActive ? 'text-green-500' : 'text-red-500'}`}>{v.isActive ? 'ATIVO' : 'OFF'}</span>
                        <button onClick={() => onToggleVariantStatus(product.id, v.id)} className={`relative w-11 h-6 rounded-full transition-all duration-300 outline-none shadow-inner ${v.isActive ? 'bg-primary' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${v.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {products.length === 0 && <p className="text-center py-10 opacity-30 text-xs font-bold uppercase tracking-[0.3em]">Nenhum produto cadastrado</p>}
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 rounded-full shadow-2xl border border-neutral-200 dark:border-white/10 z-50">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-400 hover:bg-black/5 transition-all active:scale-90"><span className="material-symbols-outlined text-2xl">storefront</span></button>
        <button onClick={onAddProduct} className="w-16 h-16 bg-primary text-black rounded-full flex items-center justify-center shadow-xl shadow-primary/40 active:scale-95 transition-transform"><span className="material-symbols-outlined text-4xl font-black">add</span></button>
        <button onClick={onLogout} className="w-12 h-12 flex items-center justify-center rounded-full text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-90"><span className="material-symbols-outlined text-2xl">logout</span></button>
      </div>
    </div>
  );
};

export default AdminView;
