import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, AlertTriangle, Clock, ChevronUp } from 'lucide-react';
import { usePartNumberContext } from '../context/PartNumberContext';

export default function StationPage({ stationId }) {
  // Récupérer l'ID du poste depuis les props ou les paramètres d'URL
  const params = useParams();
  const id = stationId || params.id || '';
  
  // Récupérer le numéro de part depuis le contexte global
  const { partNumber, scanTime } = usePartNumberContext();
  
  const [darkMode, setDarkMode] = useState(false);
  const [projectName] = useState('Renault HHN H12');
  const [detectedPartNumber, setDetectedPartNumber] = useState('');
  const [previousPartNumber, setPreviousPartNumber] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showChangeNotification, setShowChangeNotification] = useState(false);

  // Mettre à jour l'affichage quand un nouveau numéro de part est détecté
  useEffect(() => {
    if (partNumber && partNumber !== detectedPartNumber) {
      if (detectedPartNumber && detectedPartNumber !== partNumber) {
        setPreviousPartNumber(detectedPartNumber);
        setShowChangeNotification(true);
        setTimeout(() => {
          setShowChangeNotification(false);
        }, 20 * 60 * 1000); // 20 minutes
      }
      
      setDetectedPartNumber(partNumber);
      setShowNotification(true);
    }
  }, [partNumber, detectedPartNumber]);

  const getSchemaForPartNumber = (pn, station) => {
    // Cette fonction récupérerait normalement le schéma spécifique au poste
    return `/api/placeholder/700/500`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      {/* Header - Identique à ScanPage */}
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
              {id}
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

      {/* Section de notification - Adaptée depuis ScanPage */}
      <div className={`w-full px-6 flex justify-start items-center mt-0 py-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50 border-b border-gray-200'}`}>
        <div className="flex gap-4 items-center w-full justify-between">
          {/* Notification de numéro de part */}
          {showNotification && detectedPartNumber && (
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
          
          {!detectedPartNumber && (
            <div 
              className={`px-4 py-2 rounded shadow-md border flex items-center transition-all duration-300 ${
                darkMode ? 'bg-amber-900 text-amber-100 border-amber-700' : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
              <span>En attente d'un scan sur le poste SPS1</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content container - Sans la sidebar */}
      <main className="flex-grow flex flex-col">
        {detectedPartNumber ? (
          <div className="w-full h-full flex flex-col">
            <div className={`p-4 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-800'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <h3 className="text-lg font-semibold text-center">
                Schéma d'insertion pour Part Number: <span className="font-mono">{detectedPartNumber}</span>
              </h3>
              <h4 className="text-md text-center text-gray-500">
                Poste: {id}
              </h4>
            </div>
            <div className="flex-grow flex items-center justify-center p-4">
              <img
                src={getSchemaForPartNumber(detectedPartNumber, id)}
                alt={`Schéma pour ${detectedPartNumber} au poste ${id}`}
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
              <p className="text-center">En attente d'un scan sur le poste SPS1</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`p-2 text-xs ${darkMode ? 'bg-gray-800 text-gray-400 border-t border-gray-700' : 'bg-gray-50 text-gray-500 border-t border-gray-200'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div>Workstation: {id} | Projet: {projectName}</div>
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