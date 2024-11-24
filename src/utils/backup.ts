import { db } from '../db/schema';
import { format } from 'date-fns';

export async function createBackup() {
  try {
    const backup = {
      baglar: await db.baglar.toArray(),
      dayibasilari: await db.dayibasilari.toArray(),
      isKayitlari: await db.isKayitlari.toArray(),
      uzumKesimiKayitlari: await db.uzumKesimiKayitlari.toArray(),
      avansKayitlari: await db.avansKayitlari.toArray(),
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `yovmiye-takip-yedek-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.yvt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Yedek oluşturulurken hata:', error);
    throw error;
  }
}

export async function restoreBackup(file: File): Promise<boolean> {
  try {
    const text = await file.text();
    const backup = JSON.parse(text);

    // Verify backup structure
    const requiredTables = ['baglar', 'dayibasilari', 'isKayitlari', 'uzumKesimiKayitlari', 'avansKayitlari'];
    const missingTables = requiredTables.filter(table => !backup[table]);
    
    if (missingTables.length > 0) {
      throw new Error(`Geçersiz yedek dosyası: Eksik tablolar ${missingTables.join(', ')}`);
    }

    // Veritabanını temizle
    await db.transaction('rw', db.tables, async () => {
      await Promise.all([
        db.baglar.clear(),
        db.dayibasilari.clear(),
        db.isKayitlari.clear(),
        db.uzumKesimiKayitlari.clear(),
        db.avansKayitlari.clear()
      ]);

      // Yedekten verileri geri yükle
      await Promise.all([
        db.baglar.bulkAdd(backup.baglar),
        db.dayibasilari.bulkAdd(backup.dayibasilari),
        db.isKayitlari.bulkAdd(backup.isKayitlari),
        db.uzumKesimiKayitlari.bulkAdd(backup.uzumKesimiKayitlari),
        db.avansKayitlari.bulkAdd(backup.avansKayitlari)
      ]);
    });

    return true;
  } catch (error) {
    console.error('Yedek geri yüklenirken hata:', error);
    throw error;
  }
}