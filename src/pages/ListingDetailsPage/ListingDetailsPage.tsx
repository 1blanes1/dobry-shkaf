
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { getListingById } from '../../entities/listing/api.ts';

import './ListingDetailsPage.css';

const categoryLabels: Record<string, string> = {
  clothes: 'Одежда',
  shoes: 'Обувь',
  children: 'Детские вещи',
  toys: 'Игрушки',
  textile: 'Текстиль',
};

const conditionLabels: Record<string, string> = {
  new: 'Новое',
  good: 'Хорошее состояние',
  used: 'Б/у',
};

export function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();

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

  // Поддерживаем новые объявления и старые записи с imageUrl
  const images =
    listing.images?.length
      ? listing.images
      : listing.imageUrl
        ? [listing.imageUrl]
        : [];

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
        <p>{categoryLabels[listing.category] ?? listing.category}</p>
      </div>

      <div className="listing-details__section">
        <h2>Состояние вещи</h2>
        <p>{conditionLabels[listing.condition] ?? listing.condition}</p>
      </div>

      <div className="listing-details__section">
        <h2>Город</h2>
        <p>{listing.city}</p>
      </div>

      <div className="listing-details__section">
        <h2>Дата публикации</h2>
        <p>{createdDate}</p>
      </div>
    </section>
  );
}
