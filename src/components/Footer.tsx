import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const version = "1.0.0";

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 text-white py-6 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">Yövmiye Takip</h3>
            <p className="text-sm text-gray-100">Versiyon {version}</p>
            <p className="text-xs text-gray-100 mt-1">
              © {currentYear} Telif Hakkı Kenan TÜRKÖZ'e aittir.
            </p>
          </div>
          
          <div className="text-center">
            <div className="mb-2">
              <h4 className="font-semibold">İletişim</h4>
              <p className="text-sm text-gray-100">E-posta: kenantrkz@hotmail.com</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/gizlilik-politikasi"
              className="text-white hover:text-gray-200 transition-colors text-sm"
            >
              Gizlilik Politikası
            </Link>
            <Link
              to="/kullanim-sartlari"
              className="text-white hover:text-gray-200 transition-colors text-sm"
            >
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}