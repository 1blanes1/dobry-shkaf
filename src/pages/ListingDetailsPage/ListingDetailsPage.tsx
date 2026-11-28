import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useState } from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  deleteListing,
  getListingById,
} from '../../entities/listing/api.ts';

import { getListingCategoryLabel, getListingConditionLabel} from '../../entities/listing/constants.ts';

import './ListingDetailsPage.css';


const exchangeTypeLabels: Record<string, string> = {
  free: 'Бесплатно',
  points: 'За эко-баллы',
  barter: 'Прямой обмен',
};

export function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: listing,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListingById(id!),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteListing,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['listings'],
      });

      queryClient.removeQueries({
        queryKey: ['listing', id],
      });

      navigate('/listings');
    },
  });

  if (isPending) {
    return (
      <section>
        <p>Загружаем объявление...</p>
      </section>
    );
  }

  if (isError || !listing) {
    return (
      <section>
        <h1>Объявление не найдено</h1>
        <p>Не удалось загрузить информацию об этом объявлении.</p>
        <Link to="/listings">Вернуться к объявлениям</Link>
      </section>
    );
  }

  // Временный тестовый пользователь до подключения авторизации
  const currentUserId = '1';
  const isOwner = listing.userId === currentUserId;

  const images = listing.images ?? [];

  const activeImage = images[selectedImageIndex] ?? images[0];

  const createdDate = new Date(listing.createdAt).toLocaleDateString(
    'ru-RU',
  );

  return (
    <section className="listing-details">
      <Link to="/listings" className="listing-details__back">
        ← Назад к объявлениям
      </Link>

      <h1>{listing.title}</h1>

      {isOwner && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Button
            component={Link}
            to={`/listings/${listing.id}/edit`}
            variant="contained"
          >
            Редактировать
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Удалить объявление
          </Button>
        </div>
      )}

      {/* Галерея фотографий */}
      <div className="listing-gallery">
        {activeImage ? (
          <>
            <div className="listing-gallery__main">
              <img
                src={activeImage}
                alt={`Фотография вещи: ${listing.title}`}
              />
            </div>

            {images.length > 1 && (
              <div className="listing-gallery__thumbnails">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={
                      selectedImageIndex === index
                        ? 'listing-gallery__thumbnail listing-gallery__thumbnail--active'
                        : 'listing-gallery__thumbnail'
                    }
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Показать фотографию ${index + 1}`}
                    aria-pressed={selectedImageIndex === index}
                  >
                    <img
                      src={image}
                      alt=""
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="listing-gallery__empty">
            <p>Фотографии пока не добавлены.</p>
          </div>
        )}
      </div>

      <p>{listing.description}</p>

      <div className="listing-details__section">
        <h2>Категория</h2>
        <p>{getListingCategoryLabel(listing.category)}</p>
      </div>

      {listing.subcategory && (
        <div className="listing-details__section">
          <h2>Подкатегория</h2>
          <p>{listing.subcategory}</p>
        </div>
      )}

      {listing.size && (
        <div className="listing-details__section">
          <h2>Размер</h2>
          <p>{listing.size}</p>
        </div>
      )}

      <div className="listing-details__section">
        <h2>Формат передачи</h2>
        <p>
          {exchangeTypeLabels[listing.exchangeType ?? 'free']}
        </p>
      </div>

      {listing.exchangeType === 'points' && (
        <div className="listing-details__section">
          <h2>Стоимость в эко-баллах</h2>
          <p>{listing.pointsCost} эко-баллов</p>
        </div>
      )}

      <div className="listing-details__section">
        <h2>Состояние вещи</h2>
        <p>{getListingConditionLabel(listing.condition)}</p>
      </div>

      <div className="listing-details__section">
        <h2>Город</h2>
        <p>{listing.city}</p>
      </div>

      <div className="listing-details__section">
        <h2>Дата публикации</h2>
        <p>{createdDate}</p>
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setIsDeleteDialogOpen(false);
          }
        }}
      >
        <DialogTitle>
          Удалить объявление?
        </DialogTitle>

        <DialogContent>
          <p>
            Объявление «{listing.title}» будет удалено.
            Это действие нельзя отменить.
          </p>

          {deleteMutation.isError && (
            <Alert severity="error">
              Не удалось удалить объявление. Попробуйте ещё раз.
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={deleteMutation.isPending}
          >
            Отмена
          </Button>

          <Button
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(listing.id)}
          >
            {deleteMutation.isPending
              ? 'Удаляем...'
              : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
