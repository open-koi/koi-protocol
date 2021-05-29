export function DeregisterTask(state, action) {
  const KOI_TASKS = state.KOI_TASKS;
  const newtasks = state.KOI_TASKS.filter(
    (e) => e.TaskId != action.input.taskId
  );
  KOI_TASKS = newtasks;
  return { state };
}
