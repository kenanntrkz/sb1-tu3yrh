import { useState } from 'react';
import { db } from '../db/schema';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Bag } from '../db/schema';
import BagEkleForm from '../components/BagEkleForm';
import BagListesi from '../components/BagListesi';
import PageTransition from '../components/PageTransition';

export default function BagYonetimi() {
  const [showForm, setShowForm] = useState(false);
  const baglar = useLiveQuery<Bag[]>(() => db.baglar.toArray()) ?? [];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bağ Yönetimi</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Yeni Bağ Ekle
          </button>
        </div>

        {showForm && (
          <BagEkleForm onClose={() => setShowForm(false)} />
        )}

        <BagListesi baglar={baglar} />
      </div>
    </PageTransition>
  );
}