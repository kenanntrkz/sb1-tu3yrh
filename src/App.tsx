import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Anasayfa from './pages/Anasayfa';
import BagYonetimi from './pages/BagYonetimi';
import DayibasiYonetimi from './pages/DayibasiYonetimi';
import UzumKesimiKayit from './pages/UzumKesimiKayit';
import UzumKesimiListe from './pages/UzumKesimiListe';
import AvansKayit from './pages/AvansKayit';
import AvansListe from './pages/AvansListe';
import IsKayit from './pages/IsKayit';
import IsListesi from './pages/IsListesi';
import GunlukRapor from './pages/GunlukRapor';
import BagRapor from './pages/BagRapor';
import GizlilikPolitikasi from './pages/GizlilikPolitikasi';
import KullanimSartlari from './pages/KullanimSartlari';
import SplashScreen from './components/SplashScreen';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Anasayfa />} />
          <Route path="/baglar" element={<BagYonetimi />} />
          <Route path="/dayibasilari" element={<DayibasiYonetimi />} />
          <Route path="/uzum-kesimi/yeni" element={<UzumKesimiKayit />} />
          <Route path="/uzum-kesimi" element={<UzumKesimiListe />} />
          <Route path="/avans/yeni" element={<AvansKayit />} />
          <Route path="/avans" element={<AvansListe />} />
          <Route path="/is-kaydi" element={<IsKayit />} />
          <Route path="/is-listesi" element={<IsListesi />} />
          <Route path="/rapor/gunluk" element={<GunlukRapor />} />
          <Route path="/rapor/bag" element={<BagRapor />} />
          <Route path="/gizlilik-politikasi" element={<GizlilikPolitikasi />} />
          <Route path="/kullanim-sartlari" element={<KullanimSartlari />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}