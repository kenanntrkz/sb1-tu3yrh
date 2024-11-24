import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-primary-700 to-primary-900"
          style={{
            backgroundImage: `linear-gradient(rgba(21, 128, 61, 0.9), rgba(21, 128, 61, 0.9)), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><rect width="1000" height="1000" fill="%23166534"/><path d="M0 0h1000v1000H0z" fill="%23166534"/><circle cx="500" cy="500" r="400" fill="%2315803d"/><path d="M500 100c220.914 0 400 179.086 400 400S720.914 900 500 900 100 720.914 100 500s179.086-400 400-400zm0 50c-193.3 0-350 156.7-350 350s156.7 350 350 350 350-156.7 350-350S693.3 150 500 150z" fill="%23166534"/></svg>')`
          }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
                <div className="relative flex items-center justify-center h-full">
                  <span className="text-6xl">🍇</span>
                </div>
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Yövmiye Takip
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-100 text-lg"
            >
              Bağ işleriniz artık daha kolay
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}