import React, { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// Types basés sur la documentation Monerium
interface MoneriumBalances {
  currency: string;
  amount: string;
}

interface MoneriumProfile {
  id: string;
  email: string;
  name?: string;
  balances?: MoneriumBalances[];
}

interface MoneriumOrder {
  id: string;
  amount: string;
  currency: string;
  counterpart: {
    identifier: {
      standard: string;
      type: string;
      value: string;
    };
    details?: {
      firstName?: string;
      lastName?: string;
    };
  };
  memo?: string;
}

const MoneriumIntegration: React.FC = () => {
  const { user, authenticated } = usePrivy();
  
  // États pour gérer les différentes phases
  const [isMoneriumConnected, setIsMoneriumConnected] = useState(false);
  const [profile, setProfile] = useState<MoneriumProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  // États pour le formulaire de transfert
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [memo, setMemo] = useState('');
  const [step, setStep] = useState<'connect' | 'authenticate' | 'profile' | 'transfer'>('connect');

  // Adresse de destination (ton wallet)
  const destinationWallet = "0x1234567890abcdef1234567890abcdef12345678"; // Remplace par ton adresse
  
  // Vérifier si l'utilisateur a déjà un token Monerium stocké
  useEffect(() => {
    const storedToken = localStorage.getItem('monerium_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
      setIsMoneriumConnected(true);
      setStep('profile');
      fetchProfile(storedToken);
    }
  }, []);
  
  // Simulation de la connexion à Monerium via la console de développement
  const connectToMonerium = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // En mode dev, on utilise une simulation de connexion à Monerium
      // Dans un environnement réel, on redirigerait vers l'URL d'authentification Monerium
      
      console.log("Simulation de connexion à Monerium en mode développement");
      setMessage("En environnement de développement: Veuillez entrer le token de test dans la prochaine étape");
      setStep('authenticate');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion');
    }
  };
  
  // Fonction pour récupérer le profil utilisateur
  const fetchProfile = async (token: string) => {
    try {
      setLoading(true);
      
      // En production, ce serait un vrai appel API
      // const response = await fetch('https://api.monerium.dev/profiles', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Simulation de réponse pour le développement
      setTimeout(() => {
        const mockProfile: MoneriumProfile = {
          id: 'profile_test123',
          email: 'test@example.com',
          name: 'Test User',
          balances: [
            { currency: 'EUR', amount: '1000.00' },
            { currency: 'USD', amount: '500.00' }
          ]
        };
        
        setProfile(mockProfile);
        setLoading(false);
        setStep('transfer');
      }, 1000);
      
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération du profil');
    }
  };
  
  // Simuler l'authentification manuelle avec un token
  const handleManualAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    const inputToken = (document.getElementById('manual-token') as HTMLInputElement).value;
    if (inputToken) {
      setAccessToken(inputToken);
      localStorage.setItem('monerium_access_token', inputToken);
      setIsMoneriumConnected(true);
      fetchProfile(inputToken);
    } else {
      setError('Veuillez entrer un token');
    }
  };
  
  // Fonction pour initier un transfert
  const initiateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const orderData: Partial<MoneriumOrder> = {
        amount,
        currency,
        counterpart: {
          identifier: {
            standard: 'ethereum',
            type: 'address',
            value: destinationWallet
          }
        },
        memo: memo || 'Transfert via application'
      };
      
      // En production, ce serait un vrai appel API
      // const response = await fetch('https://api.monerium.dev/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(orderData)
      // });
      // const result = await response.json();
      
      // Simulation de réponse pour le développement
      console.log('Ordre de transfert (simulation):', orderData);
      
      setTimeout(() => {
        setLoading(false);
        setMessage(`Transfert simulé de ${amount} ${currency} vers ${destinationWallet.substring(0, 8)}... initié avec succès`);
        setAmount('');
        setMemo('');
      }, 1500);
      
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Erreur lors du transfert');
    }
  };
  
  // Déconnexion de Monerium
  const disconnectMonerium = () => {
    localStorage.removeItem('monerium_access_token');
    setAccessToken(null);
    setIsMoneriumConnected(false);
    setProfile(null);
    setStep('connect');
  };
  
  // Rendu conditionnel selon l'étape
  const renderStep = () => {
    switch (step) {
      case 'connect':
        return (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold">Connecter votre compte Monerium</h2>
            <p className="text-gray-600 text-center max-w-md">
              Connectez-vous à Monerium pour effectuer des transferts depuis votre compte bancaire vers notre wallet.
            </p>
            <button
              onClick={connectToMonerium}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter à Monerium'}
            </button>
          </div>
        );
        
      case 'authenticate':
        return (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold">Authentification Monerium (Mode Dev)</h2>
            <p className="text-gray-600 text-center max-w-md">
              En mode développement, veuillez entrer manuellement un token d'accès Monerium.
            </p>
            
            <form onSubmit={handleManualAuthentication} className="w-full max-w-md">
              <div className="flex flex-col space-y-4">
                <label htmlFor="manual-token" className="font-medium text-gray-700">
                  Token d'accès Monerium
                </label>
                <input
                  id="manual-token"
                  type="text"
                  placeholder="Entrez votre token d'accès"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Vérification...' : 'Valider le token'}
                </button>
              </div>
            </form>
            
            <div className="w-full max-w-md p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800">Note pour le développement</h3>
              <p className="text-sm text-blue-700 mt-1">
                En production, l'utilisateur serait redirigé vers la page d'authentification Monerium.
                Pour tester, utilisez un token de test ou intégrez l'API Sandbox de Monerium.
              </p>
            </div>
          </div>
        );
        
      case 'profile':
        return (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold">Récupération de votre profil...</h2>
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
        
      case 'transfer':
        return (
          <div className="flex flex-col items-center space-y-6 w-full max-w-lg">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-bold">Effectuer un transfert</h2>
              {profile && (
                <button 
                  onClick={disconnectMonerium}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Déconnecter
                </button>
              )}
            </div>
            
            {profile && (
              <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium">Profil connecté</h3>
                <p className="text-sm text-gray-600 mt-1">{profile.email}</p>
                {profile.balances && profile.balances.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium">Soldes disponibles:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.balances.map((balance, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {balance.amount} {balance.currency}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={initiateTransfer} className="w-full">
              <div className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Montant à transférer
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="ISK">ISK</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                    Adresse de destination
                  </label>
                  <input
                    type="text"
                    id="destination"
                    value={destinationWallet}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Cette adresse est prédéfinie pour recevoir vos transferts.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
                    Mémo (optionnel)
                  </label>
                  <input
                    type="text"
                    id="memo"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Raison du transfert"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !amount}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Traitement en cours...' : 'Initier le transfert'}
                </button>
              </div>
            </form>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Transfert via Monerium</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <p className="font-medium">Information</p>
            <p className="text-sm">{message}</p>
          </div>
        )}
        
        {!authenticated ? (
          <div className="text-center p-6">
            <p className="mb-4">Veuillez d'abord vous connecter avec votre wallet via Privy.</p>
            {/* Ici, tu peux ajouter le bouton de connexion Privy si nécessaire */}
          </div>
        ) : (
          renderStep()
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Cette intégration utilise Monerium pour les transferts bancaires vers la blockchain.</p>
        <p className="mt-1">En mode développement, certaines fonctionnalités sont simulées.</p>
      </div>
    </div>
  );
};

export default MoneriumIntegration;