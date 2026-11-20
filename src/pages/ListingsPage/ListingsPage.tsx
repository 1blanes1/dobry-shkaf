import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

import { getListings } from '../../entities/listing/api.ts';
import { ListingList } from '../../widgets/ListingList/ListingList.tsx';

export function ListingsPage() {
  const {
    data: listings,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredListings = (listings ?? []).filter((listing) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.city.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'all' ||
      listing.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isPending) {
    return (
      <section>
        <h1>Обмен вещами</h1>
        <p>Загружаем объявления...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section>
        <h1>Обмен вещами</h1>
        <p>Не удалось загрузить объявления. Попробуйте позже.</p>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section>
        <h1>Обмен вещами</h1>
        <p>Пока нет доступных объявлений.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Обмен вещами</h1>
      <p>Найди вещь или предложи свою для обмена.</p>

      <Button
        component={Link}
        to="/listings/create"
        variant="contained"
        sx={{ mt: 2, mb: 3 }}
      >
        Создать объявление
      </Button>

      <p>Найдено объявлений: {filteredListings.length}</p>

      <input
        type="search"
        placeholder="Поиск по названию, описанию или городу..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        aria-label="Поиск объявлений"
      />

      <select
        value={selectedCategory}
        onChange={(event) => setSelectedCategory(event.target.value)}
        aria-label="Фильтр по категории"
      >
        <option value="all">Все категории</option>
        <option value="clothes">Одежда</option>
        <option value="shoes">Обувь</option>
        <option value="children">Детские вещи</option>
        <option value="toys">Игрушки</option>
        <option value="textile">Текстиль</option>
      </select>

      {filteredListings.length > 0 ? (
        <ListingList listings={filteredListings} />
      ) : (
        <p>По вашему запросу ничего не найдено.</p>
      )}
    </section>
  );
}
