export function formatEgp(amount: number): string {
  return `${amount.toLocaleString('en-EG')} EGP`;
}

export function isGymToday(gymDays: string[]): boolean {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return gymDays.includes(days[new Date().getDay()]);
}

export function generateOrderId(): string {
  return `NF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function goalLabel(goal: string): string {
  const map: Record<string, string> = {
    cut: 'Lose weight',
    maintain: 'Stay fit',
    bulk: 'Build muscle',
  };
  return map[goal] ?? goal;
}
