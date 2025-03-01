import { PlusOutlined } from "@ant-design/icons";
import ProjectListItem from "./ProjectListItem";

const ProjectsSection = ({
  projects,
  favorites,
  onEditProject,
  onDeleteProject,
  onToggleFavorite,
  onAddProject,
}) => {
  const projectItems = projects.map((project) =>
    ProjectListItem({
      project,
      onEdit: onEditProject,
      onDelete: onDeleteProject,
      onFavorite: onToggleFavorite,
      isFavorite: favorites.some((fav) => fav.id === project.id),
    })
  );

  const addProjectItem = {
    key: "add-project",
    icon: <PlusOutlined />,
    label: "Add Project",
    onClick: (e) => {
      e.domEvent.stopPropagation();
      onAddProject();
    },
  };

  const items = [...projectItems, addProjectItem];

  return {
    key: "projects",
    label: "My Projects",
    children: items,
  };
};

export default ProjectsSection;
