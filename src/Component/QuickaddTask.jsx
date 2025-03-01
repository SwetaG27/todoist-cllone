import { Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const QuickAddTask = ({
  showForm,
  onToggleForm,
  newTaskContent,
  newTaskDescription,
  onContentChange,
  onDescriptionChange,
  onAddTask,
  loading,
}) => {
  const handleCancel = () => {
    onToggleForm(false);
    onContentChange("");
    onDescriptionChange("");
  };

  if (!showForm) {
    return (
      <Button
        type="text"
        icon={<PlusOutlined style={{ color: "#db4c3f" }} />}
        onClick={() => onToggleForm(true)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "8px 0",
          color: "#db4c3f",
        }}
      >
        Add task
      </Button>
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      <Input
        placeholder="Task name"
        value={newTaskContent}
        onChange={(e) => onContentChange(e.target.value)}
        onPressEnter={onAddTask}
        style={{ marginBottom: "8px", borderColor: "#e8e8e8" }}
      />
      <Input.TextArea
        placeholder="Description (optional)"
        value={newTaskDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={2}
        style={{ marginBottom: "8px", borderColor: "#e8e8e8" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div></div>
        <div>
          <Button onClick={handleCancel} style={{ marginRight: "8px" }}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={onAddTask}
            loading={loading}
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
  );
};

export default QuickAddTask;
