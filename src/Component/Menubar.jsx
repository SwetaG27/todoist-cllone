import { useState, useEffect } from "react";
import { Layout, Menu, message, Typography, Space, Avatar } from "antd";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectFavorite,
  fetchFavoriteProjects,
} from "../Utility/api";
import AddTask from "./AddTask";
import ProjectModals from "./ProjectModals";
import MainNavigation from "./MainNavigation";
import ProjectsSection from "./ProjectSection";
import FavoritesSection from "./FavouriteSection";

const { Sider } = Layout;
const { Title } = Typography;

const MenuBar = ({ onProjectSelect, onTaskAdded }) => {
  const [projects, setProjects] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedKey, setSelectedKey] = useState("inbox");
  const [loading, setLoading] = useState(false);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data.filter((project) => project.name !== "Inbox"));

        const favProjects = await fetchFavoriteProjects();
        setFavorites(favProjects);
      } catch (error) {
        message.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);

    if (e.key === "inbox") {
      onProjectSelect({ id: null, name: "Inbox" });
    } else if (["today", "upcoming", "filters"].includes(e.key)) {
      onProjectSelect({
        id: e.key,
        name: e.key.charAt(0).toUpperCase() + e.key.slice(1),
      });
    } else {
      const project =
        projects.find((p) => p.id.toString() === e.key) ||
        favorites.find((p) => p.id.toString() === e.key);
      if (project) {
        onProjectSelect({ id: project.id, name: project.name });
      }
    }
  };

  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      message.error("Project name cannot be empty");
      return;
    }

    setLoading(true);
    const newProject = await createProject(newProjectName);
    setLoading(false);

    if (newProject) {
      setProjects([...projects, newProject]);
      setNewProjectName("");
      setIsAddModalVisible(false);
      message.success("Project created successfully");
    } else {
      message.error("Failed to create project");
    }
  };

  const handleEditProject = async () => {
    if (!currentProject || !currentProject.name.trim()) {
      message.error("Project name cannot be empty");
      return;
    }

    setLoading(true);
    const updatedProject = await updateProject(currentProject.id, {
      name: currentProject.name,
    });
    setLoading(false);

    if (updatedProject) {
      setProjects(
        projects.map((p) => (p.id === currentProject.id ? updatedProject : p))
      );

      if (favorites.some((f) => f.id === currentProject.id)) {
        setFavorites(
          favorites.map((f) =>
            f.id === currentProject.id ? updatedProject : f
          )
        );
      }

      setIsEditModalVisible(false);
      message.success("Project updated successfully");
    } else {
      message.error("Failed to update project");
    }
  };

  const handleDeleteProject = async () => {
    if (!currentProject) return;

    setLoading(true);
    const success = await deleteProject(currentProject.id);
    setLoading(false);

    if (success) {
      setProjects(projects.filter((p) => p.id !== currentProject.id));

      if (favorites.some((f) => f.id === currentProject.id)) {
        setFavorites(favorites.filter((f) => f.id !== currentProject.id));
      }

      if (selectedKey === currentProject.id.toString()) {
        setSelectedKey("inbox");
        onProjectSelect({ id: null, name: "Inbox" });
      }

      setIsDeleteModalVisible(false);
      message.success("Project deleted successfully");
    } else {
      message.error("Failed to delete project");
    }
  };

  const handleToggleFavorite = async (project) => {
    const isFavorite = favorites.some((p) => p.id === project.id);
    console.log(`Project ${project.name} is currently favorite: ${isFavorite}`);

    setLoading(true);
    try {
      const updatedProject = await toggleProjectFavorite(project, isFavorite);
      console.log("Updated project:", updatedProject);

      if (updatedProject) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? updatedProject : p))
        );

        if (isFavorite) {
          setFavorites((prev) => prev.filter((p) => p.id !== project.id));
          message.success(`Removed ${project.name} from favorites`);
        } else {
          setFavorites((prev) => [...prev, updatedProject]);
          message.success(`Added ${project.name} to favorites`);
        }
      }
    } catch (error) {
      console.error("Error handling toggle favorite:", error);
      message.error("Failed to update favorite status");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setIsAddTaskVisible(false);
    if (onTaskAdded) {
      onTaskAdded(newTask);
    }
  };

  const handleEditProjectStart = (project) => {
    setCurrentProject({ ...project });
    setIsEditModalVisible(true);
  };

  const handleDeleteProjectStart = (project) => {
    setCurrentProject(project);
    setIsDeleteModalVisible(true);
  };

  const getMenuItems = () => {
    const items = [];

    const favoritesSection = FavoritesSection({
      favorites,
      onEditProject: handleEditProjectStart,
      onDeleteProject: handleDeleteProjectStart,
      onToggleFavorite: handleToggleFavorite,
    });

    if (favoritesSection) {
      items.push(favoritesSection);
    }

    const projectsSection = ProjectsSection({
      projects,
      favorites,
      onEditProject: handleEditProjectStart,
      onDeleteProject: handleDeleteProjectStart,
      onToggleFavorite: handleToggleFavorite,
      onAddProject: () => setIsAddModalVisible(true),
    });

    items.push(projectsSection);

    return items;
  };

  return (
    <Sider width={250} style={{ background: "#fcfaf8" }}>
      <Title level={5} style={{ paddingLeft: "16px", marginTop: "15px" }}>
        <Space size={15}>
          <Avatar>S</Avatar> Swetag...
        </Space>
      </Title>

      <MainNavigation
        selectedKey={selectedKey}
        onMenuClick={handleMenuClick}
        onAddTaskClick={() => setIsAddTaskVisible(true)}
      />

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["projects", "favorites"]}
        onClick={handleMenuClick}
        style={{ height: "100%", borderRight: 0 }}
        items={getMenuItems()}
      />

      <AddTask
        visible={isAddTaskVisible}
        onCancel={() => setIsAddTaskVisible(false)}
        onTaskAdded={handleTaskAdded}
      />

      <ProjectModals
        isAddModalVisible={isAddModalVisible}
        isEditModalVisible={isEditModalVisible}
        isDeleteModalVisible={isDeleteModalVisible}
        newProjectName={newProjectName}
        currentProject={currentProject}
        loading={loading}
        onAddProject={handleAddProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        onCancelAdd={() => setIsAddModalVisible(false)}
        onCancelEdit={() => setIsEditModalVisible(false)}
        onCancelDelete={() => setIsDeleteModalVisible(false)}
        onNewProjectNameChange={(e) => setNewProjectName(e.target.value)}
        onCurrentProjectNameChange={(e) =>
          setCurrentProject({ ...currentProject, name: e.target.value })
        }
      />
    </Sider>
  );
};

export default MenuBar;
