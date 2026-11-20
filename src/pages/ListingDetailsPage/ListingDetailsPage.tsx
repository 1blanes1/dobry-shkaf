import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { getListingById } from '../../entities/listing/api.ts';

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

  const createdDate = new Date(listing.createdAt).toLocaleDateString(
    'ru-RU',
  );

  return (
    <section>
      <Link to="/listings">← Назад к объявлениям</Link>

      <h1>{listing.title}</h1>

      <p>{listing.description}</p>

      <div>
        <h2>Категория</h2>
        <p>{categoryLabels[listing.category] ?? listing.category}</p>
      </div>

      <div>
        <h2>Состояние вещи</h2>
        <p>{conditionLabels[listing.condition] ?? listing.condition}</p>
      </div>

      <div>
        <h2>Город</h2>
        <p>{listing.city}</p>
      </div>

      <div>
        <h2>Дата публикации</h2>
        <p>{createdDate}</p>
      </div>
    </section>
  );
}
