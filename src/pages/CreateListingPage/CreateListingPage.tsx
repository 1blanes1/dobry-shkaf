import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


import { createListing, uploadListingImages, } from '../../entities/listing/api.ts';

import {
  listingCategoryOptions,
  getListingSubcategoryOptions,
  listingConditionOptions ,
} from '../../entities/listing/constants.ts';

import { ListingImageUpload } from '../../features/listing-image-upload/ListingImageUpload.tsx';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  listingSchema,
  type ListingFormInput,
  type ListingFormValues,
} from './listingSchema.ts';


export function CreateListingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const createListingMutation = useMutation({
    mutationFn: async (data: ListingFormValues) => {
      const images = await uploadListingImages(imageFiles);

      return createListing({
        ...data,
        subcategory: data.subcategory || undefined,
        size: data.size || undefined,
        images,
        pointsCost:
          data.exchangeType === 'points'
            ? Number(data.pointsCost)
            : undefined,
        userId: '1',
        status: 'active',
      });
    },

    onSuccess: async (newListing) => {
      await queryClient.invalidateQueries({
        queryKey: ['listings'],
      });

      navigate(`/listings/${newListing.id}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ListingFormInput, unknown, ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      subcategory: '',
      size: '',
      condition: '',
      city: '',
      exchangeType: 'free',
      pointsCost: '',
    },
  });

  const selectedCategory = useWatch({
    control,
    name: 'category',
  });
  
  const selectedExchangeType = useWatch({
    control,
    name: 'exchangeType',
  });

  const onSubmit = (data: ListingFormValues) => {
    createListingMutation.mutate(data);
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto' }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          Создать объявление
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Расскажи о вещи, которую хочешь передать или обменять.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack spacing={2.5}>
          <TextField
            label="Название вещи"
            fullWidth
            {...register('title')}
            error={Boolean(errors.title)}
            helperText={errors.title?.message}
          />

          <TextField
            label="Описание"
            fullWidth
            multiline
            minRows={4}
            {...register('description')}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
          />

          <TextField
            select
            label="Категория"
            defaultValue=""
            fullWidth
            {...register('category', {
              onChange: () => setValue('subcategory', ''),
            })}
            error={Boolean(errors.category)}
            helperText={errors.category?.message}
          >
            {listingCategoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          {selectedCategory && getListingSubcategoryOptions(selectedCategory).length > 0 && (
            <TextField
              select
              label="Подкатегория"
              defaultValue=""
              fullWidth
              {...register('subcategory')}
            >
              <MenuItem value="">Не выбрана</MenuItem>

              {getListingSubcategoryOptions(selectedCategory).map((subcategory) => (
                <MenuItem key={subcategory} value={subcategory}>
                  {subcategory}
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            select
            label="Состояние вещи"
            defaultValue=""
            fullWidth
            {...register('condition')}
            error={Boolean(errors.condition)}
            helperText={errors.condition?.message}
          >
            {listingConditionOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Размер вещи"
            placeholder="Например, M, 42, 110–116"
            fullWidth
            {...register('size')}
            error={Boolean(errors.size)}
            helperText={errors.size?.message || 'Необязательно'}
          />

          <TextField
            label="Город"
            fullWidth
            {...register('city')}
            error={Boolean(errors.city)}
            helperText={errors.city?.message}
          />

          <TextField
            select
            label="Формат передачи"
            fullWidth
            {...register('exchangeType')}
            error={Boolean(errors.exchangeType)}
            helperText={errors.exchangeType?.message}
          >
            <MenuItem value="free">
              Бесплатно
            </MenuItem>

            <MenuItem value="points">
              За эко-баллы
            </MenuItem>

            <MenuItem value="barter">
              Прямой обмен
            </MenuItem>
          </TextField>

          {selectedExchangeType === 'points' && (
            <TextField
              label="Количество эко-баллов"
              type="number"
              fullWidth
              {...register('pointsCost')}
              error={Boolean(errors.pointsCost)}
              helperText={errors.pointsCost?.message}
            />
          )}
          
          {selectedExchangeType === 'barter' && (
            <Alert severity="info">
              Опиши в объявлении, какую вещь ты хотел бы получить взамен.
            </Alert>
          )}

          <ListingImageUpload
            files={imageFiles}
            onChange={setImageFiles}
            disabled={createListingMutation.isPending}
          />

          <Alert severity="info">
            Пока объявление будет опубликовано от тестового пользователя.
          </Alert>

          {createListingMutation.isError && (
            <Alert severity="error">
              Не удалось создать объявление. Попробуйте ещё раз.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={createListingMutation.isPending}
          >
            {createListingMutation.isPending
              ? 'Публикуем...'
              : 'Опубликовать объявление'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
