import { useState, type SubmitEvent } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { deleteTask, type Project, type Task } from '../api';

interface Props {
  project: Project;
  task: Task;
  onClose: () => void;
  onDeleted: (projectId: number) => void;
}

export function DeleteTaskDialog({ project, task, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    if (!deleting) onClose();
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (deleting) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteTask(project.id, task.id);
      onDeleted(project.id);
    } catch (failure) {
      setError(failure instanceof Error && !(failure instanceof TypeError)
        ? failure.message
        : 'Не удалось удалить задачу');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open fullWidth maxWidth="xs" aria-labelledby="delete-task-title" aria-describedby="delete-task-description" onClose={close}>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DialogTitle id="delete-task-title">Удалить задачу?</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}>{task.title}</Typography>
            <Typography id="delete-task-description" variant="body2" color="textSecondary">
              Проект: {project.name}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={close} disabled={deleting}>Отмена</Button>
          <Button type="submit" variant="contained" color="error" disabled={deleting} startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : undefined}>
            {deleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
