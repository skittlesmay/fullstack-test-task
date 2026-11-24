import { Chip, type ChipProps } from '@mui/material';

const priorities: Record<number, { label: string; color: ChipProps['color'] }> = {
  1: { label: 'Высокий', color: 'error' },
  2: { label: 'Средний', color: 'warning' },
  3: { label: 'Низкий', color: 'default' },
};

export function PriorityChip({ priority }: { priority: number }) {
  const item = priorities[priority];
  if (!item) return null;
  return <Chip size="small" variant="outlined" label={item.label} color={item.color} />;
}
