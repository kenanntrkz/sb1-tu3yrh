import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { IsKaydi, Bag } from '../db/schema';

interface Props {
  kayitlar: (IsKaydi & { bag?: Bag })[];
  tarih: Date;
  onClose: () => void;
}

const isTurleriTR: Record<string, string> = {
  Budama: 'Budama',
  IpBaglama: 'İp Bağlama',
  AraYapma: 'Ara Yapma',
  YaprakAcma: 'Yaprak Açma',
  UzumKesimi: 'Üzüm Kesimi',
  IpKesme: 'İp Kesme'
};

export default function IsDetayModal({ kayitlar, tarih, onClose }: Props) {
  const toplamCalisan = kayitlar.reduce((toplam, kayit) => 
    toplam + (kayit.calisanlar?.length || 0), 0
  );

  const toplamOdeme = kayitlar.reduce((toplam, kayit) => 
    toplam + kayit.toplamOdeme, 0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {format(tarih, 'd MMMM yyyy', { locale: tr })} Tarihli İşler
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>Toplam Çalışan: {toplamCalisan} kişi</p>
            <p>Toplam Ödeme: {toplamOdeme.toLocaleString('tr-TR')} ₺</p>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {kayitlar.map((kayit, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{kayit.bag?.ad}</h3>
                    <p className="text-gray-600">{isTurleriTR[kayit.isTuru]}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{kayit.toplamOdeme.toLocaleString('tr-TR')} ₺</div>
                    <div className="text-sm text-gray-500">
                      {kayit.calisanlar?.length || 0} Çalışan
                    </div>
                  </div>
                </div>

                {kayit.calisanlar && kayit.calisanlar.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Çalışanlar</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {kayit.calisanlar.map((calisan, i) => (
                        <div key={i} className="bg-white p-3 rounded shadow-sm">
                          <div className="flex justify-between">
                            <span>{calisan.ad}</span>
                            <span className="font-medium">{calisan.gunlukUcret} ₺</span>
                          </div>
                          {calisan.avanslar && calisan.avanslar.length > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              {calisan.avanslar.length} Avans Kesintisi
                            </div>
                          )}
                          <div className="text-sm text-gray-600 mt-1">
                            Net Ödeme: {calisan.odenecekTutar} ₺
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {kayit.notlar && (
                  <div className="mt-4 text-sm text-gray-600">
                    <strong>Not:</strong> {kayit.notlar}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}