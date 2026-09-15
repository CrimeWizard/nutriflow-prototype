/** Pre-workout ~90 min before gym; post-workout dinner ~90 min after. */
export function slotTimes(gymTime: string, isGymDay: boolean): Record<string, string> {
  const [h, m] = gymTime.split(':').map(Number);
  const gymMins = h * 60 + m;
  const preMins = Math.max(5 * 60 + 30, gymMins - 90);
  const postMins = gymMins + 90;

  const fmt = (total: number) => {
    const hh = Math.floor(total / 60) % 24;
    const mm = total % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  const base: Record<string, string> = {
    breakfast: '07:30',
    lunch: '13:00',
    dinner: '19:00',
  };

  if (isGymDay) {
    return { ...base, 'pre-workout': fmt(preMins), 'post-workout': fmt(postMins) };
  }
  return base;
}

export const SLOT_LABELS: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  'pre-workout': 'Pre-workout',
  dinner: 'Dinner',
  'post-workout': 'Post-workout',
};
