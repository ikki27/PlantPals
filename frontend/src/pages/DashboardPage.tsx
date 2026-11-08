import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  ClipboardList,
  HandHeart,
  PackageCheck,
  Play,
  Search,
  ShieldCheck,
  Sprout,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  formatDate,
  formatPeriod,
  getMyAssignments,
  getOpenAssignments,
  getSittingAssignments,
  type Assignment,
} from '../api/assignments';
import { getAvailability, type Availability } from '../api/availability';
import { getPlants, type Plant } from '../api/plants';
import { useAuth } from '../auth/AuthContext';
import { hasRole } from '../auth/homePath';
import AddRoleCard from '../components/AddRoleCard';
import IconBadge from '../components/IconBadge';

type DashboardData = {
  plants: Plant[];
  myRequests: Assignment[];
  openRequests: Assignment[];
  sitting: Assignment[];
  availability: Availability | null;
};

type Todo = {
  key: string;
  icon: LucideIcon;
  text: string;
  detail: string;
  to: string;
};

const ACTIVE = ['zahtevano', 'sprejeto', 'v_teku', 'vrnjeno'];

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 10) return 'Dobro jutro';
  if (hour < 18) return 'Dober dan';
  return 'Dober večer';
}

function valueOr<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === 'fulfilled' ? result.value : fallback;
}

function buildTodos(data: DashboardData, isOwner: boolean, isSitter: boolean): Todo[] {
  const todos: Todo[] = [];

  if (isOwner) {
    for (const a of data.myRequests) {
      if (a.status === 'zahtevano' && a.applicantsCount > 0) {
        todos.push({
          key: `cand-${a.id}`,
          icon: Users,
          text: `${a.applicantsCount} ${a.applicantsCount === 1 ? 'varuh čaka' : 'varuhov čaka'} na vašo izbiro`,
          detail: `${formatPeriod(a.startDate, a.endDate)} · ${a.city}`,
          to: `/requests/${a.id}`,
        });
      }
      if (a.status === 'vrnjeno') {
        todos.push({
          key: `confirm-${a.id}`,
          icon: PackageCheck,
          text: 'Potrdite vrnitev rastlin',
          detail: `Varuh ${a.sitter?.displayName ?? ''} je zaključil oskrbo`,
          to: `/requests/${a.id}`,
        });
      }
    }
  }

  if (isSitter) {
    if (!data.availability?.city || data.availability.windows.length === 0) {
      todos.push({
        key: 'availability',
        icon: CalendarDays,
        text: 'Nastavite svojo lokacijo in razpoložljivost',
        detail: 'Brez tega vam ne moremo prikazati ustreznih zahtev',
        to: '/availability',
      });
    }
    for (const a of data.sitting) {
      if (a.status === 'sprejeto' && a.startDate.slice(0, 10) <= todayIso()) {
        todos.push({
          key: `start-${a.id}`,
          icon: Play,
          text: 'Začnite varstvo',
          detail: `Lastnik ${a.owner?.displayName ?? ''} · od ${formatDate(a.startDate)}`,
          to: `/care/${a.id}`,
        });
      }
      if (a.status === 'v_teku') {
        todos.push({
          key: `running-${a.id}`,
          icon: Sprout,
          text: 'Varstvo je v teku',
          detail: `Do ${formatDate(a.endDate)} — ob koncu zaključite oskrbo`,
          to: `/care/${a.id}`,
        });
      }
    }
  }

  return todos;
}

type Stat = { to: string; icon: LucideIcon; value: number; label: string };

export default function DashboardPage() {
  const { user } = useAuth();
  const isOwner = hasRole(user?.roles, 'owner');
  const isSitter = hasRole(user?.roles, 'sitter');
  const isAdmin = hasRole(user?.roles, 'admin');

  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    Promise.allSettled([
      isOwner ? getPlants() : Promise.resolve([]),
      isOwner ? getMyAssignments() : Promise.resolve([]),
      isSitter ? getOpenAssignments() : Promise.resolve([]),
      isSitter ? getSittingAssignments() : Promise.resolve([]),
      isSitter ? getAvailability() : Promise.resolve(null),
    ]).then(([plants, myRequests, openRequests, sitting, availability]) =>
      setData({
        plants: valueOr(plants, []),
        myRequests: valueOr(myRequests, []),
        openRequests: valueOr(openRequests, []),
        sitting: valueOr(sitting, []),
        availability: valueOr(availability, null),
      }),
    );
  }, [isOwner, isSitter]);

  const todos = data ? buildTodos(data, isOwner, isSitter) : [];

  const stats: Stat[] = data
    ? [
        ...(isOwner
          ? [
              { to: '/plants', icon: Sprout, value: data.plants.length, label: 'Moje rastline' },
              {
                to: '/requests',
                icon: ClipboardList,
                value: data.myRequests.filter((a) => ACTIVE.includes(a.status)).length,
                label: 'Aktivne zahteve',
              },
            ]
          : []),
        ...(isSitter
          ? [
              {
                to: '/requests',
                icon: Search,
                value: data.openRequests.filter((a) => !a.hasApplied).length,
                label: 'Ujemajoče zahteve',
              },
              {
                to: '/care',
                icon: HandHeart,
                value: data.sitting.filter((a) => ACTIVE.includes(a.status)).length,
                label: 'Moja aktivna varstva',
              },
            ]
          : []),
      ]
    : [];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Nadzorna plošča</span>
          <h1>
            {greeting()}, {user?.displayName}
          </h1>
          <p>Pregled vaših rastlin in varstev na enem mestu.</p>
        </div>
        <div className="hero-actions">
          {isOwner && (
            <Link to="/requests/new" className="btn-primary btn-inline">
              Nova zahteva za varstvo
            </Link>
          )}
          {isOwner && (
            <Link to="/plants/new" className="btn-secondary">
              Dodaj rastlino
            </Link>
          )}
          {isSitter && !isOwner && (
            <Link to="/requests" className="btn-primary btn-inline">
              Poglej odprte zahteve
            </Link>
          )}
        </div>
      </section>

      {!data && <p className="muted">Nalagam ...</p>}

      {data && stats.length > 0 && (
        <section className="stat-grid stat-overlap">
          {stats.map((stat) => (
            <Link key={stat.label} to={stat.to} className="stat-tile">
              <IconBadge icon={stat.icon} size="sm" />
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </Link>
          ))}
        </section>
      )}

      {data && (
        <section className="card section">
          <h2 className="card-heading">Potrebuje vašo pozornost</h2>
          {todos.length === 0 ? (
            <p className="empty-line">
              <CircleCheck size={18} strokeWidth={1.75} aria-hidden />
              Vse je urejeno. Trenutno ni ničesar, kar bi čakalo na vas.
            </p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.key}>
                  <Link to={todo.to} className="todo-item">
                    <IconBadge icon={todo.icon} size="sm" />
                    <span className="todo-text">
                      <strong>{todo.text}</strong>
                      <span className="muted">{todo.detail}</span>
                    </span>
                    <ArrowRight size={18} strokeWidth={1.75} className="todo-arrow" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {isAdmin && (
        <div className="card callout">
          <IconBadge icon={ShieldCheck} />
          <span className="callout-text">Imate administratorske pravice.</span>
          <Link to="/admin" className="btn-secondary">
            Administracija
          </Link>
        </div>
      )}
      <AddRoleCard role="owner" />
      <AddRoleCard role="sitter" />
    </>
  );
}
