import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon,
  kanji = '空',
  title = 'Nothing here yet',
  description = '',
  actionLabel,
  actionTo,
  onAction,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 px-4"
  >
    {kanji && (
      <div className="font-japanese text-7xl text-gray-800 mb-3 select-none" aria-hidden>
        {kanji}
      </div>
    )}
    {Icon && <Icon className="w-12 h-12 text-gray-700 mx-auto mb-3" />}
    <h3 className="text-xl text-gray-400 font-display tracking-wider mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-600 max-w-md mx-auto">{description}</p>}
    {actionLabel && (actionTo || onAction) && (
      <div className="mt-5">
        {actionTo ? (
          <Link to={actionTo} className="btn-neon-filled px-6 py-3 text-sm inline-block">{actionLabel}</Link>
        ) : (
          <button onClick={onAction} className="btn-neon-filled px-6 py-3 text-sm">{actionLabel}</button>
        )}
      </div>
    )}
  </motion.div>
);

export default EmptyState;
