import { BookOpenText, Droplets, MapPin, ShieldCheck, Sprout, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { homePathFor } from '../auth/homePath';
import IconBadge from '../components/IconBadge';
import DashboardPage from './DashboardPage';

type Health = {
  status: string;
  database: string;
};

const VALUES = [
  {
    icon: BookOpenText,
    title: 'Navodila za vsako rastlino',
    text: 'Zalivanje, svetloba in posebnosti — varuh ve, kaj potrebuje vsaka rastlina.',
  },
  {
    icon: MapPin,
    title: 'Varuh iz vašega mesta',
    text: 'Zahteva se prikaže le varuhom, ki so na voljo v celotnem obdobju.',
  },
  {
    icon: ShieldCheck,
    title: 'Potrjena vrnitev',
    text: 'Varstvo se zaključi šele, ko vrnitev rastlin potrdite vi.',
  },
];

const STEPS = [
  {
    title: 'Dodajte rastline',
    text: 'Za vsako zapišite vrsto, pogostost zalivanja in svetlobne potrebe.',
  },
  {
    title: 'Oddajte zahtevo',
    text: 'Izberite obdobje odsotnosti, mesto in rastline, ki potrebujejo varstvo.',
  },
  {
    title: 'Izberite varuha',
    text: 'Med varuhi, ki so se javili, izberite enega in spremljajte potek varstva.',
  },
];

function LandingPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get<Health>('/health')
      .then((res) => setHealth(res.data))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-copy">
          <span className="eyebrow">Varstvo sobnih rastlin</span>
          <h1>Vaše rastline v dobrih rokah, tudi ko vas ni doma</h1>
          <p>
            PlantPals poveže lastnike rastlin z varuhi iz istega mesta — z jasnimi navodili za
            oskrbo in potrjeno vrnitvijo.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary btn-inline">
              Ustvari račun
            </Link>
            <Link to="/login" className="btn-secondary">
              Prijava
            </Link>
          </div>
        </div>

        <div className="landing-visual" aria-hidden>
          <div className="visual-circle">
            <Sprout size={88} strokeWidth={1.1} />
          </div>
          <div className="visual-note visual-note-1">
            <Droplets size={16} strokeWidth={1.75} />
            Zalivanje vsakih 7 dni
          </div>
          <div className="visual-note visual-note-2">
            <Sun size={16} strokeWidth={1.75} />
            Polsenca
          </div>
          <div className="visual-note visual-note-3">
            <MapPin size={16} strokeWidth={1.75} />
            Varuh v Mariboru
          </div>
        </div>
      </section>

      <section className="value-strip">
        {VALUES.map((v) => (
          <div key={v.title} className="value-card">
            <IconBadge icon={v.icon} />
            <div>
              <h3>{v.title}</h3>
              <p className="muted">{v.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="how-it-works">
        <h2 className="section-heading">Kako deluje</h2>
        <div className="steps-grid">
          {STEPS.map((step, index) => (
            <div key={step.title} className="how-step">
              <span className="how-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p className="muted">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="system-status">
        <span className={`dot ${health ? 'dot-ok' : error ? 'dot-error' : ''}`} />
        {error && 'API ni dosegljiv'}
        {!error && !health && 'Preverjam stanje sistema ...'}
        {health && `API deluje, baza: ${health.database}`}
      </p>
    </div>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <p className="muted">Nalagam ...</p>;
  if (!user) return <LandingPage />;

  const target = homePathFor(user.roles);
  if (target !== '/') return <Navigate to={target} replace />;

  return <DashboardPage />;
}
