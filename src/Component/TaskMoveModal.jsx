import { Modal, Select } from "antd";

const { Option } = Select;

const TaskMoveModal = ({
  movingTask,
  projects,
  targetProjectId,
  onTargetProjectChange,
  onSave,
  onCancel,
}) => {
  return (
    <Modal
      title="Move Task"
      open={!!movingTask}
      onOk={onSave}
      onCancel={onCancel}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="Select a project"
        value={targetProjectId}
        onChange={onTargetProjectChange}
      >
        {projects.map((project) => (
          <Option key={project.id} value={project.id}>
            {project.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default TaskMoveModal;