import { useState, type SubmitEvent } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from '@mui/material';
import { createTask, updateTask, type Project, type Task, type TaskInput } from '../api';

interface Props {
  project: Project;
  task: Task | null;
  onClose: () => void;
  onSaved: (projectId: number) => void;
}

export function TaskFormDialog({ project, task, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueDate, setDueDate] = useState(task?.due_date ?? '');
  const [hours, setHours] = useState(task?.estimated_hours ?? '');
  const [priority, setPriority] = useState(task?.priority ?? 2);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    if (!saving) onClose();
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Укажите название задачи');
      return;
    }

    const input: TaskInput = {
      title: trimmedTitle,
      due_date: dueDate,
      estimated_hours: hours.trim(),
      priority,
    };

    setSaving(true);
    setError(null);
    try {
      if (task) {
        await updateTask(project.id, task.id, input);
      } else {
        await createTask(project.id, input);
      }
      onSaved(project.id);
    } catch (failure) {
      setError(failure instanceof Error && !(failure instanceof TypeError)
        ? failure.message
        : 'Не удалось сохранить задачу');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open fullWidth maxWidth="sm" aria-labelledby="task-form-title" onClose={close}>
      <Box component="form" onSubmit={submit} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DialogTitle id="task-form-title">{task ? 'Изменить задачу' : 'Добавить запись'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Проект" value={project.name} fullWidth slotProps={{ input: { readOnly: true } }} sx={{ '& .MuiInputBase-root': { bgcolor: '#f8fafc' } }} />
            <TextField label="Название задачи" name="title" value={title} onChange={(event) => setTitle(event.target.value)} autoFocus fullWidth required disabled={saving}
              slotProps={{ htmlInput: { maxLength: 120 } }} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Срок выполнения" name="due_date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} fullWidth required disabled={saving}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: '0001-01-01', max: '9999-12-31' } }} />
              <TextField label="Оценка, ч" name="estimated_hours" value={hours} onChange={(event) => setHours(event.target.value)} fullWidth required disabled={saving}
                helperText="До двух знаков после точки"
                slotProps={{ htmlInput: { inputMode: 'decimal' } }} />
            </Stack>
            <TextField label="Приоритет" name="priority" select value={priority} onChange={(event) => setPriority(Number(event.target.value))} fullWidth disabled={saving}>
              <MenuItem value={1}>Высокий</MenuItem>
              <MenuItem value={2}>Средний</MenuItem>
              <MenuItem value={3}>Низкий</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={close} disabled={saving}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}>
            {saving ? 'Сохранение...' : task ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
