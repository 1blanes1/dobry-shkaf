import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  getListingById,
  updateListing,
} from '../../entities/listing/api.ts';

import type { Listing, UpdateListingDto } from '../../entities/listing/types.ts';

import {
  listingCategoryOptions,
  getListingSubcategoryOptions,
  listingConditionOptions,
} from '../../entities/listing/constants.ts';

import {
  listingSchema,
  type ListingFormInput,
  type ListingFormValues,
} from '../CreateListingPage/listingSchema.ts';


export function EditListingPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: listing,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListingById(id!),
    enabled: Boolean(id),
  });

  if (isPending) {
    return <p>Загружаем объявление...</p>;
  }

  if (isError || !listing) {
    return (
      <section>
        <h1>Объявление не найдено</h1>
        <Link to="/listings">Вернуться к объявлениям</Link>
      </section>
    );
  }

  return <EditListingForm listing={listing} />;
}

interface EditListingFormProps {
  listing: Listing;
}

function EditListingForm({ listing }: EditListingFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ListingFormInput, unknown, ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      category: listing.category,
      subcategory: listing.subcategory ?? '',
      size: listing.size ?? '',
      condition: listing.condition,
      city: listing.city,
      exchangeType: listing.exchangeType ?? 'free',
      pointsCost: listing.pointsCost?.toString() ?? '',
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

  const availableSubcategories =
    getListingSubcategoryOptions(selectedCategory);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateListingDto) =>
      updateListing(listing.id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['listings'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['listing', listing.id],
      });

      navigate(`/listings/${listing.id}`);
    },
  });

  const onSubmit = (data: ListingFormValues) => {
    const updateData: UpdateListingDto = {
      title: data.title,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory || undefined,
      size: data.size || undefined,
      condition: data.condition,
      city: data.city,
      exchangeType: data.exchangeType,
      pointsCost:
        data.exchangeType === 'points'
          ? Number(data.pointsCost)
          : undefined,
    };

    updateMutation.mutate(updateData);
  };

  const listingImages = listing.images ?? [];

  return (
    <Stack spacing={3} sx={{ maxWidth: 700, mx: 'auto' }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Редактирование объявления
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Измени информацию о своей вещи.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Категория"
                fullWidth
                error={Boolean(errors.category)}
                helperText={errors.category?.message}
                onChange={(event) => {
                  field.onChange(event);
                  setValue('subcategory', '');
                }}
              >
                {listingCategoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {availableSubcategories.length > 0 && (
            <Controller
              name="subcategory"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Подкатегория"
                  fullWidth
                >
                  <MenuItem value="">Не выбрана</MenuItem>

                  {availableSubcategories.map((subcategory) => (
                    <MenuItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          )}

          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Состояние вещи"
                fullWidth
                error={Boolean(errors.condition)}
                helperText={errors.condition?.message}
              >
                {listingConditionOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

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

          <Controller
            name="exchangeType"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Формат передачи"
                fullWidth
                error={Boolean(errors.exchangeType)}
                helperText={errors.exchangeType?.message}
              >
                <MenuItem value="free">Бесплатно</MenuItem>
                <MenuItem value="points">За эко-баллы</MenuItem>
                <MenuItem value="barter">Прямой обмен</MenuItem>
              </TextField>
            )}
          />

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
              Укажи в описании, какую вещь хочешь получить взамен.
            </Alert>
          )}

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Фотографии объявления
            </Typography>

            {listingImages.length > 0 ? (
              <Stack
                direction="row"
                sx={{ flexWrap: 'wrap', gap: 2, mt: 1 }}
              >
                {listingImages.map((image, index) => (
                  <Box
                    key={`${image}-${index}`}
                    component="img"
                    src={image}
                    alt={`Фотография ${index + 1}`}
                    sx={{
                      width: 120,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Фотографии не добавлены.
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary">
              Изменение фотографий добавим отдельно.
            </Typography>
          </Box>

          {updateMutation.isError && (
            <Alert severity="error">
              Не удалось сохранить изменения. Попробуйте ещё раз.
            </Alert>
          )}

          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending
                ? 'Сохраняем...'
                : 'Сохранить изменения'}
            </Button>

            <Button
              component={Link}
              to={`/listings/${listing.id}`}
              variant="outlined"
              disabled={updateMutation.isPending}
            >
              Отмена
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
