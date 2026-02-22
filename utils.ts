import { Category } from './types';

export const getCategoryColor = (_category: Category | string): string => {
  return '#FF1001';
};

export const getCategoryBgClass = (_category: Category | string): string => {
  return 'bg-brand-red';
};

export const getCategoryTextClass = (_category: Category | string): string => {
  return 'text-brand-red';
};
