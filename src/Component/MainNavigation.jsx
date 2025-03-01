import { Menu } from "antd";
import {
  InboxOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const MainNavigation = ({ selectedKey, onMenuClick, onAddTaskClick }) => {
  const items = [
    {
      key: "add-task",
      icon: <PlusOutlined style={{ color: "#db4c3f" }} />,
      label: "Add task",
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onAddTaskClick();
      },
    },
    {
      key: "inbox",
      icon: <InboxOutlined />,
      label: "Inbox",
    },
    {
      key: "today",
      icon: <CalendarOutlined />,
      label: "Today",
    },
    {
      key: "upcoming",
      icon: <CalendarOutlined />,
      label: "Upcoming",
    },
    {
      key: "filters",
      icon: <AppstoreOutlined />,
      label: "Filters & Labels",
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={onMenuClick}
      items={items}
    />
  );
};

export default MainNavigation;
