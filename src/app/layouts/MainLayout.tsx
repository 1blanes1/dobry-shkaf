import { NavLink, Outlet } from 'react-router-dom';
import './MainLayout.css';

const navigationItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/points', label: 'Пункты приёма' },
  { to: '/listings', label: 'Обмен вещами' },
];

export function MainLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink to="/" className="app-logo">
          <span className="app-logo__icon">ДШ</span>
          <span>Добрый Шкаф</span>
        </NavLink>

        <nav className="app-navigation" aria-label="Основная навигация">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? 'app-navigation__link app-navigation__link--active'
                  : 'app-navigation__link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="app-footer">
        Добрый Шкаф — вещи получают вторую жизнь
      </footer>
    </div>
  );
}
