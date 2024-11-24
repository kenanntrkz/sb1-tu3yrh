import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { IsKaydi, Calisan, AvansKaydi } from '../db/schema';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface CalisanForm extends Omit<Calisan, 'avanslar' | 'odenecekTutar'> {
  avanslar: AvansKaydi[];
}

export default function IsKayit() {
  const baglar = useLiveQuery(() => db.baglar.toArray());
  const avanslar = useLiveQuery(() => 
    db.avansKayitlari
      .filter(avans => avans.isKaydiId === null || avans.isKaydiId === undefined)
      .toArray()
  );

  const [formData, setFormData] = useState<Omit<IsKaydi, 'id' | 'calisanlar' | 'toplamOdeme'>>({
    tarih: new Date(),
    bagId: 0,
    isTuru: 'Budama',
    notlar: ''
  });

  const [calisanlar, setCalisanlar] = useState<CalisanForm[]>([]);
  const [yeniCalisan, setYeniCalisan] = useState<CalisanForm>({
    ad: '',
    gunlukUcret: 0,
    avanslar: []
  });

  const handleInputFocus = (field: keyof typeof yeniCalisan) => {
    if (yeniCalisan[field] === 0) {
      setYeniCalisan(prev => ({ ...prev, [field]: '' as any }));
    }
  };

  const handleInputBlur = (field: keyof typeof yeniCalisan) => {
    if (yeniCalisan[field] === '') {
      setYeniCalisan(prev => ({ ...prev, [field]: 0 }));
    }
  };

  const handleCalisanEkle = () => {
    if (!yeniCalisan.ad || !yeniCalisan.gunlukUcret) {
      toast.error('Lütfen çalışan adını ve günlük ücreti giriniz');
      return;
    }
    setCalisanlar([...calisanlar, yeniCalisan]);
    setYeniCalisan({ ad: '', gunlukUcret: 0, avanslar: [] });
  };

  const handleCalisanSil = (index: number) => {
    setCalisanlar(calisanlar.filter((_, i) => i !== index));
  };

  const handleAvansEkle = (calisanIndex: number, avans: AvansKaydi) => {
    const yeniCalisanlar = [...calisanlar];
    yeniCalisanlar[calisanIndex].avanslar.push(avans);
    setCalisanlar(yeniCalisanlar);
  };

  const handleAvansKaldir = (calisanIndex: number, avansIndex: number) => {
    const yeniCalisanlar = [...calisanlar];
    yeniCalisanlar[calisanIndex].avanslar.splice(avansIndex, 1);
    setCalisanlar(yeniCalisanlar);
  };

  const hesaplaOdenecekTutar = (calisan: CalisanForm) => {
    const toplamAvans = calisan.avanslar.reduce((toplam, avans) => toplam + avans.miktar, 0);
    return calisan.gunlukUcret - toplamAvans;
  };

  const hesaplaToplamOdeme = () => {
    return calisanlar.reduce((toplam, calisan) => toplam + calisan.gunlukUcret, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calisanlar.length === 0) {
      toast.error('En az bir çalışan eklemelisiniz');
      return;
    }

    try {
      const isKaydi = await db.isKayitlari.add({
        ...formData,
        calisanlar: calisanlar.map(calisan => ({
          ...calisan,
          avanslar: calisan.avanslar.map(a => a.id!) as number[],
          odenecekTutar: hesaplaOdenecekTutar(calisan)
        })),
        toplamOdeme: hesaplaToplamOdeme()
      });

      // Avansları güncelle
      await Promise.all(
        calisanlar.flatMap(calisan =>
          calisan.avanslar.map(avans =>
            db.avansKayitlari.update(avans.id!, { isKaydiId: isKaydi })
          )
        )
      );

      setFormData({
        tarih: new Date(),
        bagId: 0,
        isTuru: 'Budama',
        notlar: ''
      });
      setCalisanlar([]);
      toast.success('İş kaydı başarıyla eklendi!');
    } catch (error) {
      console.error('İş kaydı eklenirken hata oluştu:', error);
      toast.error('İş kaydı eklenirken bir hata oluştu!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Yeni İş Kaydı</h1>
      
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">İş Türü</label>
          <select
            required
            value={formData.isTuru}
            onChange={( e) => setFormData({ ...formData, isTuru: e.target.value as IsKaydi['isTuru'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Budama">Budama</option>
            <option value="IpBaglama">İp Bağlama</option>
            <option value="AraYapma">Ara Yapma</option>
            <option value="YaprakAcma">Yaprak Açma</option>
            <option value="UzumKesimi">Üzüm Kesimi</option>
            <option value="IpKesme">İp Kesme</option>
          </select>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">Çalışanlar</h2>
          
          <div className="space-y-4">
            {calisanlar.map((calisan, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{calisan.ad}</h3>
                    <p className="text-sm text-gray-600">Günlük Ücret: {calisan.gunlukUcret} ₺</p>
                    {calisan.avanslar.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Avanslar:</p>
                        <ul className="text-sm text-gray-600">
                          {calisan.avanslar.map((avans, avansIndex) => (
                            <li key={avansIndex} className="flex items-center space-x-2">
                              <span>{avans.miktar} ₺</span>
                              <button
                                type="button"
                                onClick={() => handleAvansKaldir(index, avansIndex)}
                                className="text-red-600 text-xs"
                              >
                                (Kaldır)
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <p className="mt-2 font-medium">
                      Ödenecek: {hesaplaOdenecekTutar(calisan)} ₺
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => handleCalisanSil(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                
                {avanslar && avanslar.length > 0 && (
                  <div className="mt-3">
                    <select
                      className="text-sm border-gray-300 rounded-md"
                      onChange={(e) => {
                        const avans = avanslar.find(a => a.id === Number(e.target.value));
                        if (avans) handleAvansEkle(index, avans);
                      }}
                      value=""
                    >
                      <option value="">Avans Ekle...</option>
                      {avanslar
                        .filter(a => a.kisiAdi === calisan.ad)
                        .map(avans => (
                          <option key={avans.id} value={avans.id}>
                            {format(avans.tarih, 'dd.MM.yyyy')} - {avans.miktar} ₺
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )}
              </div>
            ))}

            <div className="flex space-x-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Çalışan Adı</label>
                <input
                  type="text"
                  value={yeniCalisan.ad}
                  onChange={(e) => setYeniCalisan({ ...yeniCalisan, ad: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Günlük Ücret</label>
                <input
                  type="number"
                  value={yeniCalisan.gunlukUcret}
                  onChange={(e) => setYeniCalisan({ ...yeniCalisan, gunlukUcret: e.target.value === '' ? '' as any : Number(e.target.value) })}
                  onFocus={() => handleInputFocus('gunlukUcret')}
                  onBlur={() => handleInputBlur('gunlukUcret')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleCalisanEkle}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notlar</label>
          <textarea
            value={formData.notlar}
            onChange={(e) => setFormData({ ...formData, notlar: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
  );
}