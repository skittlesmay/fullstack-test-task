import { useCallback, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { getTasks, type Project, type Task } from './api';
import { ProjectsTable } from './components/ProjectsTable';
import { TasksTable, type TaskStatus } from './components/TasksTable';
import { TaskFormDialog } from './components/TaskFormDialog';
import { DeleteTaskDialog } from './components/DeleteTaskDialog';

export function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('idle');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [editor, setEditor] = useState<{ project: Project; task: Task | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ project: Project; task: Task } | null>(null);

  const requestController = useRef<AbortController | null>(null);
  const activeProjectId = useRef<number | null>(null);

  const loadTasks = useCallback(async (projectId: number) => {
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;

    setSelectedTask(null);
    setTasks([]);
    setTaskStatus('loading');

    try {
      const rows = await getTasks(projectId, controller.signal);
      if (controller.signal.aborted || activeProjectId.current !== projectId) return;
      setTasks(rows);
      setTaskStatus('ready');
    } catch {
      if (controller.signal.aborted || activeProjectId.current !== projectId) return;
      setTaskStatus('error');
    }
  }, []);

  useEffect(() => {
    return () => {
      activeProjectId.current = null;
      requestController.current?.abort();
    };
  }, []);

  const handleSelectProject = useCallback(
    (project: Project | null) => {
      activeProjectId.current = project?.id ?? null;
      setSelectedProject(project);
      setEditor(null);
      setDeleteTarget(null);

      if (project) {
        void loadTasks(project.id);
      } else {
        requestController.current?.abort();
        setSelectedTask(null);
        setTasks([]);
        setTaskStatus('idle');
      }
    },
    [loadTasks],
  );

  function handleTaskChanged(projectId: number) {
    if (activeProjectId.current !== projectId) return;
    setEditor(null);
    setDeleteTarget(null);
    void loadTasks(projectId);
  }

  return (
    <Stack spacing={2.5}>
      <ProjectsTable onSelect={handleSelectProject} />

      <TasksTable
        project={selectedProject}
        tasks={tasks}
        status={taskStatus}
        selectedTask={selectedTask}
        onSelectTask={setSelectedTask}
        onAdd={() => {
          if (selectedProject) setEditor({ project: selectedProject, task: null });
        }}
        onEdit={() => {
          if (selectedProject && selectedTask) {
            setEditor({ project: selectedProject, task: selectedTask });
          }
        }}
        onDelete={() => {
          if (selectedProject && selectedTask) {
            setDeleteTarget({ project: selectedProject, task: selectedTask });
          }
        }}
        onRetry={() => {
          if (selectedProject) void loadTasks(selectedProject.id);
        }}
      />

      {editor && (
        <TaskFormDialog
          key={`${editor.project.id}:${editor.task?.id ?? 'new'}`}
          project={editor.project}
          task={editor.task}
          onClose={() => setEditor(null)}
          onSaved={handleTaskChanged}
        />
      )}

      {deleteTarget && (
        <DeleteTaskDialog
          key={`${deleteTarget.project.id}:${deleteTarget.task.id}`}
          project={deleteTarget.project}
          task={deleteTarget.task}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleTaskChanged}
        />
      )}
    </Stack>
  );
}
