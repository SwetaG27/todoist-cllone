import { BorderlessTableOutlined } from "@ant-design/icons";
import ActionMenu from "./ActionMenu";

const ProjectListItem = ({
  project,
  onEdit,
  onDelete,
  onFavorite,
  isFavorite,
}) => {
  return {
    key: project.id.toString(),
    icon: <BorderlessTableOutlined />,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{project.name}</span>
        <ActionMenu
          onEdit={() => onEdit(project)}
          onDelete={() => onDelete(project)}
          onFavorite={() => onFavorite(project)}
          isFavorite={isFavorite}
        />
      </div>
    ),
  };
};

export default ProjectListItem;
