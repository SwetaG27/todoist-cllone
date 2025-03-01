import { Dropdown, Button } from "antd";
import {
  EllipsisOutlined,
  HeartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ActionMenu = ({ onEdit, onDelete, onFavorite, isFavorite }) => {
  const items = [
    { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: onEdit },
    {
      key: "favorite",
      label: (
        <>
          {isFavorite ? (
            <HeartOutlined style={{ color: "gold" }} />
          ) : (
            <HeartOutlined />
          )}
          {isFavorite ? " Remove from Favorites" : " Add to Favorites"}
        </>
      ),
      onClick: onFavorite,
    },
    { type: "divider" },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button
        type="text"
        icon={<EllipsisOutlined />}
        onClick={(e) => e.stopPropagation()}
        style={{
          minWidth: "24px",
          height: "24px",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Dropdown>
  );
};

export default ActionMenu;
