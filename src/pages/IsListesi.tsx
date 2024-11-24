import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { IsKaydi, Bag } from '../db/schema';
import PageTransition from '../components/PageTransition';
import { showToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import IsDetayModal from '../components/IsDetayModal';
import HizliAvansModal from '../components/HizliAvansModal';
import { useState, useMemo } from 'react';

interface IsKaydiWithBag extends IsKaydi {
  bag?: Bag;
}

export default function IsListesi() {
  const [secilenTarih, setSecilenTarih] = useState<Date | null>(null);
  const [showHizliAvans, setShowHizliAvans] = useState(false);
  const [siralama, setSiralama] = useState<{ alan: keyof IsKaydi; yon: 'asc' | 'desc' }>({
    alan: 'tarih',
    yon: 'desc'
  });

  const kayitlar = useLiveQuery<IsKaydiWithBag[]>(async () => {
    const kayitlar = await db.isKayitlari.toArray();
    const baglar = await db.baglar.toArray();

    return kayitlar.map(kayit => ({
      ...kayit,
      bag: baglar.find(b => b.id === kayit.bagId)
    }));
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
      try {
        await db.isKayitlari.delete(id);
        showToast.success('Kayıt başarıyla silindi');
      } catch (error) {
        console.error('Kayıt silinirken hata oluştu:', error);
        showToast.error('Kayıt silinirken bir hata oluştu');
      }
    }
  };

  const handleSiralamaClick = (alan: keyof IsKaydi) => {
    setSiralama(prev => ({
      alan,
      yon: prev.alan === alan && prev.yon === 'asc' ? 'desc' : 'asc'
    }));
  };

  const secilenTarihKayitlari = useMemo(() => {
    if (!secilenTarih || !kayitlar) return [];
    return kayitlar.filter(kayit => 
      format(new Date(kayit.tarih), 'yyyy-MM-dd') === format(secilenTarih, 'yyyy-MM-dd')
    );
  }, [secilenTarih, kayitlar]);

  const filtrelenmisKayitlar = useMemo(() => {
    if (!kayitlar) return [];
    
    return [...kayitlar].sort((a, b) => {
      const aValue = a[siralama.alan];
      const bValue = b[siralama.alan];
      
      if (siralama.alan === 'tarih') {
        const aDate = new Date(aValue as Date);
        const bDate = new Date(bValue as Date);
        return siralama.yon === 'asc' ? 
          aDate.getTime() - bDate.getTime() : 
          bDate.getTime() - aDate.getTime();
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return siralama.yon === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [kayitlar, siralama]);

  if (!kayitlar) {
    return <LoadingSpinner />;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">İş Kayıtları</h1>
          <button
            onClick={() => setShowHizliAvans(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Hızlı Avans
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSiralamaClick('tarih')}
                >
                  Tarih {siralama.alan === 'tarih' && (siralama.yon === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bağ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İş Türü
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Çalışan Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Toplam Ödeme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtrelenmisKayitlar.map((kayit) => (
                <tr key={kayit.id} className="hover:bg-gray-50">
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-blue-600"
                    onClick={() => setSecilenTarih(new Date(kayit.tarih))}
                  >
                    {format(new Date(kayit.tarih), 'd MMMM yyyy', { locale: tr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {kayit.bag?.ad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {kayit.isTuru}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {kayit.calisanlar?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {kayit.toplamOdeme.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => kayit.id && handleDelete(kayit.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {secilenTarih && secilenTarihKayitlari.length > 0 && (
          <IsDetayModal
            kayitlar={secilenTarihKayitlari}
            tarih={secilenTarih}
            onClose={() => setSecilenTarih(null)}
          />
        )}

        {showHizliAvans && (
          <HizliAvansModal onClose={() => setShowHizliAvans(false)} />
        )}
      </div>
    </PageTransition>
  );
}