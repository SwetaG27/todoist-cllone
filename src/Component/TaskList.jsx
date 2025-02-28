import { useState, useEffect } from "react";
import { List, message, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  fetchTasks,
  completeTask,
  deleteTask,
  updateTask,
  fetchProjects,
  createTask,
  moveTask,
} from "../Utility/api";

import TaskItem from "./TaskItem";
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

  const renderTaskList = () => {
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
            onComplete={handleComplete}
            onEdit={handleEditStart}
            onMove={handleMoveStart}
            onDelete={handleDelete}
          />
        )}
        locale={{ emptyText: "No tasks in this project" }}
        footer={
          <div>
            {!showForm ? (
              <Button
                type="text"
                icon={<PlusOutlined style={{ color: "#db4c3f" }} />}
                onClick={() => setShowForm(true)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 0",
                  color: "#db4c3f",
                }}
              >
                Add task
              </Button>
            ) : (
              <div style={{ padding: "8px 0" }}>
                <Input
                  placeholder="Task name"
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  onPressEnter={handleAddTask}
                  style={{ marginBottom: "8px", borderColor: "#e8e8e8" }}
                />
                <Input.TextArea
                  placeholder="Description (optional)"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows={2}
                  style={{ marginBottom: "8px", borderColor: "#e8e8e8" }}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div></div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowForm(false);
                        setNewTaskContent("");
                        setNewTaskDescription("");
                      }}
                      style={{ marginRight: "8px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleAddTask}
                      loading={addTaskLoading}
                      style={{
                        backgroundColor: "#db4c3f",
                        borderColor: "#db4c3f",
                      }}
                    >
                      Add task
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      />
    );
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff" }}>
      <div
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "500", margin: 0 }}>
          {selectedProject?.name || "Inbox"}
        </h2>
      </div>

      {renderTaskList()}

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
