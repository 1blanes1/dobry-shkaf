import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { getPointById } from '../../entities/collection-point/api.ts';
import './PointDetailsPage.css';

const categoryLabels: Record<string, string> = {
  clothes: 'Одежда',
  shoes: 'Обувь',
  children: 'Детские вещи',
  toys: 'Игрушки',
  textile: 'Текстиль',
};

export function PointDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: point,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['collection-point', id],
    queryFn: () => getPointById(id!),
    enabled: Boolean(id),
  });

  if (isPending) {
    return (
      <section className="point-details">
        <p>Загружаем информацию о пункте приёма...</p>
      </section>
    );
  }

  if (isError || !point) {
    return (
      <section className="point-details">
        <h1>Пункт приёма не найден</h1>
        <p>Не удалось загрузить информацию об этом пункте.</p>
        <Link to="/points">Вернуться к списку пунктов</Link>
      </section>
    );
  }

  return (
    <section className="point-details">
      <Link to="/points" className="point-details__back">
        ← Назад к пунктам приёма
      </Link>

      <div className="point-details__content">
        <h1>{point.name}</h1>

        {point.description && (
          <p className="point-details__description">
            {point.description}
          </p>
        )}

        <div className="point-details__section">
          <h2>Адрес</h2>
          <p>{point.address}</p>
        </div>

        <div className="point-details__section">
          <h2>Принимаемые категории</h2>

          {point.categories && point.categories.length > 0 ? (
            <ul>
              {point.categories.map((category) => (
                <li key={category}>
                  {categoryLabels[category] ?? category}
                </li>
              ))}
            </ul>
          ) : (
            <p>Информация о категориях отсутствует.</p>
          )}
        </div>

        <div className="point-details__section">
          <h2>График работы</h2>
          <p>{point.workingHours ?? 'Не указан'}</p>
        </div>

        <div className="point-details__section">
          <h2>Контактный телефон</h2>
          {point.phone ? (
            <a href={`tel:${point.phone}`}>{point.phone}</a>
          ) : (
            <p>Не указан</p>
          )}
        </div>
      </div>
    </section>
  );
}