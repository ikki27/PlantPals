import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  icon: LucideIcon;
  children: ReactNode;
  tone?: 'default' | 'muted' | 'strong' | 'warning';
};

export default function Meta({ icon: Icon, children, tone = 'default' }: Props) {
  return (
    <span className={`meta meta-${tone}`}>
      <Icon size={16} strokeWidth={1.75} aria-hidden />
      <span>{children}</span>
    </span>
  );
}
