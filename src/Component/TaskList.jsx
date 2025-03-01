import { useState, useEffect } from "react";
import { message } from "antd";
import {
  fetchTasks,
  completeTask,
  deleteTask,
  updateTask,
  fetchProjects,
  createTask,
  moveTask,
} from "../Utility/api";

import TaskHeader from "./TaskHeader";
import TaskCollection from "./TaskCollection";
import TaskEditModal from "./TaskEditModal";
import TaskMoveModal from "./TaskMoveModal";

const TaskList = ({ selectedProject, refreshKey = 0 }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [addTaskLoading, setAddTaskLoading] = useState(false);

  const [editingTask, setEditingTask] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [movingTask, setMovingTask] = useState(null);
  const [targetProjectId, setTargetProjectId] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      if (selectedProject) {
        try {
          setLoading(true);
          const projectId =
            selectedProject.name === "Inbox"
              ? null
              : selectedProject.id.toString();

          const fetchedTasks = await fetchTasks(projectId);
          setTasks(fetchedTasks);
        } catch (error) {
          message.error(`Failed to load tasks for ${selectedProject.name}`);
          setTasks([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTasks();
  }, [selectedProject, refreshKey]);

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const handleComplete = async (taskId) => {
    const success = await completeTask(taskId);
    if (success) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    } else {
      message.error("Failed to complete task");
    }
  };

  const handleDelete = async (taskId) => {
    const success = await deleteTask(taskId);
    if (success) {
      setTasks(tasks.filter((task) => task.id !== taskId));
      message.success("Task deleted", 2);
    } else {
      message.error("Failed to delete task");
    }
  };

  const handleEditStart = (task) => {
    setEditingTask(task);
    setEditContent(task.content);
    setEditDescription(task.description || "");
  };

  const handleEditSave = async () => {
    if (!editContent.trim()) {
      message.error("Task name cannot be empty");
      return;
    }

    const updatedTask = await updateTask(editingTask.id, {
      content: editContent,
      description: editDescription,
    });

    if (updatedTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                content: editContent,
                description: editDescription,
              }
            : task
        )
      );
      setEditingTask(null);
      message.success("Task updated");
    } else {
      message.error("Failed to update task");
    }
  };

  const handleMoveStart = (task) => {
    setMovingTask(task);
    setTargetProjectId(task.project_id || "inbox");
  };

  const handleMoveSave = async () => {
    try {
      message.loading({ content: "Moving task...", key: "taskMove" });

      const newTask = await moveTask(movingTask.id, targetProjectId);

      setTasks(tasks.filter((task) => task.id !== movingTask.id));

      setMovingTask(null);

      message.success({ content: "Task moved successfully", key: "taskMove" });

      setTimeout(() => {
        if (selectedProject) {
          setLoading(true);
          const refreshProjectId =
            selectedProject.name === "Inbox"
              ? null
              : selectedProject.id.toString();

          fetchTasks(refreshProjectId)
            .then((fetchedTasks) => {
              setTasks(fetchedTasks);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error refreshing tasks:", error);
              message.error("Failed to refresh task list");
              setLoading(false);
            });
        }
      }, 1000);
    } catch (error) {
      console.error("Task move error:", error);
      message.error({
        content: `Failed to move task: ${error.message || "Unknown error"}`,
        key: "taskMove",
      });
    }
  };

  const handleAddTask = async () => {
    if (!newTaskContent.trim()) {
      message.error("Task name cannot be empty");
      return;
    }

    try {
      setAddTaskLoading(true);
      const projectId =
        selectedProject?.id === "inbox" ? null : selectedProject?.id;
      const newTask = await createTask(
        projectId,
        newTaskContent,
        newTaskDescription || ""
      );
      setAddTaskLoading(false);

      if (newTask) {
        setTasks([...tasks, newTask]);
        setNewTaskContent("");
        setNewTaskDescription("");
        setShowForm(false);
        message.success("Task created successfully");
      } else {
        message.error("Failed to create task");
      }
    } catch (error) {
      setAddTaskLoading(false);
      message.error("Failed to create task");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "transparent" }}>
      <TaskHeader projectName={selectedProject?.name} />

      <TaskCollection
        tasks={tasks}
        loading={loading}
        showForm={showForm}
        onToggleForm={setShowForm}
        newTaskContent={newTaskContent}
        newTaskDescription={newTaskDescription}
        onContentChange={setNewTaskContent}
        onDescriptionChange={setNewTaskDescription}
        onAddTask={handleAddTask}
        addTaskLoading={addTaskLoading}
        onComplete={handleComplete}
        onEdit={handleEditStart}
        onMove={handleMoveStart}
        onDelete={handleDelete}
      />

      <TaskEditModal
        editingTask={editingTask}
        editContent={editContent}
        editDescription={editDescription}
        onContentChange={(e) => setEditContent(e.target.value)}
        onDescriptionChange={(e) => setEditDescription(e.target.value)}
        onSave={handleEditSave}
        onCancel={() => setEditingTask(null)}
      />

      <TaskMoveModal
        movingTask={movingTask}
        projects={projects}
        targetProjectId={targetProjectId}
        onTargetProjectChange={(value) => setTargetProjectId(value)}
        onSave={handleMoveSave}
        onCancel={() => setMovingTask(null)}
      />
    </div>
  );
};

export default TaskList;
