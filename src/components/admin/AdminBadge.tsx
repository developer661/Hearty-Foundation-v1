import { ReactNode } from 'react';

type BadgeTone = 'gray' | 'green' | 'amber' | 'red' | 'red-soft';

const TONE_CLASSES: Record<BadgeTone, string> = {
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  red: 'bg-red-600 text-white border-red-600',
  'red-soft': 'bg-red-50 text-red-700 border-red-200',
};

export const AdminBadge = ({ tone = 'gray', children }: { tone?: BadgeTone; children: ReactNode }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap ${TONE_CLASSES[tone]}`}>
    {children}
  </span>
);
