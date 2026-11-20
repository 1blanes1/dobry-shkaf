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

import { createListing } from '../../entities/listing/api.ts';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  listingSchema,
  type ListingFormValues,
} from './listingSchema.ts';

export function CreateListingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createListingMutation = useMutation({
    mutationFn: createListing,

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
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      condition: '',
      city: '',
      imageUrl: '',
    },
  });

  const onSubmit = (data: ListingFormValues) => {
    createListingMutation.mutate({
      ...data,
      userId: '1',
    });
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
            {...register('category')}
            error={Boolean(errors.category)}
            helperText={errors.category?.message}
          >
            <MenuItem value="clothes">Одежда</MenuItem>
            <MenuItem value="shoes">Обувь</MenuItem>
            <MenuItem value="children">Детские вещи</MenuItem>
            <MenuItem value="toys">Игрушки</MenuItem>
            <MenuItem value="textile">Текстиль</MenuItem>
          </TextField>

          <TextField
            select
            label="Состояние вещи"
            defaultValue=""
            fullWidth
            {...register('condition')}
            error={Boolean(errors.condition)}
            helperText={errors.condition?.message}
          >
            <MenuItem value="new">Новое</MenuItem>
            <MenuItem value="good">Хорошее состояние</MenuItem>
            <MenuItem value="used">Б/у</MenuItem>
          </TextField>

          <TextField
            label="Город"
            fullWidth
            {...register('city')}
            error={Boolean(errors.city)}
            helperText={errors.city?.message}
          />

          <TextField
            label="Ссылка на изображение (необязательно)"
            fullWidth
            {...register('imageUrl')}
            error={Boolean(errors.imageUrl)}
            helperText={errors.imageUrl?.message}
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
