import { z } from 'zod';

export const listingSchema = z
  .object({
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

    subcategory: z
      .string()
      .optional(),

    size: z
      .string()
      .trim()
      .max(30, 'Размер не должен превышать 30 символов')
      .optional(),

    condition: z
      .string()
      .min(1, 'Выберите состояние вещи'),

    city: z
      .string()
      .trim()
      .min(2, 'Укажите город'),

    exchangeType: z.enum(['free', 'points', 'barter']),

    pointsCost: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.exchangeType !== 'points') {
      return;
    }

    const points = Number(data.pointsCost);

    if (!data.pointsCost?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['pointsCost'],
        message: 'Укажите количество эко-баллов',
      });
      return;
    }

    if (
      !Number.isInteger(points) ||
      points <= 0 ||
      points > 100000
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['pointsCost'],
        message: 'Укажите целое число от 1 до 100000',
      });
    }
  });

export type ListingFormValues = z.infer<typeof listingSchema>;
