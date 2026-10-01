
import React, { useState } from 'react';

interface LoginViewProps {
  onLogin: (password: string) => boolean;
  onBack: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto bg-background-light dark:bg-background-dark min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full bg-white dark:bg-white/5 rounded-3xl p-8 shadow-xl border border-neutral-100 dark:border-white/5 text-center">
        <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">Insira a senha administrativa para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <input 
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full bg-neutral-100 dark:bg-black/20 border ${error ? 'border-red-500' : 'border-transparent focus:border-primary'} text-center text-2xl tracking-[1em] rounded-2xl py-4 outline-none transition-all`} 
              placeholder="••••••" 
              type="password"
              inputMode="numeric"
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-500">Senha incorreta. Tente novamente.</p>
          )}

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-neutral-900 font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Entrar
          </button>
        </form>

        <button 
          onClick={onBack}
          className="mt-6 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          Voltar ao Catálogo
        </button>
      </div>
    </div>
  );
};

export default LoginView;
