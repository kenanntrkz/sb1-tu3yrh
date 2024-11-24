import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any) => ReactNode;
}

interface Props {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

export default function ResponsiveTable({ columns, data, emptyMessage = 'Kayıt bulunamadı.' }: Props) {
  if (!data.length) {
    return (
      <div className="bg-white rounded-lg p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.cell ? column.cell(row[column.accessor]) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Mobil Görünüm */}
      <div className="sm:hidden">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-white px-4 py-5 border-b border-gray-200">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-2">
                <dt className="text-sm font-medium text-gray-500">
                  {column.header}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {column.cell ? column.cell(row[column.accessor]) : row[column.accessor]}
                </dd>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}