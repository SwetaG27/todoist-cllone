import { Modal, Input } from "antd";

const ProjectModals = ({
  isAddModalVisible,
  isEditModalVisible,
  isDeleteModalVisible,
  newProjectName,
  currentProject,
  loading,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onCancelAdd,
  onCancelEdit,
  onCancelDelete,
  onNewProjectNameChange,
  onCurrentProjectNameChange,
}) => {
  return (
    <>
      <Modal
        title="Add Project"
        open={isAddModalVisible}
        onOk={onAddProject}
        onCancel={onCancelAdd}
        confirmLoading={loading}
      >
        <Input
          placeholder="Project name"
          value={newProjectName}
          onChange={onNewProjectNameChange}
          onPressEnter={onAddProject}
        />
      </Modal>

      <Modal
        title="Edit Project"
        open={isEditModalVisible}
        onOk={onEditProject}
        onCancel={onCancelEdit}
        confirmLoading={loading}
      >
        <Input
          placeholder="Project name"
          value={currentProject?.name || ""}
          onChange={onCurrentProjectNameChange}
          onPressEnter={onEditProject}
        />
      </Modal>

      <Modal
        title="Delete Project"
        open={isDeleteModalVisible}
        onOk={onDeleteProject}
        onCancel={onCancelDelete}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete "{currentProject?.name}"?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </>
  );
};

export default ProjectModals;
