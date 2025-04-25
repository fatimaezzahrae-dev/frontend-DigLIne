import { useState, useEffect } from 'react';
import { Check, AlertTriangle, Search, Clock, RefreshCw, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { usePartNumberContext } from '../context/PartNumberContext';

export default function ScanPage() {
  // Récupérer la fonction de mise à jour du contexte
  const { partNumber: contextPartNumber, updatePartNumber } = usePartNumberContext();
  
  const [partNumber, setPartNumber] = useState('');
  const [previousPartNumber, setPreviousPartNumber] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showChangeNotification, setShowChangeNotification] = useState(false);
  const [workstation] = useState('SPS1');
  const [projectName] = useState('Renault HHN H12');
  const [detectedPartNumber, setDetectedPartNumber] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Mettre à jour l'historique si un part number existe déjà dans le contexte
  useEffect(() => {
    if (contextPartNumber && contextPartNumber !== detectedPartNumber) {
      setDetectedPartNumber(contextPartNumber);
      setPreviousPartNumber(contextPartNumber);
      setShowNotification(true);
      
      // Ajouter à l'historique
      const timestamp = new Date().toLocaleTimeString();
      setScanHistory(prev => [{
        partNumber: contextPartNumber,
        timestamp: timestamp,
        success: true
      }, ...prev.slice(0, 4)]);
    }
  }, [contextPartNumber]);

  const getSchemaForPartNumber = (pn) => {
    return `/api/placeholder/700/500`; // URL de l'image placeholder
  };

  const handleScan = () => {
    if (partNumber.trim() !== '') {
      setIsLoading(true);
      
      setTimeout(() => {
        if (previousPartNumber && previousPartNumber !== partNumber) {
          setPreviousPartNumber(partNumber);
          setShowChangeNotification(true);
          setTimeout(() => {
            setShowChangeNotification(false);
          }, 20 * 60 * 1000); // 20 minutes
        } else {
          setPreviousPartNumber(partNumber);
        }
        
        // Ajouter à l'historique
        const timestamp = new Date().toLocaleTimeString();
        setScanHistory(prev => [{
          partNumber: partNumber,
          timestamp: timestamp,
          success: true
        }, ...prev.slice(0, 4)]); // Garde les 5 derniers éléments
        
        setDetectedPartNumber(partNumber);
        setShowNotification(true);
        
        // Mettre à jour le contexte pour que tous les postes puissent y accéder
        updatePartNumber(partNumber);
        
        setPartNumber(''); // Effacer l'input après le scan
        setIsLoading(false);
      }, 600);
    }
  };

  const handlePartNumberChange = (e) => {
    setPartNumber(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  const toggleHistoryVisibility = () => {
    setShowHistory(prevState => !prevState);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-md">
        <div className="container mx-auto py-4 px-6 h-full flex items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo-DigLine.jpg"
              alt="Logo YMM DigiLine"
              className="h-16 w-auto"
              style={{ transform: 'scale(2)', transformOrigin: 'left center' }}
            />
          </div>
          <div className="flex-grow flex justify-center items-center">
            <h2 className="text-xl font-bold text-gray-600">
              {projectName}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-white">
              {workstation}
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-red-800 hover:bg-red-900 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Top section with input field and notification */}
      <div className={`w-full px-6 flex justify-start items-center mt-0 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50 border-b border-gray-200'}`}>
        <div className="flex gap-4 items-center w-full justify-between">
          {/* Notification de numéro de part */}
          {showNotification && (
            <div 
              className={`px-4 py-2 rounded shadow-md border flex items-center w-72 transition-all duration-300 ${
                darkMode ? 'bg-green-900 text-green-100 border-green-700' : 'bg-green-100 text-green-800 border-green-300'
              }`}
              style={{ animation: 'fadeIn 0.3s ease-in-out' }}
            >
              <span className="text-xl mr-2 flex-shrink-0">
                <Check className="w-6 h-6 text-green-500" />
              </span>
              <span className="font-mono font-bold text-lg ml-2">{detectedPartNumber}</span>
            </div>
          )}
          
          {/* Notification de changement */}
          {showChangeNotification && (
            <div 
              className={`px-4 py-2 rounded shadow-md border flex items-center transition-all duration-300 ${
                darkMode ? 'bg-amber-900 text-amber-100 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
              style={{
                marginTop: '10px',
                marginBottom: '10px',
                width: 'auto',
                textAlign: 'center',
              }}
            >
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              <span>changement vers :{detectedPartNumber} </span>
            </div>
          )}
          
          {/* Champ de saisie */}
          <div className={`flex items-center rounded-lg overflow-hidden shadow-sm transition-all ${
            darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-300'
          }`}>
            <div className="px-3 py-2">
              <Search className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder="Scanner Part Number"
              value={partNumber}
              onChange={handlePartNumberChange}
              onKeyPress={handleKeyPress}
              className={`w-48 focus:outline-none transition-colors ${
                darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'
              }`}
            />
            <button 
              onClick={handleScan} 
              disabled={isLoading || !partNumber.trim()}
              className={`px-3 py-2 flex items-center justify-center transition-colors ${
                isLoading ? 'bg-gray-300 cursor-not-allowed' : 
                darkMode ? 'bg-red-700 hover:bg-red-800 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex flex-grow relative">
        {/* Sidebar for history */}
        <div 
          className={`h-full transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          style={{ 
            width: showHistory ? '250px' : '60px',
            minWidth: showHistory ? '250px' : '60px'
          }}
        >
          {/* Title bar for history */}
          <div 
            className={`flex items-center justify-between py-3 px-4 cursor-pointer ${
              darkMode ? 
              'bg-gray-700 hover:bg-gray-600 text-gray-200' : 
              'bg-gray-50 hover:bg-gray-100 text-gray-700'
            } border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
            onClick={toggleHistoryVisibility}
          >
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              {showHistory ? (
                <span className="font-medium">Historique des scans</span>
              ) : null}
            </div>
            {showHistory ? (
              <ChevronUp className="w-5 h-5" />
            ) : null}
          </div>

          {/* History content - visible only when expanded */}
          {showHistory && (
            <div className={`overflow-y-auto h-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {scanHistory.length > 0 ? (
                <ul>
                  {scanHistory.map((item, index) => (
                    <li
                      key={index}
                      className={`p-3 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer`}
                      onClick={() => {
                        setDetectedPartNumber(item.partNumber);
                        setShowNotification(true);
                        // Mise à jour du contexte lorsqu'on clique sur un élément de l'historique
                        updatePartNumber(item.partNumber);
                      }}
                    >
                      <div className={`font-mono font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.partNumber}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.timestamp}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Aucun historique disponible
                </div>
              )}
            </div>
          )}
        </div>

        {/* Schema display area - adapts based on history panel width */}
        <main className="flex-grow flex flex-col">
          {detectedPartNumber ? (
            <div className="w-full h-full flex flex-col">
              <div className={`p-4 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <h3 className="text-lg font-semibold text-center">
                  Schéma d'insertion pour Part Number: <span className="font-mono">{detectedPartNumber}</span>
                </h3>
              </div>
              <div className="flex-grow flex items-center justify-center p-4">
                <img
                  src={getSchemaForPartNumber(detectedPartNumber)}
                  alt={`Schéma pour ${detectedPartNumber}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-white max-w-2xl mx-auto">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-center">Veuillez scanner ou entrer un Part Number pour afficher le schéma d'insertion</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className={`p-2 text-xs ${darkMode ? 'bg-gray-800 text-gray-400 border-t border-gray-700' : 'bg-gray-50 text-gray-500 border-t border-gray-200'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div>Workstation: {workstation} | Projet: {projectName}</div>
          <div>Version 2.3.0 | © 2025 YMM DigiLine</div>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Système connecté
          </div>
        </div>
      </footer>
    </div>
  );
}