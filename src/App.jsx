import { useState, useCallback } from "react";
import { Layout } from "antd";
import Menubar from "./Component/Menubar";
import TaskList from "./Component/TaskList";

const { Content } = Layout;

function App() {
  const [selectedProject, setSelectedProject] = useState({
    id: null,
    name: "Inbox",
  });

  const [taskRefreshCounter, setTaskRefreshCounter] = useState(0);

  const refreshTasks = useCallback(() => {
    setTaskRefreshCounter((prev) => prev + 1);
  }, []);

  const handleTaskAdded = useCallback(
    (newTask) => {
      refreshTasks();
    },
    [refreshTasks]
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Menubar
        onProjectSelect={setSelectedProject}
        onTaskAdded={handleTaskAdded}
      />
      <Content style={{ padding: "0 24px", minHeight: 280 }}>
        <TaskList
          selectedProject={selectedProject}
          refreshKey={taskRefreshCounter}
        />
      </Content>
    </Layout>
  );
}

export default App;
