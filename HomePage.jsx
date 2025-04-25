import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [lightUpIndex, setLightUpIndex] = useState(-1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStations, setShowStations] = useState(false);
  
  const navigate = useNavigate();
  const digiLineText = "DigiLine";

  // Liste des postes disponibles
  const stations = [
    { id: 'SPS1', name: 'SPS1 (Scanner)', path: '/scan', main: true },
    { id: 'SPS2', name: 'SPS2', path: '/station/sps2' },
    { id: 'SPS3', name: 'SPS3', path: '/station/sps3' },
    { id: 'SPS4', name: 'SPS4', path: '/station/sps4' },
    { id: 'SPS5', name: 'SPS5', path: '/station/sps5' },
    { id: 'SPS6', name: 'SPS6', path: '/station/sps6' },
    { id: 'SPS7', name: 'SPS7', path: '/station/sps7' },
    { id: 'SPS8', name: 'SPS8', path: '/station/sps8' },
    { id: 'SPS9', name: 'SPS9', path: '/station/sps9' },
    { id: 'SPS10', name: 'SPS10', path: '/station/sps10' },
    // Ajoutez les autres postes selon vos besoins
  ];

  useEffect(() => {
    setLoaded(true);

    const repeatAnimation = () => {
      let letterIndex = -1;
      const letterInterval = setInterval(() => {
        letterIndex++;
        setLightUpIndex(letterIndex);
        if (letterIndex >= digiLineText.length) {
          clearInterval(letterInterval);
        }
      }, 150);
    };

    repeatAnimation();

    const loopInterval = setInterval(() => {
      setLightUpIndex(-1);
      repeatAnimation();
    }, 4000);

    return () => clearInterval(loopInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Nouvelle fonction pour ouvrir plusieurs postes en même temps
  const openAllStations = () => {
    // Ouvrir le scanner (SPS1) dans la fenêtre actuelle
    navigate('/scan');
    
    // Ouvrir chaque station dans une nouvelle fenêtre/onglet
    stations.slice(1).forEach(station => {
      window.open(station.path, `station_${station.id}`, 'noopener,noreferrer');
    });
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-bottom opacity-50"
        style={{ backgroundImage: "url('/Circuit foor.jpg')" }}
      />

      {/* Header */}
      <header className="bg-red-700 text-white shadow-md h-16 relative z-10">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <img
            src="/logo-DigLine.jpg"
            alt="Logo YMM DigiLine"
            className="h-full w-auto object-contain"
            style={{ transform: 'scale(1.8)', transformOrigin: 'left center' }}
          />
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-6 text-sm font-medium">
              <Link to="/" className="hover:underline">Accueil</Link>
              <Link to="/apropos" className="hover:underline">À propos</Link>
            </nav>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-white text-red-700 px-2 py-1 rounded-full text-sm hover:bg-gray-200"
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Marquee fluide sans délai */}
      <div className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-text">
            👉 Welcome to YMM DigiLine – The gesture is yours, the clarity is ours. 😄
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center relative px-4 py-10 z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-red-700 mb-4">YMM DigiLine</h2>
                <p className="text-xl mb-8">
                  Digitalization solution for connector schematics<br />
                  and station-based guidance
                </p>
              </div>

              {/* Logo animé */}
              <div className={`flex justify-center mb-10 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative w-64 h-36">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="glow-lines" width="240" height="120" viewBox="0 0 240 120" fill="none">
                      <path d="M10,30 L50,30 L70,20 L120,20 L140,30 L230,30" />
                      <path d="M30,50 L50,50 L70,60 L120,60 L140,50 L210,50" />
                      <path d="M10,80 L60,80 L80,90 L130,90 L150,80 L230,80" />
                      <circle cx="10" cy="30" r="4" />
                      <circle cx="230" cy="30" r="4" />
                      <circle cx="30" cy="50" r="4" />
                      <circle cx="210" cy="50" r="4" />
                      <circle cx="10" cy="80" r="4" />
                      <circle cx="230" cy="80" r="4" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center">
                      <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                          <path d="M10,20 L30,20 L30,40 L10,40 L10,20 Z" fill="#e53e3e" />
                          <path d="M30,25 L40,25 L40,35 L30,35 L30,25 Z" fill="#e53e3e" />
                          <path d="M5,25 L10,25 L10,35 L5,35 L5,25 Z" fill="#e53e3e" />
                          <path d="M40,28 L45,28 L45,32 L40,32 L40,28 Z" fill="#e53e3e" />
                        </svg>
                      </div>
                      <div className="ml-2">
                        <div className="flex text-2xl font-bold space-x-1">
                          {"YMM".split('').map((char, i) => (
                            <span
                              key={i}
                              className={`transition duration-500 ${lightUpIndex >= 0 ? 'text-black animate-pulse' : 'text-gray-400'}`}
                              style={{ transitionDelay: `${i * 150}ms` }}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                        <div className="flex text-xl font-bold italic">
                          {digiLineText.split('').map((letter, index) => (
                            <span
                              key={index}
                              className={`transform transition-all duration-300 ${index <= lightUpIndex ? 'text-red-600 scale-110' : 'text-gray-300'}`}
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              {letter}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons - Combinés des deux versions */}
              <div className="flex flex-col gap-4 items-center">
                {/* Le bouton principal pour SPS1 */}
                <button
                  onClick={() => navigate('/scan')}
                  className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-all shadow-md animate-soft-bounce w-64"
                >
                  {stations[0].name}
                </button>
                
                {/* NOUVEAU: Bouton pour ouvrir tous les postes en même temps */}
                <button
                  onClick={openAllStations}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all shadow-md w-64"
                >
                  Ouvrir tous les postes
                </button>
                
                {/* Affichage conditionnel des autres postes */}
                {showStations && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4 max-w-lg mx-auto">
                    {stations.slice(1).map((station) => (
                      <button
                        key={station.id}
                        onClick={() => window.open(station.path, `station_${station.id}`, 'noopener,noreferrer')}
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-all"
                      >
                        {station.id}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Ligne rouge animée en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden z-10">
        <div className="animate-bottom-line"></div>
      </div>

      {/* Footer */}
      <footer className="bg-red-700 text-white py-3 mt-auto relative z-10">
        <div className="container mx-auto flex justify-between px-4">
          <p>© 2025 YMM DigiLine - Created by FFA</p>
          <p className="text-sm">
            🕒 {currentTime.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })} - {currentTime.toLocaleTimeString('fr-FR')}
          </p>
        </div>
      </footer>
    </div>
  );
}