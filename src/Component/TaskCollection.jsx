import { List } from "antd";
import TaskItem from "./TaskItem";
import QuickAddTask from "./QuickaddTask";

const TaskCollection = ({
  tasks,
  loading,
  showForm,
  onToggleForm,
  newTaskContent,
  newTaskDescription,
  onContentChange,
  onDescriptionChange,
  onAddTask,
  addTaskLoading,
  onComplete,
  onEdit,
  onMove,
  onDelete,
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        Loading tasks...
      </div>
    );
  }

  return (
    <List
      style={{ borderColor: "#e8e8e8" }}
      dataSource={tasks.length > 0 ? tasks : []}
      renderItem={(task) => (
        <TaskItem
          task={task}
          onComplete={onComplete}
          onEdit={onEdit}
          onMove={onMove}
          onDelete={onDelete}
        />
      )}
      locale={{ emptyText: "No tasks in this project" }}
      footer={
        <QuickAddTask
          showForm={showForm}
          onToggleForm={onToggleForm}
          newTaskContent={newTaskContent}
          newTaskDescription={newTaskDescription}
          onContentChange={onContentChange}
          onDescriptionChange={onDescriptionChange}
          onAddTask={onAddTask}
          loading={addTaskLoading}
        />
      }
    />
  );
};

export default TaskCollection;
