import { useState } from 'react';
import { db } from '../db/schema';
import type { Dayibasi } from '../db/schema';

interface Props {
  onClose: () => void;
  dayibasi?: Dayibasi;
}

export default function DayibasiEkleForm({ onClose, dayibasi }: Props) {
  const [formData, setFormData] = useState<Omit<Dayibasi, 'id'>>({
    ad: dayibasi?.ad || '',
    soyad: dayibasi?.soyad || '',
    telefon: dayibasi?.telefon || '',
    aktifFiyatlar: dayibasi?.aktifFiyatlar || {
      kelter: 1100,
      kesi: 850,
      sergi: 1100,
      serbet: 1300
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (dayibasi?.id) {
        await db.dayibasilari.update(dayibasi.id, formData);
      } else {
        await db.dayibasilari.add(formData);
      }
      onClose();
    } catch (error) {
      console.error('Dayıbaşı kaydedilirken hata oluştu:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {dayibasi ? 'Dayıbaşı Düzenle' : 'Yeni Dayıbaşı Ekle'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad</label>
            <input
              type="text"
              required
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Soyad</label>
            <input
              type="text"
              required
              value={formData.soyad}
              onChange={(e) => setFormData({ ...formData, soyad: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              type="tel"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fiyatlandırma</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kelter</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.aktifFiyatlar.kelter}
                  onChange={(e) => setFormData({
                    ...formData,
                    aktifFiyatlar: {
                      ...formData.aktifFiyatlar,
                      kelter: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kesi</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.aktifFiyatlar.kesi}
                  onChange={(e) => setFormData({
                    ...formData,
                    aktifFiyatlar: {
                      ...formData.aktifFiyatlar,
                      kesi: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sergi</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.aktifFiyatlar.sergi}
                  onChange={(e) => setFormData({
                    ...formData,
                    aktifFiyatlar: {
                      ...formData.aktifFiyatlar,
                      sergi: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Şerbet</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.aktifFiyatlar.serbet}
                  onChange={(e) => setFormData({
                    ...formData,
                    aktifFiyatlar: {
                      ...formData.aktifFiyatlar,
                      serbet: Number(e.target.value)
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}