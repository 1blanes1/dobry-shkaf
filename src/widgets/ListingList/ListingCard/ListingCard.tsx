import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

import { Link } from 'react-router-dom';

import type { Listing } from '../../../entities/listing/types.ts';

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

const conditionLabels: Record<string, string> = {
  new: 'Новое',
  good: 'Хорошее состояние',
  used: 'Б/у',
};

export function ListingCard({ listing }: ListingCardProps) {
  const createdDate = new Date(listing.createdAt).toLocaleDateString(
    'ru-RU',
  );
  const coverImage = listing.images?.[0] || listing.imageUrl;

  return (
    <Card
      component={Link}
      to={`/listings/${listing.id}`}
      sx={{
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 20px rgb(0 0 0 / 6%)',
        },
      }}
    >
      {coverImage && (
        <CardMedia
          component="img"
          image={coverImage}
          alt={`Фотография вещи: ${listing.title}`}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
          }}
        />
      )}
      <CardContent sx={{ p: '22px !important' }}>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {listing.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {listing.description}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Chip
              label={categoryLabels[listing.category] ?? listing.category}
              size="small"
              color="success"
              variant="outlined"
            />

            <Chip
              label={conditionLabels[listing.condition] ?? listing.condition}
              size="small"
            />
          </Stack>

          <Typography variant="body2">
            <strong>Город:</strong> {listing.city}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Опубликовано: {createdDate}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
