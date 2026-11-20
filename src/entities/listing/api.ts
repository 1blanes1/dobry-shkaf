import { http } from '../../shared/api/http.ts';
import type { Listing, CreateListingDto } from './types.ts';

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