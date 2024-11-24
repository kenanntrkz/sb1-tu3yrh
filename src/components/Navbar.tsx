import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Yövmiye Takip
            </motion.span>
          </Link>
          <div className="flex space-x-6">
            {[
              { to: "/baglar", icon: "🌳", text: "Bağlar" },
              { to: "/dayibasilari", icon: "👥", text: "Dayıbaşıları" },
              { to: "/uzum-kesimi", icon: "🍇", text: "Üzüm Kesimi" },
              { to: "/rapor/gunluk", icon: "📊", text: "Raporlar" }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link flex items-center space-x-1 relative ${
                  location.pathname === link.to ? 'text-white' : 'text-gray-200'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.text}</span>
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}