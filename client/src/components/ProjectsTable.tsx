import { useMemo, useRef, useState } from 'react';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi, IDatasource } from 'ag-grid-community';
import { getProjects, type Project } from '../api';
import { formatDate, gridTheme, singleRowSelection } from './gridTheme';

interface Props {
  onSelect: (project: Project | null) => void;
}

const defaultColDef: ColDef<Project> = {
  sortable: false,
  filter: false,
  resizable: false,
};

const moneyFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
});

const columns: ColDef<Project>[] = [
  { field: 'id', headerName: 'ID', width: 72, cellStyle: { color: '#607d8b' } },
  { field: 'name', headerName: 'Название проекта', flex: 2.5, minWidth: 200 },
  {
    field: 'start_date',
    headerName: 'Дата начала',
    flex: 1,
    minWidth: 120,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: 'budget',
    headerName: 'Бюджет',
    flex: 1,
    minWidth: 140,
    cellClass: 'numeric-cell',
    valueFormatter: ({ value }) => (value === undefined ? '' : moneyFormat.format(Number(value))),
  },
  {
    field: 'team_size',
    headerName: 'Команда',
    flex: 0.8,
    minWidth: 100,
    cellClass: 'numeric-cell',
    valueFormatter: ({ value }) => (value === undefined ? '' : `${value} чел.`),
  },
];

export function ProjectsTable({ onSelect }: Props) {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const gridApi = useRef<GridApi<Project> | null>(null);

  const datasource = useMemo<IDatasource>(() => {
    const controllers = new Set<AbortController>();

    return {
      async getRows(params) {
        const controller = new AbortController();
        controllers.add(controller);

        try {
          const limit = params.endRow - params.startRow;
          const data = await getProjects(params.startRow, limit, controller.signal);
          if (controller.signal.aborted) return;

          setHasError(false);
          setLoading(false);
          params.successCallback(data.rows, data.total);
        } catch {
          if (controller.signal.aborted) return;

          setHasError(true);
          setLoading(false);
          params.failCallback();
        } finally {
          controllers.delete(controller);
        }
      },
      destroy() {
        controllers.forEach((controller) => controller.abort());
        controllers.clear();
      },
    };
  }, []);

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Stack direction="row" spacing={1.5} sx={{ px: 2.5, py: 1.75, alignItems: 'center' }}>
        <Typography component="h2" variant="h2">
          Проекты
        </Typography>
      </Stack>

      {hasError && (
        <Alert
          severity="error"
          sx={{ mx: 2.5, mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => gridApi.current?.refreshInfiniteCache()}
            >
              Повторить
            </Button>
          }
        >
          Не удалось загрузить проекты.
        </Alert>
      )}

      <Box sx={{ height: 353, borderTop: 1, borderColor: 'divider' }}>
        <AgGridReact<Project>
          theme={gridTheme}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          rowModelType="infinite"
          datasource={datasource}
          cacheBlockSize={25}
          maxBlocksInCache={6}
          rowBuffer={3}
          rowHeight={44}
          headerHeight={44}
          rowSelection={singleRowSelection}
          suppressCellFocus
          getRowId={({ data }) => String(data.id)}
          loading={loading}
          localeText={{ loadingOoo: 'Загрузка...', noRowsToShow: 'Нет проектов' }}
          onGridReady={({ api }) => {
            gridApi.current = api;
          }}
          onGridPreDestroyed={() => {
            gridApi.current = null;
          }}
          onSelectionChanged={({ api }) => {
            onSelect(api.getSelectedRows()[0] ?? null);
          }}
        />
      </Box>
    </Paper>
  );
}
