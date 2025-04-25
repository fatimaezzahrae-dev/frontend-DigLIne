import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte
const PartNumberContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const usePartNumberContext = () => useContext(PartNumberContext);

// Provider du contexte
export const PartNumberProvider = ({ children }) => {
  const [partNumber, setPartNumber] = useState('');
  const [scanTime, setScanTime] = useState(null);

  // Écouter les changements dans le localStorage pour la synchronisation entre fenêtres
  useEffect(() => {
    // Vérifier si un numéro de pièce existe déjà dans le localStorage au chargement
    const storedPartNumber = localStorage.getItem('currentPartNumber');
    const storedScanTime = localStorage.getItem('scanTime');
    
    if (storedPartNumber) {
      setPartNumber(storedPartNumber);
    }
    
    if (storedScanTime) {
      setScanTime(storedScanTime);
    }

    // Fonction pour gérer les événements de storage pour la synchronisation entre fenêtres
    const handleStorageChange = (e) => {
      if (e.key === 'currentPartNumber') {
        setPartNumber(e.newValue || '');
      }
      if (e.key === 'scanTime') {
        setScanTime(e.newValue || null);
      }
    };

    // Écouter les événements de storage
    window.addEventListener('storage', handleStorageChange);
    
    // Nettoyage de l'écouteur d'événements
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fonction pour mettre à jour le numéro de pièce
  const updatePartNumber = (newPartNumber) => {
    setPartNumber(newPartNumber);
    const now = new Date().toISOString();
    setScanTime(now);
    
    // Stocker dans localStorage pour la synchronisation entre fenêtres
    localStorage.setItem('currentPartNumber', newPartNumber);
    localStorage.setItem('scanTime', now);
  };

  // Fonction pour effacer le numéro de pièce
  const clearPartNumber = () => {
    setPartNumber('');
    setScanTime(null);
    
    // Effacer du localStorage
    localStorage.removeItem('currentPartNumber');
    localStorage.removeItem('scanTime');
  };

  return (
    <PartNumberContext.Provider value={{ 
      partNumber, 
      scanTime, 
      updatePartNumber,
      clearPartNumber 
    }}>
      {children}
    </PartNumberContext.Provider>
  );
};