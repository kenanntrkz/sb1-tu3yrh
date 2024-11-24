import { Link } from 'react-router-dom';
import AnimatedCard from '../components/AnimatedCard';
import PageTransition from '../components/PageTransition';
import BackupRestore from '../components/BackupRestore';
import { motion } from 'framer-motion';

export default function Anasayfa() {
  return (
    <PageTransition>
      <div className="space-y-8">
        <motion.h1 
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hoş Geldiniz
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/baglar">
            <AnimatedCard delay={0.1}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span role="img" aria-label="bağ" className="text-2xl">🌳</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bağlar</h3>
                  <p className="text-gray-600">Bağ bilgilerini yönetin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/dayibasilari">
            <AnimatedCard delay={0.2}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span role="img" aria-label="dayıbaşı" className="text-2xl">👥</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Dayıbaşıları</h3>
                  <p className="text-gray-600">Dayıbaşı kayıtlarını yönetin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/uzum-kesimi">
            <AnimatedCard delay={0.3}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span role="img" aria-label="üzüm" className="text-2xl">🍇</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Üzüm Kesimi</h3>
                  <p className="text-gray-600">Üzüm kesimi kayıtlarını görüntüleyin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/uzum-kesimi/yeni">
            <AnimatedCard delay={0.4}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <span role="img" aria-label="yeni üzüm" className="text-2xl">➕</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Yeni Üzüm Kesimi</h3>
                  <p className="text-gray-600">Yeni üzüm kesimi kaydı ekleyin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/is-kaydi">
            <AnimatedCard delay={0.5}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <span role="img" aria-label="iş" className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">İş Kaydı</h3>
                  <p className="text-gray-600">Yeni iş kaydı ekleyin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/is-listesi">
            <AnimatedCard delay={0.6}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <span role="img" aria-label="liste" className="text-2xl">📋</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">İş Listesi</h3>
                  <p className="text-gray-600">İş kayıtlarını görüntüleyin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/avans/yeni">
            <AnimatedCard delay={0.7}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <span role="img" aria-label="avans" className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Avans</h3>
                  <p className="text-gray-600">Avans ödemesi kaydedin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/avans">
            <AnimatedCard delay={0.8}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <span role="img" aria-label="avans liste" className="text-2xl">💳</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Avans Listesi</h3>
                  <p className="text-gray-600">Avans kayıtlarını görüntüleyin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>

          <Link to="/rapor/bag">
            <AnimatedCard delay={0.9}>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <span role="img" aria-label="rapor" className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Bağ Raporları</h3>
                  <p className="text-gray-600">Bağ bazlı raporları görüntüleyin</p>
                </div>
              </div>
            </AnimatedCard>
          </Link>
        </div>

        <AnimatedCard delay={1}>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <span role="img" aria-label="yedek" className="text-2xl">💾</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Veri Yedekleme</h3>
                <p className="text-gray-600">Verilerinizi yedekleyin ve geri yükleyin</p>
              </div>
            </div>
            <BackupRestore />
          </div>
        </AnimatedCard>
      </div>
    </PageTransition>
  );
}