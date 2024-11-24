import { useState } from 'react';
import { db } from '../db/schema';

interface Props {
  onClose: () => void;
}

export default function BagEkleForm({ onClose }: Props) {
  const [formData, setFormData] = useState({
    ad: '',
    konum: '',
    donum: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.baglar.add(formData);
      onClose();
    } catch (error) {
      console.error('Bağ eklenirken hata oluştu:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Yeni Bağ Ekle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bağ Adı
            </label>
            <input
              type="text"
              required
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Konum
            </label>
            <input
              type="text"
              required
              value={formData.konum}
              onChange={(e) => setFormData({ ...formData, konum: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dönüm
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.donum}
              onChange={(e) => setFormData({ ...formData, donum: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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