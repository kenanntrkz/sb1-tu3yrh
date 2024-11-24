import type { Dayibasi } from '../db/schema';
import { db } from '../db/schema';
import { useState } from 'react';
import DayibasiEkleForm from './DayibasiEkleForm';

interface Props {
  dayibasilari: Dayibasi[];
}

export default function DayibasiListesi({ dayibasilari }: Props) {
  const [editingDayibasi, setEditingDayibasi] = useState<Dayibasi | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu dayıbaşını silmek istediğinizden emin misiniz?')) {
      try {
        await db.dayibasilari.delete(id);
      } catch (error) {
        console.error('Dayıbaşı silinirken hata oluştu:', error);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kelter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kesi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sergi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Şerbet
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dayibasilari.map((dayibasi) => (
              <tr key={dayibasi.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayibasi.ad} {dayibasi.soyad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayibasi.telefon || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayibasi.aktifFiyatlar.kelter} ₺
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayibasi.aktifFiyatlar.kesi} ₺
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayibasi.aktifFiyatlar.sergi} ₺
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayibasi.aktifFiyatlar.serbet} ₺
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => setEditingDayibasi(dayibasi)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => dayibasi.id && handleDelete(dayibasi.id)}
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

      {editingDayibasi && (
        <DayibasiEkleForm
          dayibasi={editingDayibasi}
          onClose={() => setEditingDayibasi(null)}
        />
      )}
    </>
  );
}