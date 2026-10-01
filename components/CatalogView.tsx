
import React, { useState, useRef } from 'react';
import { Product, CartItem } from '../types';
import { supabase } from '../supabase';

declare var html2canvas: any;

interface CatalogViewProps {
  logoUrl?: string;
  canInstall?: boolean;
  onInstall?: () => void;
  products: Product[];
  categories: string[];
  cart: CartItem[];
  addToCart: (p: Product, variantId: string) => void;
  removeFromCart: (pId: string, vId: string) => void;
  clientName: string;
  setClientName: (name: string) => void;
  onSendWhatsApp: (paymentMethod: string, receiptUrl?: string) => void;
  onOpenSettings: () => void;
}

const CatalogView: React.FC<CatalogViewProps> = ({ 
  logoUrl, canInstall, onInstall, products, categories, cart, addToCart, removeFromCart, clientName, setClientName, onSendWhatsApp, onOpenSettings 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Dinheiro'>('Dinheiro');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showNameError, setShowNameError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const filteredProducts = selectedCategory === 'Todas' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isNameValid = clientName.trim().length >= 3;
  const MIN_ORDER_VALUE = 200;
  const isMinOrderMet = total >= MIN_ORDER_VALUE;

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    if (!isMinOrderMet) return;
    if (!isNameValid) {
      setShowNameError(true);
      const el = document.getElementById('checkout-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Enviando...');
    
    let receiptUrl = undefined;

    try {
      if (receiptRef.current) {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        
        if (blob) {
          const fileName = `receipts/sugestao-${Date.now()}.png`;
          const file = new File([blob], `sugestao.png`, { type: 'image/png' });

          try {
            const { error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(fileName, file);

            if (!uploadError) {
              const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
              receiptUrl = data.publicUrl;
            }
          } catch (err) {}
        }
      }
    } catch (err) {} finally {
      onSendWhatsApp(paymentMethod, receiptUrl);
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const getQuantity = (pId: string, vId: string) => {
    return cart?.find(i => i.productId === pId && i.variantId === vId)?.quantity || 0;
  };

  const isButtonDisabled = cart.length === 0 || isProcessing || !isNameValid || !isMinOrderMet;

  return (
    <div className="flex-1 w-full max-md:max-w-md mx-auto min-h-screen flex flex-col pb-40">
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center p-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-sm uppercase tracking-widest">{processingStatus}</p>
        </div>
      )}

      {/* Botão de Instalação PWA */}
      {canInstall && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-dark">install_mobile</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Instale o App na tela inicial</span>
          </div>
          <button onClick={onInstall} className="bg-primary text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm">Instalar</button>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl && !imgError && (
            <div className="w-12 h-12 flex items-center justify-center">
               <img 
                 src={logoUrl} 
                 alt="Doce Mania Atacado - Distribuidora de Salgadinhos e Elma Chips em Caxias do Sul" 
                 className="w-full h-full object-contain"
                 onError={() => setImgError(true)}
               />
            </div>
          )}
          <div className="flex flex-col">
            <h1 className="font-black text-sm uppercase tracking-tight">Doce Mania Atacado</h1>
            <span className="text-[7px] font-bold text-neutral-400 uppercase tracking-widest -mt-1 hidden md:block">Distribuidora em Caxias do Sul - RS</span>
          </div>
        </div>
        <button onClick={onOpenSettings} className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors" aria-label="Acessar Configurações">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </header>

      <main className="px-4 pt-4">
        <section className="mb-6 px-2 text-center">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-primary-dark">
            🔥 Fornecedor de Salgadinhos Elma Chips em Caxias do Sul 🔥
          </h2>
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em] mt-1.5 leading-relaxed">
            Preços exclusivos de Atacado para mercados e revendedores.<br/>
            Pedido mínimo para entrega: R$ 200,00.
          </p>
        </section>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
          {['Todas', ...categories].map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`shrink-0 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-neutral-100 dark:bg-white/5 opacity-60'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 pt-4">
          {filteredProducts.map(product => {
            const activeVariants = product.variants.filter(v => v.isActive);
            if (activeVariants.length === 0) return null;

            return (
              <article key={product.id} className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="w-full min-h-[320px] bg-neutral-50 dark:bg-black/20 flex items-center justify-center p-4">
                  <img 
                    src={product.image} 
                    className="max-w-full max-h-[400px] w-auto h-auto object-contain rounded-2xl" 
                    onError={(e) => e.currentTarget.src='https://picsum.photos/400/400?text=Sem+Foto'}
                    loading="lazy"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-black text-xl leading-tight">{product.name}</h3>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mb-6">{product.category}</p>
                  
                  <div className="space-y-3">
                    {activeVariants.map(v => {
                      const qty = getQuantity(product.id, v.id);
                      const upb = Number(v.units_per_box) || 1;
                      const isPack = upb > 1;
                      const boxes = Math.floor(qty / upb);
                      
                      return (
                        <div key={v.id} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-black/20 rounded-2xl border border-neutral-100 dark:border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1">
                              {v.name}
                              {isPack && <span className="bg-primary/20 text-primary-dark text-[7px] px-1.5 py-0.5 rounded-md">Caixa {upb}un</span>}
                            </span>
                            <span className="font-black text-lg text-primary-dark">R$ {v.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {qty > 0 ? (
                              <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 rounded-full p-1.5 shadow-sm border border-neutral-100 dark:border-white/5">
                                <button onClick={() => removeFromCart(product.id, v.id)} className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-lg">remove</span></button>
                                <div className="flex flex-col items-center min-w-[3rem]">
                                  <span className="text-sm font-black">{isPack ? `${boxes} cx` : qty}</span>
                                  {isPack && <span className="text-[8px] font-bold text-neutral-400">{qty} un</span>}
                                </div>
                                <button onClick={() => addToCart(product, v.id)} className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-black active:scale-90 transition-transform"><span className="material-symbols-outlined text-lg font-bold">add</span></button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addToCart(product, v.id)} 
                                className="bg-neutral-100 dark:bg-white/10 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-dark active:scale-95 transition-all shadow-sm flex flex-col items-center min-w-[120px]"
                              >
                                <span>ADICIONAR {isPack ? 'CAIXA' : ''}</span>
                                {isPack && <span className="text-[7px] opacity-60 mt-0.5">({upb} UNIDADES)</span>}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div id="checkout-form" className="mt-16 space-y-6 pb-10">
            <div ref={receiptRef} className="p-8 bg-white text-black font-mono text-[11px] rounded-3xl border-t-[12px] border-primary shadow-2xl">
              <h3 className="text-center font-black text-sm uppercase mb-6 tracking-tighter">DOCE MANIA - ATACADO</h3>
              <div className="space-y-1 mb-6 border-b border-dashed pb-4">
                <p>CLIENTE: <span className="font-black">{clientName.toUpperCase() || '---'}</span></p>
                <p>PAGAMENTO: <span className="font-black">{paymentMethod.toUpperCase()}</span></p>
              </div>
              <div className="border-b border-dashed mb-6 pb-4 space-y-2">
                {cart.map(item => {
                  const prod = products.find(p => p.id === item.productId);
                  const variant = prod?.variants.find(v => v.id === item.variantId);
                  const upb = Number(variant?.units_per_box) || 1;
                  const qtyText = upb > 1 ? `${item.quantity / upb}cx (${item.quantity}un)` : `${item.quantity}un`;
                  
                  return (
                    <div key={item.variantId} className="flex justify-between gap-4">
                      <span className="flex-1">{qtyText} {item.productName} ({item.variantName})</span>
                      <span className="font-black">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between font-black text-lg pt-2 mb-4">
                <span>TOTAL</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="text-center mt-6 pt-4 border-t border-dashed opacity-40">
                <p className="text-[8px] uppercase font-bold tracking-widest">Aviso: Preços especiais de atacado.</p>
                <p className="text-[8px] uppercase font-bold tracking-widest">Pedido sujeito a disponibilidade.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 shadow-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Seu Nome * (Obrigatório)</label>
                <input 
                  value={clientName} 
                  onChange={(e) => { setClientName(e.target.value); setShowNameError(false); }} 
                  className={`w-full bg-neutral-50 dark:bg-black/20 p-4 rounded-2xl text-sm font-black outline-none border-2 transition-all ${showNameError ? 'border-red-500' : 'border-transparent focus:border-primary'}`} 
                  placeholder="Como devemos te chamar?" 
                />
                {!isNameValid && clientName.length > 0 && <p className="text-[9px] font-bold text-neutral-400 ml-1 italic">Mínimo de 3 caracteres...</p>}
                {showNameError && <p className="text-[9px] font-bold text-red-500 ml-1">Por favor, informe seu nome para continuar.</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Pix', 'Dinheiro'] as const).map(method => (
                    <button 
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === method ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 dark:bg-white/10 opacity-60'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleConfirmOrder}
                  disabled={isButtonDisabled}
                  className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${isButtonDisabled ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none' : 'bg-primary text-black shadow-primary/40'}`}
                >
                  {isProcessing ? 'PROCESSANDO...' : !isMinOrderMet ? `FALTAM R$ ${(MIN_ORDER_VALUE - total).toFixed(2)} PARA O MÍNIMO` : 'ENVIAR PEDIDO DE ATACADO'}
                </button>
                
                <div className="text-center px-4 space-y-2">
                  {!isMinOrderMet && (
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                      Atingir R$ 200,00 libera os preços de atacado
                    </p>
                  )}
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-relaxed">
                    * Preços especiais de revenda válidos para<br/>pedidos acima de R$ 200,00.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SEO Information Section */}
      <footer className="px-6 py-12 mt-12 bg-neutral-50 dark:bg-black/20 border-t border-neutral-100 dark:border-white/5">
        <div className="max-w-2xl mx-auto space-y-10">
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest text-primary-dark mb-4">
              Líder em Distribuição de Salgadinhos Atacado em Caxias do Sul
            </h2>
            <p className="text-[11px] leading-relaxed text-neutral-500 font-medium">
              A <strong>Doce Mania Atacado</strong> é a referência nº 1 e <strong>fornecedor premium de salgadinhos</strong>, doces e guloseimas em <strong>Caxias do Sul</strong>. 
              Somos especialistas em <strong>Elma Chips no atacado</strong>, <strong>Toddynho</strong>, <strong>Pererekas</strong> e snacks de alta rotatividade. 
              Se você busca <strong>comprar barato</strong> direto da distribuidora para seu mercado ou revenda, garantimos o melhor <strong>preço baixo</strong> e <strong>promoção</strong> constante.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest">Atendimento e Contato</h3>
              <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">
                <strong>Telefone/WhatsApp:</strong> <a href="tel:+5554991107242" className="text-primary-dark hover:underline">(54) 99110-7242</a><br/>
                <strong>Localização:</strong> Caxias do Sul - RS<br/>
                <strong>Especialidade:</strong> Distribuição de Elma Chips e Salgadinhos no Atacado.
              </p>
              <div className="flex gap-4">
                <a href="https://wa.me/5554991107242" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest">Dúvidas Frequentes (FAQ)</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-[9px] font-black text-neutral-400 uppercase">Quais marcas vocês trabalham no atacado?</h4>
                  <p className="text-[10px] text-neutral-500 font-medium">Somos o principal fornecedor de Elma Chips, Pererekas, Toddynho e guloseimas em Caxias do Sul.</p>
                </div>
                <div>
                  <h4 className="text-[9px] font-black text-neutral-400 uppercase">Qual o benefício de comprar na Doce Mania?</h4>
                  <p className="text-[10px] text-neutral-500 font-medium">Garantimos o menor preço de revenda e promoções exclusivas para parceiros de longo prazo.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/50 dark:bg-black/10 p-4 rounded-xl border border-neutral-100 dark:border-white/5">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2">Termos Mais Pesquisados - Atacado Premium</h3>
            <p className="text-[8px] text-neutral-400 leading-relaxed font-bold uppercase tracking-wider">
              Salgadinho em Caxias do Sul • Elma Chips no Atacado • Fornecedor de Salgadinhos • Comprar Elma Chips Barato • Toddynho em Atacado • Pererekas Salgadinhos • Fornecedor de Snacks • Distribuidora Líder Serra Gaúcha • Preço de Fábrica Salgadinhos • Promoção Elma Chips Caxias
            </p>
          </section>

          <div className="pt-8 border-t border-dashed border-neutral-200 dark:border-white/10 text-center space-y-2">
            <p className="text-[9px] font-black text-primary-dark uppercase tracking-widest">
              DOCE MANIA - LÍDER EM ATACADO DE SNACKS
            </p>
            <p className="text-[7px] font-bold text-neutral-400 uppercase tracking-[0.3em]">
              CNPJ: 63.730.443/0001-77 • Caxias do Sul - RS • © 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CatalogView;
