import { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import AuthForm from './components/AuthForm';
import ChatInterface from './components/ChatInterface';
import LanguageSwitcher from './components/LanguageSwitcher';
import WeatherWidget from './components/WeatherWidget';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('ks_token') || '');

  const handleLogin = (tok) => setToken(tok);

  const handleLogout = () => {
    localStorage.removeItem('ks_token');
    setToken('');
  };

  return (
    <I18nextProvider i18n={i18n}>
      {!token ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 overflow-hidden">
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-40 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/10 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl shadow-lg">
                🌾
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-none">KrishiSahay</h1>
                <p className="text-green-400 text-xs">AI Farming Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <button
                id="logout-btn"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-300 text-xs font-medium transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Main layout */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 p-4 gap-4 overflow-y-auto flex-shrink-0">
              <WeatherWidget />
              {/* Tips card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-green-300 text-xs font-semibold uppercase tracking-wider mb-3">💡 Try asking:</p>
                <ul className="space-y-2">
                  {[
                    'How to control rice blast disease?',
                    'Best fertilizer for wheat?',
                    'PM-KISAN scheme details',
                    'How to improve soil fertility?',
                    'When to sow cotton seeds?',
                  ].map((tip) => (
                    <li key={tip} className="text-green-300/60 text-xs leading-relaxed border-l-2 border-green-500/30 pl-2">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Chat */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <ChatInterface token={token} onLogout={handleLogout} />
            </main>
          </div>
        </div>
      )}
    </I18nextProvider>
  );
}