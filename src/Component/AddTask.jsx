import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { createTask, fetchProjects } from "../Utility/api";

const AddTask = ({ visible, onCancel, onTaskAdded }) => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        message.error("Failed to load projects");
      }
    };

    if (visible) {
      loadProjects();
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const projectId =
        values.project_id === "inbox" ? null : values.project_id;
      const newTask = await createTask(
        projectId,
        values.content,
        values.description || ""
      );

      setLoading(false);

      if (newTask) {
        message.success("Task created successfully");
        form.resetFields();
        if (onTaskAdded) onTaskAdded(newTask);
        onCancel();
      } else {
        message.error("Failed to create task");
      }
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  return (
    <Modal
      title="Add Task"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          style={{
            backgroundColor: "#db4c3f",
            borderColor: "#db4c3f",
          }}
        >
          Add Task
        </Button>,
      ]}
      styles={{ padding: "16px" }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ project_id: "inbox" }}
      >
        <Form.Item
          name="content"
          label="Task Name"
          rules={[{ required: true, message: "Please enter a task name" }]}
        >
          <Input
            placeholder="What needs to be done?"
            style={{ borderColor: "#e8e8e8" }}
          />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea
            placeholder="Add details..."
            rows={3}
            style={{ borderColor: "#e8e8e8" }}
          />
        </Form.Item>

        <Form.Item name="project_id" label="Project">
          <Select
            placeholder="Select a project"
            style={{ borderColor: "#e8e8e8" }}
            dropdownStyle={{ borderColor: "#e8e8e8" }}
          >
            <Select.Option value="inbox">Inbox</Select.Option>
            {projects.map((project) => (
              <Select.Option key={project.id} value={project.id}>
                {project.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTask;
