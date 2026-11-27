import { http } from '../../shared/api/http.ts';
import type { Listing, CreateListingDto, UpdateListingDto, } from './types.ts';

export async function getListings(): Promise<Listing[]> {
  const response = await http.get<Listing[]>('/listings');
  return response.data;
}

export async function getListingById(id: string): Promise<Listing> {
  const response = await http.get<Listing>(`/listings/${id}`);
  return response.data;
}

export async function createListing(
  data: CreateListingDto,
): Promise<Listing> {
  const response = await http.post<Listing>('/listings', {
    ...data,
    createdAt: new Date().toISOString(),
  });

  return response.data;
}

interface UploadImagesResponse {
  urls: string[];
}

export async function uploadListingImages(
  files: File[],
): Promise<string[]> {
  if (files.length === 0) {
    return [];
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await http.post<UploadImagesResponse>(
    '/uploads',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (
    !Array.isArray(response.data.urls) ||
    response.data.urls.length !== files.length
  ) {
    throw new Error('Сервер вернул некорректные ссылки на фотографии.');
  }

  return response.data.urls;
}


export async function updateListing(
  id: string,
  data: UpdateListingDto,
): Promise<Listing> {
  const response = await http.patch<Listing>(
    `/listings/${id}`,
    data,
  );

  return response.data;
}

export async function deleteListing(id: string): Promise<void> {
  await http.delete(`/listings/${id}`);
}
