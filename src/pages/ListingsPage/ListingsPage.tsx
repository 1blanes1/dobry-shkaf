import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';

import { Link } from 'react-router-dom';

import { getListings } from '../../entities/listing/api.ts';

import {
  listingCategoryOptions,
  getListingSubcategoryOptions,
  listingConditionOptions,
} from '../../entities/listing/constants.ts';

import { ListingList } from '../../widgets/ListingList/ListingList.tsx';

import './ListingsPage.css';


const exchangeOptions = [
  { value: 'all', label: 'Все' },
  { value: 'free', label: 'Бесплатно' },
  { value: 'points', label: 'За баллы' },
  { value: 'barter', label: 'Обмен' },
];

interface ListingFilters {
  searchQuery: string;
  category: string;
  subcategory: string;
  size: string;
  condition: string;
  exchangeType: string;
}

const initialFilters: ListingFilters = {
  searchQuery: '',
  category: 'all',
  subcategory: 'all',
  size: 'all',
  condition: 'all',
  exchangeType: 'all',
};

export function ListingsPage() {
  const {
    data: listings,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
  });

  const [draftFilters, setDraftFilters] =
    useState<ListingFilters>(initialFilters);

  const [appliedFilters, setAppliedFilters] =
    useState<ListingFilters>(initialFilters);

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const allListings = listings ?? [];

  const categoryOptions = [
    { value: 'all', label: 'Все категории' },
    ...listingCategoryOptions,
  ];

  const sizeOptions = Array.from(
    new Set(
      allListings
        .map((listing) => listing.size)
        .filter((size): size is string => Boolean(size)),
    ),
  ).sort((a, b) => a.localeCompare(b, 'ru'));

  const availableSubcategories =
    getListingSubcategoryOptions(draftFilters.category);

  const updateFilter = (
    key: keyof ListingFilters,
    value: string,
  ) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setDraftFilters((current) => ({
      ...current,
      category,
      subcategory: 'all',
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsFiltersOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setIsFiltersOpen(false);
  };

  const filteredListings = allListings.filter((listing) => {
    const query = appliedFilters.searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.city.toLowerCase().includes(query) ||
      listing.subcategory?.toLowerCase().includes(query);

    const matchesCategory =
      appliedFilters.category === 'all' ||
      listing.category === appliedFilters.category;

    const matchesSubcategory =
      appliedFilters.subcategory === 'all' ||
      listing.subcategory === appliedFilters.subcategory;

    const matchesSize =
      appliedFilters.size === 'all' ||
      listing.size === appliedFilters.size;

    const matchesCondition =
      appliedFilters.condition === 'all' ||
      listing.condition === appliedFilters.condition;

    const matchesExchangeType =
      appliedFilters.exchangeType === 'all' ||
      (listing.exchangeType ?? 'free') ===
        appliedFilters.exchangeType;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubcategory &&
      matchesSize &&
      matchesCondition &&
      matchesExchangeType
    );
  });

  return (
    <section className="listings-page">
      <h1 className="visually-hidden">Обмен вещами</h1>

      <aside className="listings-sidebar">
        <TextField
          className="listings-city-field"
          fullWidth
          size="small"
          type="search"
          placeholder="Введите город..."
          value={draftFilters.searchQuery}
          onChange={(event) =>
            updateFilter('searchQuery', event.target.value)
          }
          slotProps={{
            htmlInput: {
              'aria-label': 'Поиск по объявлениям и городу',
            },
          }}
        />

        <div
          className={`listings-sidebar__filters ${
            isFiltersOpen ? 'listings-sidebar__filters--open' : ''
          }`}
        >
          <div className="listings-sidebar__heading">
            <h2 className="listings-sidebar__title">Фильтры</h2>

            <Button
              className="listings-sidebar__toggle"
              variant="outlined"
              size="small"
              onClick={() => setIsFiltersOpen((current) => !current)}
            >
              {isFiltersOpen ? 'Скрыть' : 'Показать фильтры'}
            </Button>
          </div>

          <div className="listings-filter-group">
            <p className="listings-filter-group__title">
              Категория
            </p>

            <RadioGroup
              className="listings-radio-group"
              value={draftFilters.category}
              onChange={(event) =>
                handleCategoryChange(event.target.value)
              }
            >
              {categoryOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </div>

          <div className="listings-select-group">
            <label
              className="listings-select-group__label"
              htmlFor="listing-size"
            >
              Размер
            </label>

            <select
              id="listing-size"
              className="listings-select"
              value={draftFilters.size}
              onChange={(event) =>
                updateFilter('size', event.target.value)
              }
            >
              <option value="all">Любой размер</option>

              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {draftFilters.category !== 'all' &&
            availableSubcategories.length > 0 && (
              <div className="listings-select-group">
                <label
                  className="listings-select-group__label"
                  htmlFor="listing-subcategory"
                >
                  Подкатегория
                </label>

                <select
                  id="listing-subcategory"
                  className="listings-select"
                  value={draftFilters.subcategory}
                  onChange={(event) =>
                    updateFilter(
                      'subcategory',
                      event.target.value,
                    )
                  }
                >
                  <option value="all">
                    Все подкатегории
                  </option>

                  {availableSubcategories.map((subcategory) => (
                    <option
                      key={subcategory}
                      value={subcategory}
                    >
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            )}

          <div className="listings-filter-group">
            <p className="listings-filter-group__title">
              Формат обмена
            </p>

            <RadioGroup
              className="listings-radio-group"
              value={draftFilters.exchangeType}
              onChange={(event) =>
                updateFilter('exchangeType', event.target.value)
              }
            >
              {exchangeOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </div>

          <div className="listings-filter-group">
            <p className="listings-filter-group__title">
              Состояние
            </p>

            <RadioGroup
              className="listings-radio-group"
              value={draftFilters.condition}
              onChange={(event) =>
                updateFilter('condition', event.target.value)
              }
            >
              {[
                { value: 'all', label: 'Все состояния' },
                ...listingConditionOptions,
              ].map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio size="small" />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </div>

          <div className="listings-sidebar__actions">
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
            >
              Применить
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>
      </aside>

      <div className="listings-results">
        <div className="listings-results__toolbar">
          <span>
            Найдено объявлений: {filteredListings.length}
          </span>

          <Button
            component={Link}
            to="/listings/create"
            variant="contained"
          >
            Создать объявление
          </Button>
        </div>

        {isPending && (
          <p>Загружаем объявления...</p>
        )}

        {isError && (
          <p>
            Не удалось загрузить объявления. Попробуйте позже.
          </p>
        )}

        {!isPending && !isError && allListings.length === 0 && (
          <p>Пока нет доступных объявлений.</p>
        )}

        {!isPending &&
          !isError &&
          allListings.length > 0 &&
          (filteredListings.length > 0 ? (
            <ListingList listings={filteredListings} />
          ) : (
            <p>По вашему запросу ничего не найдено.</p>
          ))}
      </div>
    </section>
  );
}