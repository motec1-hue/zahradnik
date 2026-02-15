
import React, { useState, useEffect, useCallback } from 'react';
import { generateGardeningTips } from './services/geminiService';
import SubscriptionForm from './components/SubscriptionForm';
import WeeklyDashboard from './components/WeeklyDashboard';
import { LeafIcon, SpinnerIcon } from './components/Icons';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardContent, setDashboardContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Načítanie obsahu priamo pri starte aplikácie
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const content = await generateGardeningTips();
        setDashboardContent(content);
      } catch (err) {
        setError('Nepodarilo sa načítať týždenný prehľad. Skúste to prosím neskôr.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSubscribe = useCallback(async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Prosím, zadajte platnú e-mailovú adresu.');
      return;
    }
    setIsSubscribed(true);
    alert(`Ďakujeme! Týždenné prehľady budeme posielať na ${email}`);
  }, [email]);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center bg-fixed bg-cover bg-center font-sans text-gray-900"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/1410145/pexels-photo-1410145.jpeg')" }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      
      {/* Navigácia / Header */}
      <header className="relative z-20 w-full bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 md:px-12 flex justify-between items-center border-b border-green-100">
        <div className="flex items-center gap-2">
          <LeafIcon className="h-8 w-8 text-green-700" />
          <span className="text-xl font-bold text-green-900 tracking-tight">Profesionálny záhradník</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-green-800">
          <a href="#" className="hover:text-green-600 transition-colors">Tento týždeň</a>
          <a href="#" className="hover:text-green-600 transition-colors">Archív</a>
          <a href="#" className="hover:text-green-600 transition-colors">Kalendár sadenia</a>
        </nav>
      </header>

      <main className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12">
        {/* Bočný panel pre odber */}
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white sticky top-24">
            <h3 className="text-lg font-bold text-green-900 mb-2">Zostaňte v kontakte</h3>
            <p className="text-sm text-gray-600 mb-6">Nechajte si posielať tieto rady každý pondelok priamo do schránky.</p>
            {!isSubscribed ? (
              <SubscriptionForm
                email={email}
                setEmail={setEmail}
                onSubmit={handleSubscribe}
                isLoading={false}
                error={null}
              />
            ) : (
              <div className="bg-green-100 p-4 rounded-lg text-green-800 text-sm font-medium">
                ✓ Odber je aktivovaný!
              </div>
            )}
            
            <hr className="my-8 border-gray-100" />
            
            <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Predošlé vydania</h4>
            <ul className="space-y-3 text-sm text-green-800">
              <li className="hover:underline cursor-pointer">12. - 18. Február: Rez ovocín</li>
              <li className="hover:underline cursor-pointer">5. - 11. Február: Príprava skleníka</li>
              <li className="hover:underline cursor-pointer">29. Jan. - 4. Feb.: Plánovanie hriadok</li>
            </ul>
          </div>
        </aside>

        {/* Hlavný obsah - Dashboard */}
        <section className="lg:col-span-9 order-1 lg:order-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white/50 backdrop-blur-sm rounded-3xl">
              <SpinnerIcon className="h-12 w-12 text-green-600 animate-spin mb-4" />
              <p className="text-green-900 font-medium animate-pulse">Pripravujeme vaše záhradné rady na tento týždeň...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
              <p className="text-red-600">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-sm font-bold text-red-700 underline">Skúsiť znova</button>
            </div>
          ) : (
            dashboardContent && <WeeklyDashboard content={dashboardContent} />
          )}
        </section>
      </main>

      <footer className="relative z-10 w-full py-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Profesionálny záhradník. Rady generované AI záhradníkom.</p>
      </footer>
    </div>
  );
};

export default App;
