import { useState } from 'react';
import { db } from '../db/schema';
import { toast } from 'react-hot-toast';

interface Props {
  onClose: () => void;
}

export default function HizliAvansModal({ onClose }: Props) {
  const [formData, setFormData] = useState({
    kisiAdi: '',
    miktar: 0,
    aciklama: ''
  });

  const handleInputFocus = (field: 'miktar') => {
    if (formData[field] === 0) {
      setFormData(prev => ({ ...prev, [field]: '' as unknown as number }));
    }
  };

  const handleInputBlur = (field: 'miktar') => {
    if (formData[field] === ('' as unknown as number)) {
      setFormData(prev => ({ ...prev, [field]: 0 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.kisiAdi || !formData.miktar) {
      toast.error('Lütfen tüm alanları doldurunuz');
      return;
    }

    try {
      await db.avansKayitlari.add({
        tarih: new Date(),
        kisiAdi: formData.kisiAdi,
        miktar: formData.miktar,
        aciklama: formData.aciklama
      });

      toast.success('Avans başarıyla kaydedildi');
      onClose();
    } catch (error) {
      console.error('Avans kaydedilirken hata:', error);
      toast.error('Avans kaydedilirken bir hata oluştu');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hızlı Avans Ekle</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kişi Adı</label>
              <input
                type="text"
                required
                value={formData.kisiAdi}
                onChange={(e) => setFormData({ ...formData, kisiAdi: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Kişi adını giriniz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Miktar (₺)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.miktar || ''}
                onChange={(e) => setFormData({ ...formData, miktar: e.target.value === '' ? 0 : Number(e.target.value) })}
                onFocus={() => handleInputFocus('miktar')}
                onBlur={() => handleInputBlur('miktar')}
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

            <div className="flex justify-end space-x-3 mt-6">
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
    </div>
  );
}