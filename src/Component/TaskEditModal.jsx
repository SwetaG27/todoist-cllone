import { Modal, Input, Button } from "antd";

const TaskEditModal = ({
  editingTask,
  editContent,
  editDescription,
  onContentChange,
  onDescriptionChange,
  onSave,
  onCancel,
}) => {
  return (
    <Modal
      title="Edit Task"
      open={!!editingTask}
      onOk={onSave}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSave}
          style={{
            backgroundColor: "#db4c3f",
            borderColor: "#db4c3f",
          }}
        >
          Save
        </Button>,
      ]}
      styles={{ padding: "16px" }}
    >
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", color: "#202020" }}
        >
          Task Name
        </label>
        <Input
          value={editContent}
          onChange={onContentChange}
          style={{ borderColor: "#e8e8e8" }}
        />
      </div>
      <div>
        <label
          style={{ display: "block", marginBottom: "8px", color: "#202020" }}
        >
          Description
        </label>
        <Input.TextArea
          value={editDescription}
          onChange={onDescriptionChange}
          rows={3}
          style={{ borderColor: "#e8e8e8" }}
        />
      </div>
    </Modal>
  );
};

export default TaskEditModal;
