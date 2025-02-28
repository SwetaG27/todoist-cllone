import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import { fetchProjects, moveTask } from "../Utility/api";

const { Option } = Select;

const TaskMoveModal = ({ visible, onCancel, task, currentProjectId }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetchedProjects = await fetchProjects();

        const filteredProjects = fetchedProjects.filter(
          (project) => project.id !== currentProjectId
        );

        setProjects(filteredProjects || []);
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
      }
    };

    if (visible) {
      loadProjects();
    }
  }, [visible, currentProjectId]);

  const handleMove = async () => {
    if (!selectedProject) {
      message.error("Please select a project");
      return;
    }

    try {
      const movedTask = await moveTask(task.id, selectedProject);
      message.success("Task moved successfully");
      onCancel();
    } catch (error) {
      message.error("Failed to move task");
    }
  };

  return (
    <Modal
      title="Move Task"
      open={visible}
      onOk={handleMove}
      onCancel={onCancel}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="Select a project"
        onChange={(value) => setSelectedProject(value)}
      >
        {(projects || []).map((project) => (
          <Option key={project.id} value={project.id}>
            {project.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default TaskMoveModal;
