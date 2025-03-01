const TaskHeader = ({ projectName }) => {
    return (
      <div
        style={{
          marginBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "10px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "500", margin: 0 }}>
          {projectName || "Inbox"}
        </h2>
      </div>
    );
  };
  
  export default TaskHeader;
  