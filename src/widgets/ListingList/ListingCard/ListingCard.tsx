
import { useState } from 'react';

import {
  Card,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';

import { Link } from 'react-router-dom';

import type { Listing } from '../../../entities/listing/types.ts';

import './ListingCard.css';

interface ListingCardProps {
  listing: Listing;
}

const exchangeTypeLabels: Record<string, string> = {
  free: 'Даром',
  points: 'За баллы',
  barter: 'Обмен',
};

export function ListingCard({ listing }: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const coverImage = listing.images?.[0];

  const exchangeType = listing.exchangeType ?? 'free';

  const exchangeLabel =
    exchangeType === 'points' && listing.pointsCost !== undefined
      ? `${listing.pointsCost} баллов`
      : exchangeTypeLabels[exchangeType];

  return (
    <Card
      component="article"
      className="listing-card"
      elevation={0}
    >
      <Link
        to={`/listings/${listing.id}`}
        className="listing-card__link"
        aria-label={`Открыть объявление: ${listing.title}`}
      >
        {/* Фотография и формат передачи */}

        <div className="listing-card__image-wrapper">
          {coverImage ? (
            <CardMedia
              component="img"
              image={coverImage}
              alt={`Фотография вещи: ${listing.title}`}
              className="listing-card__image"
            />
          ) : (
            <div
              className="listing-card__image-placeholder"
              role="img"
              aria-label="Фотография отсутствует"
            >
              <span>Фото отсутствует</span>
            </div>
          )}

          <span
            className={`listing-card__badge listing-card__badge--${exchangeType}`}
          >
            {exchangeLabel}
          </span>
        </div>

        {/* Название и местоположение */}

        <div className="listing-card__details">
          <Typography
            component="h2"
            className="listing-card__title"
            title={listing.title}
          >
            {listing.title}
            {listing.size && `, ${listing.size}`}
          </Typography>

          <div className="listing-card__location">
            <svg
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="10"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>

            <span>{listing.city}</span>
          </div>
        </div>
      </Link>

      {/* Разделитель */}

      <div className="listing-card__separator" />

      {/* Автор и избранное */}

      <div className="listing-card__footer">
        <div className="listing-card__author">
          <div className="listing-card__avatar">
            П
          </div>

          <span className="listing-card__author-name">
            Участник
          </span>
        </div>

        <IconButton
          className={`listing-card__favorite ${
            isFavorite ? 'listing-card__favorite--active' : ''
          }`}
          aria-label={
            isFavorite
              ? 'Убрать из избранного'
              : 'Добавить в избранное'
          }
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((current) => !current)}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </IconButton>
      </div>
    </Card>
  );
}
