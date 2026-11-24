import { useEffect, useRef } from 'react';
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi, ICellRendererParams } from 'ag-grid-community';
import type { Project, Task } from '../api';
import { PriorityChip } from './PriorityChip';
import { formatDate, gridTheme, singleRowSelection } from './gridTheme';

export type TaskStatus = 'idle' | 'loading' | 'ready' | 'error';

interface Props {
  project: Project | null;
  tasks: Task[];
  status: TaskStatus;
  selectedTask: Task | null;
  onSelectTask: (task: Task | null) => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRetry: () => void;
}

const defaultColDef: ColDef<Task> = {
  sortable: true,
  filter: false,
  resizable: false,
};

const hoursFormat = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const columns: ColDef<Task>[] = [
  { field: 'id', headerName: 'ID', width: 72, cellStyle: { color: '#607d8b' } },
  { field: 'title', headerName: 'Название задачи', flex: 2.5, minWidth: 200 },
  {
    field: 'due_date',
    headerName: 'Срок',
    flex: 1,
    minWidth: 120,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: 'estimated_hours',
    headerName: 'Оценка, ч',
    flex: 1,
    minWidth: 110,
    cellClass: 'numeric-cell',
    valueFormatter: ({ value }) => hoursFormat.format(Number(value)),
    comparator: (a, b) => Number(a) - Number(b),
  },
  {
    field: 'priority',
    headerName: 'Приоритет',
    flex: 0.8,
    minWidth: 115,
    cellRenderer: ({ value }: ICellRendererParams<Task, number>) =>
      value ? <PriorityChip priority={value} /> : null,
  },
];

const emptyMessages: Record<TaskStatus, string> = {
  idle: 'Выберите проект в таблице выше, чтобы посмотреть задачи',
  loading: 'Загрузка задач...',
  ready: 'Нет задач',
  error: 'Не удалось загрузить задачи',
};

export function TasksTable({
  project,
  tasks,
  status,
  selectedTask,
  onSelectTask,
  onAdd,
  onEdit,
  onDelete,
  onRetry,
}: Props) {
  const gridApi = useRef<GridApi<Task> | null>(null);
  const canEditTask = Boolean(project && selectedTask && selectedTask.project_id === project.id);

  useEffect(() => {
    if (!selectedTask) {
      gridApi.current?.deselectAll();
    }
  }, [selectedTask, project?.id]);

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={1.5}
        sx={{ px: 2.5, py: 1.75, alignItems: { lg: 'center' }, justifyContent: 'space-between' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h2" variant="h2">
            Задачи проекта
          </Typography>
          {project && (
            <Typography variant="body2" color="textSecondary" noWrap>
              {project.name}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', flexShrink: 0 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddRounded />}
            disabled={!project}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            onClick={onAdd}
          >
            Добавить запись
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditOutlined />}
            disabled={!canEditTask}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            onClick={onEdit}
          >
            Изменить
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteOutlineRounded />}
            disabled={!canEditTask}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            onClick={onDelete}
          >
            Удалить
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ position: 'relative', height: 309, borderTop: 1, borderColor: 'divider' }}>
        <AgGridReact<Task>
          theme={gridTheme}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          rowModelType="clientSide"
          rowData={tasks}
          rowSelection={singleRowSelection}
          suppressCellFocus
          getRowId={({ data }) => String(data.id)}
          rowHeight={44}
          headerHeight={44}
          loading={false}
          suppressNoRowsOverlay
          onGridReady={({ api }) => {
            gridApi.current = api;
          }}
          onGridPreDestroyed={() => {
            gridApi.current = null;
          }}
          onSelectionChanged={({ api }) => {
            const task = api.getSelectedRows()[0] ?? null;
            onSelectTask(task && project && task.project_id === project.id ? task : null);
          }}
        />

        {tasks.length === 0 && (
          <Stack
            spacing={1}
            sx={{
              position: 'absolute',
              top: 44,
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              bgcolor: 'background.paper',
              px: 2,
            }}
          >
            {status === 'loading' && <CircularProgress size={24} />}
            <Typography color={status === 'error' ? 'error' : 'textSecondary'}>
              {emptyMessages[status]}
            </Typography>
            {status === 'error' && (
              <Button variant="outlined" size="small" onClick={onRetry}>
                Повторить
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
