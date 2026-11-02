import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section>
      <h1>404 — страница не найдена</h1>
      <p>Такой страницы не существует или она была перемещена.</p>
      <Link to="/">Вернуться на главную</Link>
    </section>
  );
}
