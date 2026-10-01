
import React, { useState, useEffect } from 'react';
import { Product, CartItem, AppView, ProductVariant, VariationPreset } from './types';
import { INITIAL_PRODUCTS, CATEGORIES } from './constants';
import CatalogView from './components/CatalogView';
import AdminView from './components/AdminView';
import AddProductForm from './components/AddProductForm';
import LoginView from './components/LoginView';
import EditCategoriesView from './components/EditCategoriesView';
import EditVariationsView from './components/EditVariationsView';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('catalog');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [presets, setPresets] = useState<VariationPreset[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('5554991107242');
  const [logoUrl, setLogoUrl] = useState<string>('https://vvywceybsdfyyuwvsqnq.supabase.co/storage/v1/object/public/product-images/logo.png');
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('catalog_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [clientName, setClientName] = useState(() => localStorage.getItem('catalog_client_name') || '');

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('catalog_client_name', clientName);
  }, [clientName]);

  useEffect(() => {
    localStorage.setItem('catalog_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: dbProducts, error: prodError } = await supabase
        .from('products')
        .select('*');

      if (prodError) throw prodError;

      if (dbProducts && dbProducts.length > 0) {
        const normalized = dbProducts.map(p => ({
          ...p,
          isActive: p.is_active ?? p.isActive ?? true,
          variants: (Array.isArray(p.variants) ? p.variants : []).map((v: any) => ({
            ...v,
            isActive: v.is_active ?? v.isActive ?? true,
            price: Number(v.price),
            units_per_box: Number(v.units_per_box) || 1
          }))
        }));

        const sorted = [...normalized].sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999));
        setProducts(sorted);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }

      const { data: dbSettings } = await supabase.from('settings').select('*');
      if (dbSettings) {
        const cats = dbSettings.find(s => s.key === 'categories')?.value;
        const wa = dbSettings.find(s => s.key === 'whatsapp')?.value;
        const pre = dbSettings.find(s => s.key === 'presets')?.value;
        const logo = dbSettings.find(s => s.key === 'logo')?.value;
        if (cats) setCategories(cats);
        if (wa) setWhatsappNumber(wa);
        if (pre) setPresets(pre);
        if (logo) setLogoUrl(logo);
      }
    } catch (err: any) {
      console.warn("Usando dados locais:", err.message);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const saveProduct = async (product: Product) => {
    try {
      const maxOrder = products.length > 0 ? Math.max(...products.map(p => p.order_index ?? 0)) : 0;
      
      const payload = {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        category: product.category,
        variants: product.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          price: v.price,
          is_active: v.isActive,
          units_per_box: Number(v.units_per_box) || 1
        })),
        is_active: product.isActive,
        order_index: product.order_index ?? (maxOrder + 1)
      };

      const { error } = await supabase.from('products').upsert(payload);
      if (error) throw error;

      await fetchData(); 
      setProductToEdit(null);
      setView('admin');
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  const handleReorderProduct = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const newProducts = [...products];
    const itemA = newProducts[currentIndex];
    const itemB = newProducts[targetIndex];

    const tempOrder = itemA.order_index ?? currentIndex;
    itemA.order_index = itemB.order_index ?? targetIndex;
    itemB.order_index = tempOrder;

    if (itemA.order_index === itemB.order_index) {
        if (direction === 'up') itemA.order_index--;
        else itemA.order_index++;
    }

    setProducts([...newProducts].sort((a, b) => (a.order_index ?? 9999) - (b.order_index ?? 9999)));

    try {
      await Promise.all([
        supabase.from('products').update({ order_index: itemA.order_index }).eq('id', itemA.id),
        supabase.from('products').update({ order_index: itemB.order_index }).eq('id', itemB.id)
      ]);
    } catch (err) {
      console.error("Erro ao reordenar no banco:", err);
    }
  };

  const handleSendWhatsApp = (paymentMethod: string, receiptUrl?: string) => {
    if (cart.length === 0) return;
    
    const header = "🍭 *NOVO PEDIDO - DOCE MANIA*\n" +
                   "------------------------------------------\n";

    const clientInfo = `👤 *CLIENTE:* ${clientName.toUpperCase() || 'NÃO INFORMADO'}\n` +
                       `💳 *PAGAMENTO:* ${paymentMethod.toUpperCase()}\n` +
                       "------------------------------------------\n\n" +
                       "🛒 *DETALHES DO PEDIDO:*\n\n";

    const itemsText = cart.map(item => {
      const prod = products.find(p => p.id === item.productId);
      const variant = prod?.variants.find(v => v.id === item.variantId);
      const upb = Number(variant?.units_per_box) || 1;
      
      const qtyLabel = upb > 1 
        ? `${item.quantity / upb} CX (${item.quantity} UN)` 
        : `${item.quantity} UN`;
        
      return `${qtyLabel} x ${item.productName.toUpperCase()} ${item.variantName.toUpperCase()}`;
    }).join('\n');

    const totalValue = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const footer = `\n\n------------------------------------------\n` +
                   `💰 *VALOR TOTAL: R$ ${totalValue.toFixed(2)}*\n` +
                   "------------------------------------------";

    let message = `${header}${clientInfo}${itemsText}${footer}`;
    
    if (receiptUrl) {
      message += `\n\n🖼️ *RECIBO:* ${receiptUrl}`;
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setCart([]); 
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      {isLoading ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-xs uppercase tracking-widest text-primary animate-pulse">Iniciando App...</p>
        </div>
      ) : (
        <>
          {view === 'catalog' && (
            <CatalogView 
              logoUrl={logoUrl}
              canInstall={!!deferredPrompt}
              onInstall={handleInstall}
              products={products.filter(p => p.isActive)} 
              categories={categories} cart={cart} 
              addToCart={(p, vId) => {
                const variant = p.variants.find(v => v.id === vId);
                if (!variant) return;
                
                const step = Number(variant.units_per_box) || 1;
                
                setCart(prev => {
                  const exists = prev.find(i => i.productId === p.id && i.variantId === vId);
                  if (exists) return prev.map(i => (i.productId === p.id && i.variantId === vId) ? {...i, quantity: i.quantity + step} : i);
                  return [...prev, { productId: p.id, variantId: vId, quantity: step, productName: p.name, variantName: variant.name, price: variant.price }];
                });
              }}
              removeFromCart={(pId, vId) => {
                const product = products.find(p => p.id === pId);
                const variant = product?.variants.find(v => v.id === vId);
                const step = Number(variant?.units_per_box) || 1;
                
                setCart(prev => prev.map(i => (i.productId === pId && i.variantId === vId) ? {...i, quantity: i.quantity - step} : i).filter(i => i.quantity > 0));
              }}
              clientName={clientName} setClientName={setClientName} onSendWhatsApp={handleSendWhatsApp} 
              onOpenSettings={() => isAuthenticated ? setView('admin') : setView('login')}
            />
          )}
          {view === 'login' && <LoginView onLogin={(pw) => { if(pw === '233023'){ setIsAuthenticated(true); setView('admin'); return true; } return false; }} onBack={() => setView('catalog')} />}
          {view === 'admin' && (
            <AdminView 
              logoUrl={logoUrl}
              setLogoUrl={async (url) => {
                setLogoUrl(url);
                await supabase.from('settings').upsert({ key: 'logo', value: url }, { onConflict: 'key' });
              }}
              products={products} whatsappNumber={whatsappNumber} 
              setWhatsappNumber={async (num) => {
                setWhatsappNumber(num);
                await supabase.from('settings').upsert({ key: 'whatsapp', value: num }, { onConflict: 'key' });
              }}
              storageReady={true}
              onToggleStatus={async (id) => {
                const p = products.find(x => x.id === id);
                if (p) {
                  const next = !p.isActive;
                  setProducts(prev => prev.map(x => x.id === id ? {...x, isActive: next} : x));
                  await supabase.from('products').update({ is_active: next }).eq('id', id);
                }
              }} 
              onToggleVariantStatus={async (pId, vId) => {
                const p = products.find(x => x.id === pId);
                if (p) {
                  const updated = p.variants.map(v => v.id === vId ? {...v, isActive: !v.isActive} : v);
                  setProducts(prev => prev.map(x => x.id === pId ? {...x, variants: updated} : x));
                  await supabase.from('products').update({ 
                    variants: updated.map(v => ({
                      id: v.id,
                      name: v.name,
                      price: v.price,
                      is_active: v.isActive,
                      units_per_box: v.units_per_box
                    })) 
                  }).eq('id', pId);
                }
              }}
              onReorderProduct={handleReorderProduct}
              onAddProduct={() => { setProductToEdit(null); setView('add-product'); }} 
              onEditProduct={(p) => { setProductToEdit(p); setView('edit-product'); }}
              onDeleteProduct={async (id) => {
                if (confirm("Excluir produto permanentemente?")) {
                  await supabase.from('products').delete().eq('id', id);
                  fetchData();
                }
              }}
              onOpenCategories={() => setView('edit-categories')}
              onOpenVariations={() => setView('edit-variations')}
              onBack={() => setView('catalog')} onLogout={() => { setIsAuthenticated(false); setView('catalog'); }}
            />
          )}
          {(view === 'add-product' || view === 'edit-product') && (
            <AddProductForm 
              categories={categories} presets={presets} storageReady={true}
              productToEdit={productToEdit} onSave={saveProduct} onCancel={() => setView('admin')} 
            />
          )}
          {view === 'edit-categories' && <EditCategoriesView categories={categories} 
            setCategories={async (val: any) => {
              const next = typeof val === 'function' ? val(categories) : val;
              setCategories(next);
              await supabase.from('settings').upsert({ key: 'categories', value: next }, { onConflict: 'key' });
            }} onBack={() => setView('admin')} />}
          {view === 'edit-variations' && <EditVariationsView presets={presets} 
            setPresets={async (val: any) => {
              const next = typeof val === 'function' ? val(presets) : val;
              setPresets(next);
              await supabase.from('settings').upsert({ key: 'presets', value: next }, { onConflict: 'key' });
            }} onBack={() => setView('admin')} />}
        </>
      )}
    </div>
  );
};

export default App;
