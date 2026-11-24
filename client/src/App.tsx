import { useState } from 'react';
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import MenuRounded from '@mui/icons-material/MenuRounded';
import { ProjectsPage } from './ProjectsPage';

const pages = [
  { id: 'projects', title: 'Проекты', icon: <DashboardOutlined fontSize="small" /> },
  { id: 'reports', title: 'Отчёты', icon: <AssessmentOutlined fontSize="small" /> },
  { id: 'team', title: 'Команда', icon: <GroupOutlined fontSize="small" /> },
  { id: 'settings', title: 'Настройки', icon: <SettingsOutlined fontSize="small" /> },
] as const;

type Page = typeof pages[number]['id'];
const drawerWidth = 256;

const sidebarGradient = 'linear-gradient(195deg, #2b3240, #1b2029)';

export function App() {
  const [page, setPage] = useState<Page>('projects');
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPage = pages.find((item) => item.id === page)!;

  const navigation = (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', px: 1.5, py: 1.25 }}>
        <DashboardOutlined sx={{ color: '#64b5f6', fontSize: 22 }} />
        <Typography sx={{ fontSize: 17, fontWeight: 600, color: '#ffffff', letterSpacing: 0.1 }}>
          Project Tracker
        </Typography>
      </Stack>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', my: 1.5 }} />
      <List disablePadding>
        {pages.map((item) => {
          const active = page === item.id;
          return (
            <ListItemButton
              key={item.id}
              selected={active}
              onClick={() => {
                setPage(item.id);
                setMobileOpen(false);
              }}
              sx={{
                py: 1.15,
                px: 1.5,
                mb: 0.5,
                color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)', color: '#ffffff' },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
                },
                '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.title}
                slotProps={{ primary: { sx: { fontSize: 14, fontWeight: active ? 500 : 400 } } }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 240,
              background: sidebarGradient,
              color: '#ffffff',
              borderRight: 'none',
            },
          }}
        >
          {navigation}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth - 24,
              height: 'calc(100vh - 32px)',
              m: 2,
              borderRadius: 2.5,
              background: sidebarGradient,
              color: '#ffffff',
              borderRight: 'none',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
              boxSizing: 'border-box',
            },
          }}
        >
          {navigation}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 3 }, pl: { md: 2 } }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2, display: { md: 'none' } }}>
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Открыть меню"
            sx={{ color: 'text.primary', bgcolor: 'background.paper', borderRadius: 1.5, boxShadow: '0 1px 4px rgba(15, 23, 42, 0.1)' }}
          >
            <MenuRounded />
          </IconButton>
          <Typography component="h1" variant="h2">{currentPage.title}</Typography>
        </Stack>
        {page === 'projects' ? (
          <ProjectsPage />
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography component="h2" variant="h2" sx={{ mb: 1 }}>{currentPage.title}</Typography>
            <Typography color="textSecondary">Раздел находится в разработке.</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
