import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <h1>404 — Stran ne obstaja</h1>
      <Link to="/">Nazaj na začetno stran</Link>
    </>
  );
}
