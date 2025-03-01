import axios from "axios";

const todoAPI = axios.create({
  baseURL: "https://api.todoist.com/rest/v2",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 7f3cf404190b1f9b99c7b4f18057a17074565026",
  },
});

export const getProjects = async () => {
  try {
    const response = await todoAPI.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchProjects = getProjects;

export const createProject = async (name, color = "berry_red") => {
  try {
    const response = await todoAPI.post("/projects", { name, color });
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (id, data) => {
  try {
    const response = await todoAPI.post(`/projects/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    await todoAPI.delete(`/projects/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const toggleFavorite = async (projectId, isFavorite) => {
  try {
    const response = await todoAPI.post(`/projects/${projectId}`, {
      is_favorite: isFavorite,
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    throw error;
  }
};

export const fetchTasks = async (projectId = null) => {
  try {
    const response = await todoAPI.get("/tasks");
    const allTasks = response.data;

    if (projectId === null) {
      const projectsResponse = await todoAPI.get("/projects");
      const projects = projectsResponse.data;
      const inboxProject = projects.find((p) => p.is_inbox_project === true);

      if (inboxProject) {
        return allTasks.filter((task) => task.project_id === inboxProject.id);
      } else {
        return allTasks.filter((task) => {
          if (!task.project_id) return true;

          const taskProject = projects.find((p) => p.id === task.project_id);
          return taskProject && taskProject.name.toLowerCase() === "inbox";
        });
      }
    } else {
      return allTasks.filter(
        (task) =>
          task.project_id && task.project_id.toString() === projectId.toString()
      );
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (projectId, content, description = "") => {
  try {
    const taskData = { content, description };

    if (projectId) {
      taskData.project_id = projectId;
    }

    const response = await todoAPI.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const response = await todoAPI.post(`/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await todoAPI.delete(`/tasks/${taskId}`);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

export const completeTask = async (taskId) => {
  try {
    await todoAPI.post(`/tasks/${taskId}/close`);
    return true;
  } catch (error) {
    console.error("Error completing task:", error);
    return false;
  }
};

export const reopenTask = async (taskId) => {
  try {
    await todoAPI.post(`/tasks/${taskId}/reopen`);
    return true;
  } catch (error) {
    console.error("Error reopening task:", error);
    return false;
  }
};

export const moveTask = async (taskId, destinationProjectId) => {
  try {
    const taskResponse = await todoAPI.get(`/tasks/${taskId}`);
    const taskDetails = taskResponse.data;

    const newTaskData = {
      content: taskDetails.content,
      description: taskDetails.description || "",
      project_id:
        destinationProjectId === "inbox" ? null : destinationProjectId,
      priority: taskDetails.priority,
      labels: taskDetails.labels || [],
      due_string: taskDetails.due?.string || null,
    };

    const newTaskResponse = await todoAPI.post("/tasks", newTaskData);

    await todoAPI.delete(`/tasks/${taskId}`);

    return newTaskResponse.data;
  } catch (error) {
    console.error("Error moving task:", error);
    throw error;
  }
};

export const fetchFavoriteProjects = async () => {
  try {
    const response = await todoAPI.get("/projects");
    const projects = response.data;

    const favoriteProjects = projects.filter((project) => project.is_favorite);
    return favoriteProjects;
  } catch (error) {
    console.error("Error fetching favorite projects:", error);
    throw error;
  }
};

export const toggleProjectFavorite = async (project, isFavorite) => {
  try {
    const updatedProject = await toggleFavorite(project.id, !isFavorite);
    return updatedProject;
  } catch (error) {
    console.error("Error toggling project favorite status:", error);
    throw error;
  }
};
