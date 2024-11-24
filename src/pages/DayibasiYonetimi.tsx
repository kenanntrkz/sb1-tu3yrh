import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import DayibasiEkleForm from '../components/DayibasiEkleForm';
import DayibasiListesi from '../components/DayibasiListesi';

export default function DayibasiYonetimi() {
  const [showForm, setShowForm] = useState(false);
  const dayibasilari = useLiveQuery(() => db.dayibasilari.toArray());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dayıbaşı Yönetimi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Yeni Dayıbaşı Ekle
        </button>
      </div>

      {showForm && (
        <DayibasiEkleForm onClose={() => setShowForm(false)} />
      )}

      {dayibasilari && <DayibasiListesi dayibasilari={dayibasilari} />}
    </div>
  );
}