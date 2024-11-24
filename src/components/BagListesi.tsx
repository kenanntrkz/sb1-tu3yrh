import type { Bag } from '../db/schema';
import { db } from '../db/schema';

interface Props {
  baglar: Bag[];
}

export default function BagListesi({ baglar }: Props) {
  const handleDelete = async (id: number) => {
    if (window.confirm('Bu bağı silmek istediğinizden emin misiniz?')) {
      try {
        await db.baglar.delete(id);
      } catch (error) {
        console.error('Bağ silinirken hata oluştu:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bağ Adı
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Konum
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dönüm
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlemler
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {baglar.map((bag) => (
            <tr key={bag.id}>
              <td className="px-6 py-4 whitespace-nowrap">{bag.ad}</td>
              <td className="px-6 py-4 whitespace-nowrap">{bag.konum}</td>
              <td className="px-6 py-4 whitespace-nowrap">{bag.donum}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => bag.id && handleDelete(bag.id)}
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
  );
}