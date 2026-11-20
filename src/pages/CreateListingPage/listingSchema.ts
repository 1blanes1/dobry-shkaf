import { z } from 'zod';

export const listingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название не должно превышать 100 символов'),

  description: z
    .string()
    .trim()
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(1000, 'Описание не должно превышать 1000 символов'),

  category: z
    .string()
    .min(1, 'Выберите категорию'),

  condition: z
    .string()
    .min(1, 'Выберите состояние вещи'),

  city: z
    .string()
    .trim()
    .min(2, 'Укажите город'),

  imageUrl: z
    .string()
    .trim()
    .optional(),
});

export type ListingFormValues = z.infer<typeof listingSchema>;
