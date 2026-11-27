import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';

import { Link } from 'react-router-dom';

import type { Listing } from '../../../entities/listing/types.ts';

import './ListingCard.css';

interface ListingCardProps {
  listing: Listing;
}

const categoryLabels: Record<string, string> = {
  clothes: 'Одежда',
  shoes: 'Обувь',
  children: 'Детские вещи',
  toys: 'Игрушки',
  textile: 'Текстиль',
};

const exchangeTypeLabels: Record<string, string> = {
  free: 'Даром',
  points: 'За эко-баллы',
  barter: 'Обмен',
};

export function ListingCard({ listing }: ListingCardProps) {
  const coverImage = listing.images?.[0];

  const createdDate = new Date(
    listing.createdAt,
  ).toLocaleDateString('ru-RU');

  const exchangeType = listing.exchangeType ?? 'free';

  const exchangeLabel =
    exchangeType === 'points' && listing.pointsCost !== undefined
      ? `${listing.pointsCost} баллов`
      : exchangeTypeLabels[exchangeType];

  const categoryLabel =
    categoryLabels[listing.category] ?? listing.category;

  return (
    <Card
      component={Link}
      to={`/listings/${listing.id}`}
      className="listing-card"
      elevation={0}
    >
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
      </div>

      <CardContent className="listing-card__content">
        <Typography
          component="div"
          className="listing-card__category"
        >
          {categoryLabel}
          {listing.subcategory && ` · ${listing.subcategory}`}
        </Typography>

        <Typography
          component="h2"
          className="listing-card__title"
        >
          {listing.title}
        </Typography>

        <div className="listing-card__meta">
          <span className="listing-card__city">
            {listing.city}
          </span>

          <span className="listing-card__date">
            {createdDate}
          </span>
        </div>

        <div className="listing-card__footer">
          <Chip
            label={exchangeLabel}
            size="small"
            className={`listing-card__exchange listing-card__exchange--${exchangeType}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
