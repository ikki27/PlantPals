import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="back-link">
      <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
      {children}
    </Link>
  );
}
