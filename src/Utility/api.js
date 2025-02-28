const API_URL = "https://api.todoist.com/rest/v2";
const API_TOKEN = "7f3cf404190b1f9b99c7b4f18057a17074565026";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("API Error:", {
      status: response.status,
      statusText: response.statusText,
      data: errorData,
    });
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return true;
  }

  return response.json();
};

const getHeaders = () => ({
  Authorization: `Bearer ${API_TOKEN}`,
  "Content-Type": "application/json",
});

export const fetchProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: "GET",
      headers: getHeaders(),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const fetchTasks = async (projectId) => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: getHeaders(),
    });

    const allTasks = await handleResponse(response);

    let filteredTasks;

    if (projectId === null) {
      const projectsResponse = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: getHeaders(),
      });

      const projects = await handleResponse(projectsResponse);
      const inboxProject = projects.find(
        (p) => p.name.toLowerCase() === "inbox" || p.is_inbox_project
      );

      if (inboxProject) {
        filteredTasks = allTasks.filter(
          (task) => task.project_id === inboxProject.id.toString()
        );
      } else {
        filteredTasks = allTasks.filter((task) => !task.project_id);
      }
    } else {
      filteredTasks = allTasks.filter(
        (task) =>
          task.project_id && task.project_id.toString() === projectId.toString()
      );
    }

    return filteredTasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createProject = async (name) => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error creating project:", error);
    return null;
  }
};

export const updateProject = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error updating project:", error);
    return null;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await fetch(`${API_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
};

export const createTask = async (projectId, content, description = "") => {
  try {
    const data = { content, description };
    if (projectId !== null) {
      data.project_id = projectId;
    }

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
};

export const updateTask = async (id, updates) => {
  try {
    const currentTaskResponse = await fetch(`${API_URL}/tasks/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const currentTask = await handleResponse(currentTaskResponse);

    const updateData = {
      content: updates.content || currentTask.content,
      ...updates,
    };

    if (updates.project_id !== undefined) {
      updateData.project_id = updates.project_id
        ? updates.project_id.toString()
        : "";
    }

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });

    const responseData = await handleResponse(response);

    return {
      ...responseData,
      project_id: updateData.project_id,
    };
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};

export const completeTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}/close`, {
      method: "POST",
      headers: getHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error("Error completing task:", error);
    return false;
  }
};

export const reopenTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}/reopen`, {
      method: "POST",
      headers: getHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error("Error reopening task:", error);
    return false;
  }
};

export const fetchFavoriteProjects = async () => {
  try {
    const allProjects = await fetchProjects();

    const storedFavorites = JSON.parse(
      localStorage.getItem("todoistFavorites") || "[]"
    );

    const localFavorites = allProjects.filter((project) =>
      storedFavorites.includes(project.id.toString())
    );

    const nameFavorites = allProjects.filter((project) =>
      project.name.toLowerCase().includes("favorite")
    );

    const combinedFavorites = [
      ...new Map(
        [...localFavorites, ...nameFavorites].map((project) => [
          project.id,
          project,
        ])
      ).values(),
    ];

    const favoriteProjects = combinedFavorites.map((project) => ({
      ...project,
      is_favorite: true,
    }));

    return favoriteProjects;
  } catch (error) {
    console.error("Error fetching favorite projects:", error);
    return [];
  }
};

export const toggleProjectFavorite = async (project, isFavorite) => {
  try {
    const storedFavorites = JSON.parse(
      localStorage.getItem("todoistFavorites") || "[]"
    );

    if (isFavorite) {
      const updatedFavorites = storedFavorites.filter(
        (id) => id !== project.id.toString()
      );
      localStorage.setItem(
        "todoistFavorites",
        JSON.stringify(updatedFavorites)
      );
    } else {
      if (!storedFavorites.includes(project.id.toString())) {
        storedFavorites.push(project.id.toString());
        localStorage.setItem(
          "todoistFavorites",
          JSON.stringify(storedFavorites)
        );
      }
    }

    const updatedFavorites = await fetchFavoriteProjects();

    return {
      ...project,
      is_favorite: !isFavorite,
    };
  } catch (error) {
    console.error("Error managing favorites:", error);
    return null;
  }
};

export const getFavoriteProjectIds = () => {
  try {
    return JSON.parse(localStorage.getItem("todoistFavorites") || "[]");
  } catch (error) {
    console.error("Error retrieving favorite project IDs:", error);
    return [];
  }
};

export const resetFavorites = () => {
  try {
    localStorage.removeItem("todoistFavorites");
  } catch (error) {
    console.error("Error resetting favorites:", error);
  }
};

export const moveTask = async (taskId, destinationProjectId) => {
  try {
    const taskResponse = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!taskResponse.ok) {
      throw new Error("Could not get task details");
    }

    const taskDetails = await taskResponse.json();

    const formattedProjectId =
      destinationProjectId === "inbox" ? "" : destinationProjectId;

    const newTaskData = {
      content: taskDetails.content,
      description: taskDetails.description || "",
      project_id: formattedProjectId,
      priority: taskDetails.priority,
      due_string: taskDetails.due?.string || null,
      labels: taskDetails.labels || [],
    };

    const createResponse = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(newTaskData),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      throw new Error(
        `Failed to create new task: ${errorData.message || "Unknown error"}`
      );
    }

    const newTask = await createResponse.json();

    const deleteResponse = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!deleteResponse.ok) {
      console.warn("Original task could not be deleted");
    } else {
      console.log("Original task deleted successfully");
    }

    return newTask;
  } catch (error) {
    console.error("Error moving task:", error);
    throw error;
  }
};
