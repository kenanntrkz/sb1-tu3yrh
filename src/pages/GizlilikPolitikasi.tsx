import PageTransition from '../components/PageTransition';

export default function GizlilikPolitikasi() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Veri Toplama ve Kullanım</h2>
            <p className="text-gray-700">
              Yövmiye Takip uygulaması, kullanıcıların girdiği verileri yalnızca yerel olarak cihazda saklar.
              Hiçbir kişisel veri sunucularımıza gönderilmez veya üçüncü taraflarla paylaşılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Veri Güvenliği</h2>
            <p className="text-gray-700">
              Verilerinizin güvenliği bizim için önemlidir. Tüm veriler cihazınızda şifrelenmiş bir şekilde saklanır
              ve sadece sizin erişiminize açıktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Çerezler ve İzleme</h2>
            <p className="text-gray-700">
              Uygulamamız çerez kullanmamaktadır ve kullanıcı davranışlarını izlememektedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. İletişim</h2>
            <p className="text-gray-700">
              Gizlilik politikamızla ilgili sorularınız için kenantrkz@hotmail.com adresinden
              bizimle iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}