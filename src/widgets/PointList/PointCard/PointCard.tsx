import {
  Card,
  CardContent,
  Typography,
  Stack,
} from '@mui/material';

import type { CollectionPoint } from '../../../entities/collection-point/types.ts';

interface PointCardProps {
  point: CollectionPoint;
}

export function PointCard({ point }: PointCardProps) {
  return (
    <Card
      sx={{
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 20px rgb(0 0 0 / 6%)',
        },
      }}
    >
      <CardContent sx={{ p: '22px !important' }}>
        <Stack spacing={1.5}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {point.name}
          </Typography>

          <Typography
            sx={{
              color: '#237547',
              fontWeight: 600,
            }}
          >
            {point.address}
          </Typography>

          {point.description && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {point.description}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}