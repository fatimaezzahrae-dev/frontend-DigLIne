import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ScanPage from './components/ScanPage';
import StationPage from './components/StationPage';
import { PartNumberProvider } from './context/PartNumberContext';

function App() {
  // Liste des postes (peut être dans une configuration séparée)
  const workstations = [
    'SPS2', 'SPS3', 'SPS4', 'SPS5', 'SPS6', 'SPS7', 'SPS8', 'SPS9', 'SPS10',
    'SPS11', 'SPS12', 'SPS13', 'SPS14', 'SPS15', 'SPS16', 'SPS17', 'SPS18', 'SPS19', 'SPS20'
  ];

  return (
    <PartNumberProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          
          {/* Routes dynamiques pour tous les autres postes */}
          {workstations.map(station => (
            <Route 
              key={station} 
              path={`/station/${station.toLowerCase()}`} 
              element={<StationPage stationId={station} />} 
            />
          ))}
          
          {/* Route générique avec paramètre pour tout autre poste non listé */}
          <Route path="/station/:id" element={<StationPage />} />
        </Routes>
      </Router>
    </PartNumberProvider>
  );
}

export default App;