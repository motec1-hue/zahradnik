
import React, { useState, useCallback } from 'react';
import { generateGardeningTips } from './services/geminiService';
import SubscriptionForm from './components/SubscriptionForm';
import GardeningTipsCard from './components/GardeningTipsCard';
import { LeafIcon } from './components/Icons';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tips, setTips] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Prosím, zadajte platnú e-mailovú adresu.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setTips(null);

    try {
      const generatedTips = await generateGardeningTips();
      setTips(generatedTips);
      setIsSubscribed(true);
    } catch (err) {
      setError('Nepodarilo sa vygenerovať tipy. Skúste to prosím znova neskôr.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleUnsubscribe = useCallback(() => {
    setIsSubscribed(false);
    setTips(null);
    setEmail('');
    setError(null);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/1410145/pexels-photo-1410145.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <header className="text-center mb-8">
              <div className="inline-block bg-green-600 p-3 rounded-full mb-4">
                <LeafIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800">Profesionálny záhradník</h1>
              <p className="text-gray-600 mt-2 text-lg">Vaše týždenné tipy pre dokonalú záhradu priamo do vašej schránky.</p>
            </header>
            
            <main>
              {!isSubscribed ? (
                <SubscriptionForm
                  email={email}
                  setEmail={setEmail}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  error={error}
                />
              ) : (
                tips && <GardeningTipsCard tips={tips} userEmail={email} onUnsubscribe={handleUnsubscribe} />
              )}
               {isSubscribed && (
                  <p className="text-center text-sm text-gray-500 mt-6">
                    Toto je len ukážka. V reálnej aplikácii by vám bol tento e-mail doručený každý týždeň.
                  </p>
               )}
            </main>
          </div>
        </div>
      </div>
      <footer className="relative text-center mt-8 text-white/80 text-sm">
        <p>Vytvorené s láskou k záhradníčeniu.</p>
      </footer>
    </div>
  );
};

export default App;
