import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function AvansListe() {
  const avanslar = useLiveQuery(async () => {
    const avanslar = await db.avansKayitlari.toArray();
    const dayibasilari = await db.dayibasilari.toArray();

    return avanslar.map(avans => ({
      ...avans,
      dayibasi: avans.dayibasiId ? dayibasilari.find(d => d.id === avans.dayibasiId) : null
    }));
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu avans kaydını silmek istediğinizden emin misiniz?')) {
      try {
        await db.avansKayitlari.delete(id);
      } catch (error) {
        console.error('Avans kaydı silinirken hata oluştu:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Avans Kayıtları</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kişi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Miktar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {avanslar?.map((avans) => (
              <tr key={avans.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(avans.tarih, 'd MMMM yyyy', { locale: tr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {avans.dayibasi ? `${avans.dayibasi.ad} ${avans.dayibasi.soyad} (Dayıbaşı)` : avans.kisiAdi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {avans.miktar.toLocaleString('tr-TR')} ₺
                </td>
                <td className="px-6 py-4">
                  {avans.aciklama || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => avans.id && handleDelete(avans.id)}
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
    </div>
  );
}