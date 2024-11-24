import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import { format } from 'date-fns';
import type { IsKaydi, UzumKesimiKaydi, AvansKaydi, Bag, Dayibasi } from '../db/schema';
import PageTransition from '../components/PageTransition';

interface IsKaydiWithBag extends IsKaydi {
  bag?: Bag;
}

interface UzumKesimiKaydiWithDetails extends UzumKesimiKaydi {
  bag?: Bag;
  dayibasi?: Dayibasi;
}

interface AvansKaydiWithDayibasi extends AvansKaydi {
  dayibasi?: Dayibasi;
}

interface RaporData {
  isKayitlari: IsKaydiWithBag[];
  uzumKesimiKayitlari: UzumKesimiKaydiWithDetails[];
  avansKayitlari: AvansKaydiWithDayibasi[];
}

export default function GunlukRapor() {
  const [secilenTarih, setSecilenTarih] = useState(format(new Date(), 'yyyy-MM-dd'));

  const rapor = useLiveQuery<RaporData>(async () => {
    const tarih = new Date(secilenTarih);
    const formattedDate = format(tarih, 'yyyy-MM-dd');

    const isKayitlari = await db.isKayitlari
      .where('tarih')
      .equals(formattedDate)
      .toArray();

    const uzumKesimiKayitlari = await db.uzumKesimiKayitlari
      .where('tarih')
      .equals(formattedDate)
      .toArray();

    const avansKayitlari = await db.avansKayitlari
      .where('tarih')
      .equals(formattedDate)
      .toArray();

    const baglar = await db.baglar.toArray();
    const dayibasilari = await db.dayibasilari.toArray();

    return {
      isKayitlari: isKayitlari.map(kayit => ({
        ...kayit,
        bag: baglar.find(b => b.id === kayit.bagId)
      })),
      uzumKesimiKayitlari: uzumKesimiKayitlari.map(kayit => ({
        ...kayit,
        bag: baglar.find(b => b.id === kayit.bagId),
        dayibasi: dayibasilari.find(d => d.id === kayit.dayibasiId)
      })),
      avansKayitlari: avansKayitlari.map(kayit => ({
        ...kayit,
        dayibasi: dayibasilari.find(d => d.id === kayit.dayibasiId)
      }))
    };
  }, [secilenTarih]);

  const toplamOdemeler = {
    sezonluk: rapor?.isKayitlari.reduce((toplam, kayit) => toplam + kayit.toplamOdeme, 0) ?? 0,
    uzumKesimi: rapor?.uzumKesimiKayitlari.reduce((toplam, kayit) => toplam + kayit.toplamOdeme, 0) ?? 0,
    avanslar: rapor?.avansKayitlari.reduce((toplam, kayit) => toplam + kayit.miktar, 0) ?? 0
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Günlük Rapor</h1>
          <input
            type="date"
            value={secilenTarih}
            onChange={(e) => setSecilenTarih(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Toplam Ödemeler</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt>Sezonluk İşler:</dt>
                <dd className="font-medium">{toplamOdemeler.sezonluk.toLocaleString('tr-TR')} ₺</dd>
              </div>
              <div className="flex justify-between">
                <dt>Üzüm Kesimi:</dt>
                <dd className="font-medium">{toplamOdemeler.uzumKesimi.toLocaleString('tr-TR')} ₺</dd>
              </div>
              <div className="flex justify-between">
                <dt>Avanslar:</dt>
                <dd className="font-medium">{toplamOdemeler.avanslar.toLocaleString('tr-TR')} ₺</dd>
              </div>
              <div className="pt-2 border-t flex justify-between font-semibold">
                <dt>Genel Toplam:</dt>
                <dd>{(toplamOdemeler.sezonluk + toplamOdemeler.uzumKesimi + toplamOdemeler.avanslar).toLocaleString('tr-TR')} ₺</dd>
              </div>
            </dl>
          </div>
        </div>

        {rapor?.isKayitlari && rapor.isKayitlari.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Sezonluk İşler</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bağ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İş Türü</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Çalışan Sayısı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam Ödeme</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rapor.isKayitlari.map((kayit, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{kayit.bag?.ad}</td>
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

        {rapor?.uzumKesimiKayitlari && rapor.uzumKesimiKayitlari.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Üzüm Kesimi</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dayıbaşı</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bağ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vardiya</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam Ödeme</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rapor.uzumKesimiKayitlari.map((kayit, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {kayit.dayibasi?.ad} {kayit.dayibasi?.soyad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{kayit.bag?.ad}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{kayit.vardiyaTuru}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{kayit.toplamOdeme.toLocaleString('tr-TR')} ₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {rapor?.avansKayitlari && rapor.avansKayitlari.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Avanslar</h2>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kişi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Açıklama</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rapor.avansKayitlari.map((kayit, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {kayit.dayibasi ? `${kayit.dayibasi.ad} ${kayit.dayibasi.soyad} (Dayıbaşı)` : kayit.kisiAdi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{kayit.miktar.toLocaleString('tr-TR')} ₺</td>
                      <td className="px-6 py-4">{kayit.aciklama || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}