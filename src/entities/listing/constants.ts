import type { ListingCondition } from './types.ts';

export interface ListingCategoryOption {
  value: string;
  label: string;
  subcategories?: string[];
}

export const listingCategoryOptions: ListingCategoryOption[] = [
  {
    value: 'children-clothes',
    label: 'Детская одежда',
    subcategories: [
      'Детская одежда (0-2 года)',
      'Детская одежда (2-6 лет)',
      'Детская одежда (6-12 лет)',
    ],
  },
  {
    value: 'adult-clothes',
    label: 'Взрослая одежда',
    subcategories: [
      'Верхняя одежда',
      'Платья',
      'Штаны, брюки',
      'Футболки',
      'Шапки и шарфы',
    ],
  },
  {
    value: 'shoes',
    label: 'Обувь',
    subcategories: [
      'Взрослая обувь',
      'Детская обувь',
      'Спортивная обувь',
      'Сезонная обувь',
    ],
  },
  {
    value: 'toys',
    label: 'Игрушки',
    subcategories: [
      'Развивающие игрушки и погремушки',
      'Настольные игры и пазлы',
      'Конструкторы, куклы и машинки',
      'Крупногабаритные товары',
    ],
  },
  {
    value: 'books',
    label: 'Книги',
  },
  {
    value: 'furniture',
    label: 'Мебель',
  },
];

export function getListingCategoryLabel(category: string): string {
  return (
    listingCategoryOptions.find(
      (option) => option.value === category,
    )?.label ?? category
  );
}

export function getListingSubcategoryOptions(
  category: string | undefined,
): string[] {
  return (
    listingCategoryOptions.find(
      (option) => option.value === category,
    )?.subcategories ?? []
  );
}

export const listingConditionOptions: {
  value: ListingCondition;
  label: string;
}[] = [
  {
    value: 'new-with-tag',
    label: 'Новое с биркой',
  },
  {
    value: 'excellent',
    label: 'Отличное',
  },
  {
    value: 'good',
    label: 'Хорошее',
  },
  {
    value: 'used',
    label: 'Б/У',
  },
];

export function getListingConditionLabel(
  condition: ListingCondition,
): string {
  return (
    listingConditionOptions.find(
      (option) => option.value === condition,
    )?.label ?? condition
  );
}