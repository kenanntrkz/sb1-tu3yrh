import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { AvansKaydi } from '../db/schema';
import { format } from 'date-fns';

export default function AvansKayit() {
  const dayibasilari = useLiveQuery(() => db.dayibasilari.toArray());
  const [avansTipi, setAvansTipi] = useState<'dayibasi' | 'kisi'>('dayibasi');

  const [formData, setFormData] = useState<Omit<AvansKaydi, 'id'>>({
    tarih: new Date(),
    dayibasiId: undefined,
    kisiAdi: '',
    miktar: 0,
    aciklama: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.avansKayitlari.add(formData);
      setFormData({
        tarih: new Date(),
        dayibasiId: undefined,
        kisiAdi: '',
        miktar: 0,
        aciklama: ''
      });
      alert('Avans kaydı başarıyla eklendi!');
    } catch (error) {
      console.error('Avans kaydı eklenirken hata oluştu:', error);
      alert('Avans kaydı eklenirken bir hata oluştu!');
    }
  };

  const handleInputFocus = () => {
    if (formData.miktar === 0) {
      setFormData(prev => ({ ...prev, miktar: '' as unknown as number }));
    }
  };

  const handleInputBlur = () => {
    if (formData.miktar === ('' as unknown as number)) {
      setFormData(prev => ({ ...prev, miktar: 0 }));
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Yeni Avans Kaydı</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Avans Tipi</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="dayibasi"
                checked={avansTipi === 'dayibasi'}
                onChange={() => {
                  setAvansTipi('dayibasi');
                  setFormData(prev => ({ ...prev, dayibasiId: undefined, kisiAdi: '' }));
                }}
                className="form-radio"
              />
              <span className="ml-2">Dayıbaşı</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="kisi"
                checked={avansTipi === 'kisi'}
                onChange={() => {
                  setAvansTipi('kisi');
                  setFormData(prev => ({ ...prev, dayibasiId: undefined, kisiAdi: '' }));
                }}
                className="form-radio"
              />
              <span className="ml-2">Kişi</span>
            </label>
          </div>
        </div>
        
        {avansTipi === 'dayibasi' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">Dayıbaşı</label>
            <select
              required
              value={formData.dayibasiId || ''}
              onChange={(e) => setFormData({ ...formData, dayibasiId: Number(e.target.value) || undefined })}
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
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Kişi Adı</label>
            <input
              type="text"
              required
              value={formData.kisiAdi || ''}
              onChange={(e) => setFormData({ ...formData, kisiAdi: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Kişi adını giriniz"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Miktar (₺)</label>
          <input
            type="number"
            required
            min="0"
            value={formData.miktar || ''}
            onChange={(e) => setFormData({ ...formData, miktar: e.target.value === '' ? 0 : Number(e.target.value) })}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Açıklama</label>
          <textarea
            value={formData.aciklama}
            onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
  );
}