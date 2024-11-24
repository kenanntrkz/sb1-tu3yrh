import Dexie, { Table } from 'dexie';

export interface Isci {
  id?: number;
  ad: string;
  soyad: string;
  cinsiyet: 'Erkek' | 'Kadın';
  telefon?: string;
}

export interface Dayibasi {
  id?: number;
  ad: string;
  soyad: string;
  telefon?: string;
  aktifFiyatlar: {
    kelter: number;
    kesi: number;
    sergi: number;
    serbet: number;
  };
}

export interface Bag {
  id?: number;
  ad: string;
  konum: string;
  donum: number;
}

export interface Calisan {
  ad: string;
  gunlukUcret: number;
  avanslar: number[];  // Avans kayıt ID'leri
  odenecekTutar: number;
}

export interface IsKaydi {
  id?: number;
  tarih: Date;
  bagId: number;
  isTuru: 'Budama' | 'IpBaglama' | 'AraYapma' | 'YaprakAcma' | 'UzumKesimi' | 'IpKesme';
  calisanlar: Calisan[];
  toplamOdeme: number;
  notlar?: string;
}

export interface UzumKesimiKaydi {
  id?: number;
  tarih: Date;
  dayibasiId: number;
  bagId: number;
  kelterSayisi: number;
  kesiSayisi: number;
  sergiSayisi: number;
  serbetSayisi: number;
  vardiyaTuru: 'Tam' | 'Yarim' | 'Saatlik';
  calismaSaati?: number;
  toplamOdeme: number;
}

export interface AvansKaydi {
  id?: number;
  tarih: Date;
  dayibasiId?: number;
  kisiAdi?: string;
  miktar: number;
  aciklama?: string;
  isKaydiId?: number;  // Hangi iş kaydında kullanıldığını takip etmek için
}

export class YovmiyeDB extends Dexie {
  isciler!: Table<Isci>;
  dayibasilari!: Table<Dayibasi>;
  baglar!: Table<Bag>;
  isKayitlari!: Table<IsKaydi>;
  uzumKesimiKayitlari!: Table<UzumKesimiKaydi>;
  avansKayitlari!: Table<AvansKaydi>;

  constructor() {
    super('yovmiyeDB');
    this.version(1).stores({
      isciler: '++id, ad, soyad',
      dayibasilari: '++id, ad, soyad',
      baglar: '++id, ad',
      isKayitlari: '++id, tarih, bagId, isTuru',
      uzumKesimiKayitlari: '++id, tarih, dayibasiId, bagId',
      avansKayitlari: '++id, tarih, dayibasiId, kisiAdi, isKaydiId'
    });
  }
}

export const db = new YovmiyeDB();