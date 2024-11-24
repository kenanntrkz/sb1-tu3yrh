import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function Card({ title, children, icon }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <div className="text-indigo-600 text-xl">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );
}