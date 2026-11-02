import { http } from '../../shared/api/http.ts';
import type { CollectionPoint } from './types.ts';

export async function getPoints(): Promise<CollectionPoint[]> {
  const response = await http.get<CollectionPoint[]>('/points');
  return response.data;
}

export async function getPointById(
  id: string,
): Promise<CollectionPoint> {
  const response = await http.get<CollectionPoint>(`/points/${id}`);
  return response.data;
}