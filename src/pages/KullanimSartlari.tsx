import PageTransition from '../components/PageTransition';

export default function KullanimSartlari() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Kullanım Şartları</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Lisans ve Kullanım</h2>
            <p className="text-gray-700">
              Yövmiye Takip uygulaması, Kenan TÜRKÖZ'ün tescilli bir ürünüdür. Bu yazılımın tüm hakları
              saklıdır ve izinsiz kopyalanması, dağıtılması yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. Sorumluluk Reddi</h2>
            <p className="text-gray-700">
              Uygulama "olduğu gibi" sunulmaktadır. Verilerinizin düzenli olarak yedeklenmesi
              kullanıcının sorumluluğundadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Kullanım Kısıtlamaları</h2>
            <p className="text-gray-700">
              Bu yazılımı kötüye kullanmak, kaynak kodunu değiştirmek veya tersine mühendislik
              yapmak yasaktır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Güncellemeler</h2>
            <p className="text-gray-700">
              Yazılım güncellemeleri ve değişiklikler hakkında kullanıcılar bilgilendirilecektir.
              Güncellemeleri takip etmek kullanıcının sorumluluğundadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. İletişim</h2>
            <p className="text-gray-700">
              Kullanım şartları ile ilgili sorularınız için kenantrkz@hotmail.com adresinden
              bizimle iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}