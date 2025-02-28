import { List, Button, Checkbox } from "antd";

const TaskItem = ({ task, onComplete, onEdit, onMove, onDelete }) => {
  return (
    <List.Item
      style={{
        borderBottom: "1px solid #f0f0f0",
        padding: "10px 0",
      }}
      actions={[
        <Button
          key="edit"
          type="text"
          onClick={() => onEdit(task)}
          style={{ color: "#808080" }}
        >
          Edit
        </Button>,
        <Button
          key="move"
          type="text"
          onClick={() => onMove(task)}
          style={{ color: "#808080" }}
        >
          Move
        </Button>,
        <Button
          key="delete"
          type="text"
          onClick={() => onDelete(task.id)}
          style={{ color: "#db4c3f" }}
        >
          Delete
        </Button>,
      ]}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Checkbox
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          style={{ marginRight: "12px", padding: "5px", borderRadius: "50%" }}
        />
        <div>{task.content}</div>
      </div>
    </List.Item>
  );
};

export default TaskItem;
