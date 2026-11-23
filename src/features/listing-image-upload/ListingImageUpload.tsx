import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';

import {
  Alert,
  Box,
  Button,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';

interface ListingImageUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];


function ImagePreview({
  file,
  onRemove,
  disabled,
}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };

    reader.readAsDataURL(file);

    return () => {
      reader.onload = null;

      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    };
  }, [file]);

  return (
    <Box
      sx={{
        width: 150,
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      {previewUrl && (
        <CardMedia
          component="img"
          image={previewUrl}
          alt={file.name}
          sx={{
            width: '100%',
            height: 110,
            objectFit: 'cover',
          }}
        />
      )}

      <Stack spacing={1} sx={{ p: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={file.name}
        >
          {file.name}
        </Typography>

        <Button
          size="small"
          color="error"
          disabled={disabled}
          onClick={onRemove}
        >
          Удалить
        </Button>
      </Stack>
    </Box>
  );
}


export function ListingImageUpload({
  files,
  onChange,
  disabled = false,
}: ListingImageUploadProps) {
  const [error, setError] = useState('');

  const handleFilesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.currentTarget.files ?? [],
    );

    // Позволяем повторно выбрать тот же файл
    event.currentTarget.value = '';

    if (selectedFiles.length === 0) {
      return;
    }

    const validTypeFiles = selectedFiles.filter((file) =>
      ALLOWED_TYPES.includes(file.type),
    );

    const validSizeFiles = validTypeFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE,
    );

    const remainingSlots = MAX_IMAGES - files.length;

    const filesToAdd = validSizeFiles.slice(
      0,
      remainingSlots,
    );

    const errors: string[] = [];

    if (validTypeFiles.length !== selectedFiles.length) {
      errors.push('Допустимы только JPEG, PNG и WebP.');
    }

    if (validSizeFiles.length !== validTypeFiles.length) {
      errors.push('Размер одной фотографии не должен превышать 5 МБ.');
    }

    if (validSizeFiles.length > remainingSlots) {
      errors.push('Можно добавить не более пяти фотографий.');
    }

    if (filesToAdd.length > 0) {
      onChange([...files, ...filesToAdd]);
    }

    setError(errors.join(' '));
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
    setError('');
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Фотографии вещи
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Добавь до пяти фотографий. Форматы JPEG, PNG, WebP.
          Максимальный размер — 5 МБ на файл.
        </Typography>
      </Box>

      <Button
        component="label"
        variant="outlined"
        disabled={disabled || files.length >= MAX_IMAGES}
        sx={{ alignSelf: 'flex-start' }}
      >
        Добавить фотографии ({files.length}/{MAX_IMAGES})

        <input
          type="file"
          hidden
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFilesChange}
        />
      </Button>

      {error && (
        <Alert severity="warning">
          {error}
        </Alert>
      )}

      {files.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {files.map((file, index) => (
            <ImagePreview
              key={`${file.name}-${file.lastModified}-${index}`}
              file={file}
              disabled={disabled}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </Box>
      )}
    </Stack>
  );
}
