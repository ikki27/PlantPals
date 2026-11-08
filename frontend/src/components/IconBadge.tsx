import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
};

const ICON_SIZE = { sm: 16, md: 20, lg: 26 };

export default function IconBadge({ icon: Icon, size = 'md' }: Props) {
  return (
    <span className={`icon-badge icon-badge-${size}`}>
      <Icon size={ICON_SIZE[size]} strokeWidth={1.6} aria-hidden />
    </span>
  );
}
