import { useState } from 'react';
import { createBackup, restoreBackup } from '../utils/backup';
import Button from './Button';
import { toast } from 'react-hot-toast';

export default function BackupRestore() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      await createBackup();
      toast.success('Yedek başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Yedek oluşturulurken hata:', error);
      toast.error('Yedek oluşturulurken bir hata oluştu!');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.yvt')) {
      toast.error('Lütfen geçerli bir .yvt yedek dosyası seçin!');
      return;
    }

    if (window.confirm('Yedek geri yüklenirken mevcut veriler silinecektir. Devam etmek istiyor musunuz?')) {
      setIsRestoring(true);
      try {
        await restoreBackup(file);
        toast.success('Yedek başarıyla geri yüklendi!');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Yedek geri yüklenirken hata:', error);
        toast.error('Yedek geri yüklenirken bir hata oluştu!');
      } finally {
        setIsRestoring(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={handleBackup} 
          variant="primary"
          disabled={isBackingUp}
          className="w-full sm:w-auto"
        >
          {isBackingUp ? 'Yedek Alınıyor...' : 'Yedek Al'}
        </Button>
        <div className="relative w-full sm:w-auto">
          <Button
            variant="secondary"
            onClick={() => document.getElementById('restore-file')?.click()}
            disabled={isRestoring}
            className="w-full"
          >
            {isRestoring ? 'Geri Yükleniyor...' : 'Yedek Geri Yükle'}
          </Button>
          <input
            type="file"
            id="restore-file"
            accept=".yvt"
            className="hidden"
            onChange={handleRestore}
            disabled={isRestoring}
          />
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Not: Yedek dosyaları .yvt uzantılı olarak kaydedilir. Geri yükleme işlemi sırasında mevcut veriler silinir.
      </p>
    </div>
  );
}