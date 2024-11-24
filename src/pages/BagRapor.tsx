import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function BagRapor() {
  const [secilenBagId, setSecilenBagId] = useState<number>(0);
  const [baslangicTarihi, setBaslangicTarihi] = useState(format(new Date(new Date().getFullYear(), 0, 1), 'yyyy-MM-dd'));
  const [bitisTarihi, setBitisTarihi] = useState(format(new Date(), 'yyyy-MM-dd'));

  const baglar = useLiveQuery(() => db.baglar.toArray());

  const rapor = useLiveQuery(async () => {
    if (!secilenBagId) return null;

    // Sezonluk işler
    const isKayitlari = await db.isKayitlari
      .where('bagId')
      .equals(secilenBagId)
      .and(kayit => {
        const tarih = new Date(kayit.tarih);
        const baslangic = new Date(baslangicTarihi);
        const bitis = new Date(bitisTarihi);
        bitis.setHours(23, 59, 59, 999);
        return tarih >= baslangic && tarih <= bitis;
      })
      .toArray();

    // Üzüm kesimi kayıtları
    const uzumKesimiKayitlari = await db.uzumKesimiKayitlari
      .where('bagId')
      .equals(secilenBagId)
      .and(kayit => {
        const tarih = new Date(kayit.tarih);
        const baslangic = new Date(baslangicTarihi);
        const bitis = new Date(bitisTarihi);
        bitis.setHours(23, 59, 59, 999);
        return tarih >= baslangic && tarih <= bitis;
      })
      .toArray();

    // Dayıbaşıları getir
    const dayibasilari = await db.dayibasilari.toArray();

    return {
      isKayitlari,
      uzumKesimiKayitlari: uzumKesimiKayitlari.map(kayit => ({
        ...kayit,
        dayibasi: dayibasilari.find(d => d.id === kayit.dayibasiId)
      }))
    };
  }, [secilenBagId, baslangicTarihi, bitisTarihi]);

  const toplamMaliyetler = {
    sezonluk: rapor?.isKayitlari.reduce((toplam, kayit) => toplam + kayit.toplamOdeme, 0) || 0,
    uzumKesimi: rapor?.uzumKesimiKayitlari.reduce((toplam, kayit) => toplam + kayit.toplamOdeme, 0) || 0
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <h1 className="text-2xl font-bold">Bağ Raporu</h1>
        <div className="flex-grow"></div>
        <select
          value={secilenBagId}
          onChange={(e) => setSecilenBagId(Number(e.target.value))}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="0">Bağ Seçiniz</option>
          {baglar?.map((bag) => (
            <option key={bag.id} value={bag.id}>
              {bag.ad}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={baslangicTarihi}
          onChange={(e) => setBaslangicTarihi(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <input
          type="date"
          value={bitisTarihi}
          onChange={(e) => setBitisTarihi(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {secilenBagId > 0 && rapor && (
        <>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Toplam Maliyetler</h3>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm text-gray-500">Sezonluk İşler</dt>
                <dd className="mt-1 text-lg font-semibold">
                  {toplamMaliyetler.sezonluk.toLocaleString('tr-TR')} ₺
                </dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm text-gray-500">Üzüm Kesimi</dt>
                <dd className="mt-1 text-lg font-semibold">
                  {toplamMaliyetler.uzumKesimi.toLocaleString('tr-TR')} ₺
                </dd>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <dt className="text-sm text-gray-500">Toplam Maliyet</dt>
                <dd className="mt-1 text-lg font-semibold text-blue-600">
                  {(toplamMaliyetler.sezonluk + toplamMaliyetler.uzumKesimi).toLocaleString('tr-TR')} ₺
                </dd>
              </div>
            </dl>
          </div>

          {rapor.isKayitlari.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Sezonluk İşler</h2>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İş Türü</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan Sayısı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam Ödeme</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rapor.isKayitlari.map((kayit, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(kayit.tarih), 'd MMMM yyyy', { locale: tr })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.isTuru}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.calisanlar.length}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.toplamOdeme.toLocaleString('tr-TR')} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {rapor.uzumKesimiKayitlari.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Üzüm Kesimi</h2>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dayıbaşı</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vardiya</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kesi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sergi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şerbet</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rapor.uzumKesimiKayitlari.map((kayit, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(new Date(kayit.tarih), 'd MMMM yyyy', { locale: tr })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {kayit.dayibasi?.ad} {kayit.dayibasi?.soyad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.vardiyaTuru}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.kelterSayisi}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.kesiSayisi}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.sergiSayisi}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.serbetSayisi}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kayit.toplamOdeme.toLocaleString('tr-TR')} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}