export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'hoje';
  if (diffDays === 1) return 'ontem';
  if (diffDays < 7) return `há ${diffDays} dias`;
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana(s)`;
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} mês(es)`;
  return `há ${Math.floor(diffDays / 365)} ano(s)`;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a);
  const db = new Date(b);
  return Math.abs(Math.floor((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24)));
}
