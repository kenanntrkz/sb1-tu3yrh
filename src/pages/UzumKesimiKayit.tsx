import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { UzumKesimiKaydi, Dayibasi, Bag } from '../db/schema';
import { format } from 'date-fns';
import PageTransition from '../components/PageTransition';

type FormData = Omit<UzumKesimiKaydi, 'id'>;

export default function UzumKesimiKayit() {
  const dayibasilari = useLiveQuery<Dayibasi[]>(() => db.dayibasilari.toArray());
  const baglar = useLiveQuery<Bag[]>(() => db.baglar.toArray());

  const [formData, setFormData] = useState<FormData>({
    tarih: new Date(),
    dayibasiId: 0,
    bagId: 0,
    kelterSayisi: 0,
    kesiSayisi: 0,
    sergiSayisi: 0,
    serbetSayisi: 0,
    vardiyaTuru: 'Tam',
    calismaSaati: 0,
    toplamOdeme: 0
  });

  const seciliDayibasi = dayibasilari?.find(d => d.id === formData.dayibasiId);

  const hesaplaToplamOdeme = () => {
    if (!seciliDayibasi) return 0;

    const { kelter, kesi, sergi, serbet } = seciliDayibasi.aktifFiyatlar;
    let toplam = 
      formData.kelterSayisi * kelter +
      formData.kesiSayisi * kesi +
      formData.sergiSayisi * sergi +
      formData.serbetSayisi * serbet;

    if (formData.vardiyaTuru === 'Yarim') {
      toplam = toplam / 2;
    } else if (formData.vardiyaTuru === 'Saatlik' && formData.calismaSaati) {
      toplam = formData.calismaSaati * 200;
    }

    return toplam;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const toplamOdeme = hesaplaToplamOdeme();
      await db.uzumKesimiKayitlari.add({
        ...formData,
        toplamOdeme
      });
      setFormData({
        tarih: new Date(),
        dayibasiId: 0,
        bagId: 0,
        kelterSayisi: 0,
        kesiSayisi: 0,
        sergiSayisi: 0,
        serbetSayisi: 0,
        vardiyaTuru: 'Tam',
        calismaSaati: 0,
        toplamOdeme: 0
      });
      alert('Kayıt başarıyla eklendi!');
    } catch (error) {
      console.error('Kayıt eklenirken hata oluştu:', error);
      alert('Kayıt eklenirken bir hata oluştu!');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Yeni Üzüm Kesimi Kaydı</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tarih</label>
              <input
                type="date"
                required
                value={format(formData.tarih, 'yyyy-MM-dd')}
                onChange={(e) => setFormData({ ...formData, tarih: new Date(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Dayıbaşı</label>
              <select
                required
                value={formData.dayibasiId}
                onChange={(e) => setFormData({ ...formData, dayibasiId: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seçiniz</option>
                {dayibasilari?.map((dayibasi) => (
                  <option key={dayibasi.id} value={dayibasi.id}>
                    {dayibasi.ad} {dayibasi.soyad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bağ</label>
              <select
                required
                value={formData.bagId}
                onChange={(e) => setFormData({ ...formData, bagId: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seçiniz</option>
                {baglar?.map((bag) => (
                  <option key={bag.id} value={bag.id}>
                    {bag.ad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Vardiya Türü</label>
              <select
                required
                value={formData.vardiyaTuru}
                onChange={(e) => setFormData({ ...formData, vardiyaTuru: e.target.value as 'Tam' | 'Yarim' | 'Saatlik' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Tam">Tam Gün (06:00-13:00)</option>
                <option value="Yarim">Yarım Gün (16:00-20:00)</option>
                <option value="Saatlik">Saatlik</option>
              </select>
            </div>
          </div>

          {formData.vardiyaTuru === 'Saatlik' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Çalışma Saati</label>
              <input
                type="number"
                required
                min="0"
                step="0.5"
                value={formData.calismaSaati}
                onChange={(e) => setFormData({ ...formData, calismaSaati: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kelter Sayısı</label>
              <input
                type="number"
                min="0"
                value={formData.kelterSayisi}
                onChange={(e) => setFormData({ ...formData, kelterSayisi: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Kesi Sayısı</label>
              <input
                type="number"
                min="0"
                value={formData.kesiSayisi}
                onChange={(e) => setFormData({ ...formData, kesiSayisi: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Sergi Sayısı</label>
              <input
                type="number"
                min="0"
                value={formData.sergiSayisi}
                onChange={(e) => setFormData({ ...formData, sergiSayisi: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Şerbet Sayısı</label>
              <input
                type="number"
                min="0"
                value={formData.serbetSayisi}
                onChange={(e) => setFormData({ ...formData, serbetSayisi: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold">
              Toplam Ödeme: {hesaplaToplamOdeme().toLocaleString('tr-TR')} ₺
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}