import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function UzumKesimiListe() {
  const kayitlar = useLiveQuery(async () => {
    const kayitlar = await db.uzumKesimiKayitlari.toArray();
    const baglar = await db.baglar.toArray();
    const dayibasilari = await db.dayibasilari.toArray();

    return kayitlar.map(kayit => ({
      ...kayit,
      bag: baglar.find(b => b.id === kayit.bagId),
      dayibasi: dayibasilari.find(d => d.id === kayit.dayibasiId)
    }));
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
      try {
        await db.uzumKesimiKayitlari.delete(id);
      } catch (error) {
        console.error('Kayıt silinirken hata oluştu:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Üzüm Kesimi Kayıtları</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dayıbaşı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bağ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vardiya
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Toplam
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {kayitlar?.map((kayit) => (
              <tr key={kayit.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(kayit.tarih, 'd MMMM yyyy', { locale: tr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {kayit.dayibasi?.ad} {kayit.dayibasi?.soyad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {kayit.bag?.ad}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {kayit.vardiyaTuru === 'Tam' && 'Tam Gün'}
                  {kayit.vardiyaTuru === 'Yarim' && 'Yarım Gün'}
                  {kayit.vardiyaTuru === 'Saatlik' && `${kayit.calismaSaati} Saat`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {kayit.kelterSayisi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {kayit.kesiSayisi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {kayit.sergiSayisi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {kayit.serbetSayisi}
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
    </div>
  );
}