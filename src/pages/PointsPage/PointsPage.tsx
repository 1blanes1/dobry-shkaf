import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getPoints } from '../../entities/collection-point/api.ts';
import { PointList } from '../../widgets/PointList/PointList.tsx';
import './PointsPage.css';

export function PointsPage() {
  const {
    data: points,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['collection-points'],
    queryFn: getPoints,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPoints = (points ?? []).filter((point) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      point.name.toLowerCase().includes(query) 
      || 
      point.address.toLowerCase().includes(query)
    );
  });

  // Состояние загрузки
  if (isPending) {
    return (
      <section className="points-page">
        <h1>Пункты приёма</h1>

        <div className="points-status" role="status">
          <span className="points-loader" />
          <p>Загружаем пункты приёма...</p>
        </div>
      </section>
    );
  }

  // Состояние ошибки
  if (isError) {
    return (
      <section className="points-page">
        <h1>Пункты приёма</h1>

        <div className="points-status points-status--error" role="alert">
          <p>Не удалось загрузить пункты приёма.</p>

          <p className="points-error-message">
            {error instanceof Error
              ? error.message
              : 'Произошла неизвестная ошибка'}
          </p>

          <button
            className="points-retry-button"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? 'Повторная загрузка...' : 'Попробовать снова'}
          </button>
        </div>
      </section>
    );
  }

  // Состояние пустого списка
  if (points.length === 0) {
    return (
      <section className="points-page">
        <h1>Пункты приёма</h1>

        <div className="points-status">
          <p>Пока нет доступных пунктов приёма.</p>
        </div>
      </section>
    );
  }

  // Успешная загрузка
  return (
    <section className="points-page">
      <div className="points-page__header">
        <div>
          <h1>Пункты приёма</h1>
          <p>Найди ближайшее место, куда можно передать вещи.</p>
        </div>

        <span className="points-count">
          Найдено: {filteredPoints.length}
        </span>
      </div>

      <div className="points-search">
        <input
          type="search"
          placeholder="Поиск по названию или адресу..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Поиск пунктов приёма"
        />
      </div>

      {filteredPoints.length > 0 ? (
        <PointList points={filteredPoints} />
      ) : (
        <div className="points-status">
          <p>По вашему запросу ничего не найдено.</p>
        </div>
      )}
      
    </section>
  );
}
