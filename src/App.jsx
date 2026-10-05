import { useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Complete DBMS assignment",
    description: "",
    scheduledDate: "Today",
    scheduledTime: "7:00 PM",
    priority: "high",
    category: "study",
    status: "pending",
  },
  {
    id: 2,
    title: "Go to gym",
    description: "",
    scheduledDate: "Today",
    scheduledTime: "6:00 PM",
    priority: "medium",
    category: "personal",
    status: "pending",
  },
  {
    id: 3,
    title: "Call project mentor",
    description: "",
    scheduledDate: "Tomorrow",
    scheduledTime: "10:00 AM",
    priority: "medium",
    category: "work",
    status: "pending",
  },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const [screen, setScreen] = useState("home");

  const [selectedTask, setSelectedTask] = useState(null);

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "medium",
    category: "general",
  });

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const startVoiceFlow = () => {
    setScreen("recording");
  };

  const finishRecording = () => {
    setScreen("processing");

    setTimeout(() => {
      setSelectedTask({
        title: "Go to gym",
        description: "Gym session",
        scheduledDate: "Today",
        scheduledTime: "6:00 PM",
        priority: "medium",
        category: "health",
      });

      setScreen("confirmation");
    }, 1800);
  };

  const saveVoiceTask = () => {
    if (!selectedTask) return;

    const newTask = {
      id: Date.now(),
      title: selectedTask.title,
      description: selectedTask.description || "",
      scheduledDate: selectedTask.scheduledDate,
      scheduledTime: selectedTask.scheduledTime,
      priority: selectedTask.priority,
      category: selectedTask.category,
      status: "pending",
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setSelectedTask(null);
    setScreen("home");
  };

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "completed"
                  ? "pending"
                  : "completed",
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const openAddTask = () => {
    setEditingTask(null);

    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      priority: "medium",
      category: "general",
    });

    setShowTaskForm(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description || "",
      date: task.scheduledDate || "",
      time: task.scheduledTime || "",
      priority: task.priority,
      category: task.category,
    });

    setShowTaskForm(true);
  };

  const saveManualTask = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: formData.title,
                description: formData.description,
                scheduledDate: formData.date || "No date",
                scheduledTime: formData.time || "",
                priority: formData.priority,
                category: formData.category,
              }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        scheduledDate: formData.date || "No date",
        scheduledTime: formData.time || "",
        priority: formData.priority,
        category: formData.category,
        status: "pending",
      };

      setTasks((currentTasks) => [
        newTask,
        ...currentTasks,
      ]);
    }

    setShowTaskForm(false);
    setEditingTask(null);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      work: "Work",
      study: "Study",
      personal: "Personal",
      health: "Health",
      finance: "Finance",
      general: "General",
    };

    return labels[category] || "General";
  };

  const getPriorityLabel = (priority) => {
    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1)
    );
  };

  /* =========================
     CONFIRMATION
  ========================= */

  if (screen === "confirmation" && selectedTask) {
    return (
      <div className="page">
        <header className="simple-header">
          <div className="brand">
            <div className="brand-mark">V</div>
            <span>VoiceTasks</span>
          </div>
        </header>

        <main className="confirmation-content">
          <div className="success-icon">✓</div>

          <p className="eyebrow">Task ready</p>

          <h2 className="confirmation-title">
            Does this look right?
          </h2>

          <div className="confirmation-card">
            <div className="confirmation-main">
              <h3>{selectedTask.title}</h3>

              {selectedTask.description && (
                <p className="confirmation-description">
                  {selectedTask.description}
                </p>
              )}
            </div>

            <div className="detail-list">
              <div className="detail-row">
                <span className="detail-icon">◷</span>
                <div>
                  <small>Date & time</small>
                  <strong>
                    {selectedTask.scheduledDate} ·{" "}
                    {selectedTask.scheduledTime}
                  </strong>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">●</span>
                <div>
                  <small>Priority</small>
                  <strong>
                    {getPriorityLabel(
                      selectedTask.priority
                    )}
                  </strong>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-icon">▦</span>
                <div>
                  <small>Category</small>
                  <strong>
                    {getCategoryLabel(
                      selectedTask.category
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              className="secondary-btn"
              onClick={() => {
                setScreen("home");
                setSelectedTask(null);
              }}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={saveVoiceTask}
            >
              Save task
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* =========================
     PROCESSING
  ========================= */

  if (screen === "processing") {
    return (
      <div className="page centered-page">
        <header className="simple-header">
          <div className="brand">
            <div className="brand-mark">V</div>
            <span>VoiceTasks</span>
          </div>
        </header>

        <main className="processing-content">
          <div className="processing-circle">
            <span>V</span>
          </div>

          <p className="eyebrow">
            Understanding your voice
          </p>

          <h2>
            Turning your words
            <br />
            into a task
          </h2>

          <div className="processing-text">
            “Kal shaam 6 baje gym jana hai”
          </div>

          <div className="processing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <p className="muted-text">
            Just a moment...
          </p>
        </main>
      </div>
    );
  }

  /* =========================
     RECORDING
  ========================= */

  if (screen === "recording") {
    return (
      <div className="page">
        <header className="simple-header recording-top">
          <div className="brand">
            <div className="brand-mark">V</div>
            <span>VoiceTasks</span>
          </div>

          <button
            className="icon-button"
            onClick={() => setScreen("home")}
            aria-label="Close recording"
          >
            ×
          </button>
        </header>

        <main className="recording-content">
          <p className="eyebrow">Listening</p>

          <div className="recording-circle">
            <span>●</span>
          </div>

          <div className="voice-wave">
            {Array.from({ length: 9 }).map(
              (_, index) => (
                <span key={index}></span>
              )
            )}
          </div>

          <div className="recording-time">
            00:07
          </div>

          <div className="spoken-box">
            <span className="quote-mark">“</span>

            <p>
              Kal shaam 6 baje gym jana hai
            </p>
          </div>

          <p className="muted-text recording-message">
            Speak naturally. We'll turn your words
            into a task.
          </p>

          <div className="recording-actions">
            <button
              className="secondary-btn"
              onClick={() => setScreen("home")}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={finishRecording}
            >
              Done
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* =========================
     HOME
  ========================= */

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-mark">V</div>
          <h1>VoiceTasks</h1>
        </div>

        <button className="menu-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <main className="main">
        <section className="welcome">
          <p className="greeting">Good evening</p>

          <h2>
            What do you need
            <br />
            to get done?
          </h2>
        </section>

        <button
          className="voice-card"
          onClick={startVoiceFlow}
        >
          <div className="voice-mic">
            <span>●</span>
          </div>

          <div className="voice-content">
            <strong>Tap to speak</strong>

            <span>
              Tell me what you need to do
            </span>

            <small>
              Try “Kal 6 baje gym jana hai”
            </small>
          </div>

          <span className="voice-arrow">→</span>
        </button>

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h3>Today</h3>
              <p>Monday, 5 October</p>
            </div>

            <span>
              {pendingTasks.length}{" "}
              {pendingTasks.length === 1
                ? "task"
                : "tasks"}
            </span>
          </div>

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>

                <h3>No tasks yet</h3>

                <p>
                  Add your first task using your
                  voice or manually.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <article
                  className={`task-card ${
                    task.status === "completed"
                      ? "completed"
                      : ""
                  }`}
                  key={task.id}
                >
                  <button
                    className={`task-check ${
                      task.status === "completed"
                        ? "checked"
                        : ""
                    }`}
                    onClick={() =>
                      toggleTask(task.id)
                    }
                    aria-label={
                      task.status === "completed"
                        ? "Mark as pending"
                        : "Mark as completed"
                    }
                  >
                    {task.status === "completed"
                      ? "✓"
                      : ""}
                  </button>

                  <div className="task-details">
                    <h4>{task.title}</h4>

                    <p>
                      {task.scheduledDate}
                      {task.scheduledTime
                        ? ` · ${task.scheduledTime}`
                        : ""}
                    </p>
                  </div>

                  <span
                    className={`priority-tag ${task.priority}`}
                  >
                    {getPriorityLabel(
                      task.priority
                    )}
                  </span>

                  <div className="task-actions">
                    <button
                      onClick={() =>
                        openEditTask(task)
                      }
                      aria-label="Edit task"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteTask(task.id)
                      }
                      aria-label="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <button
            className="manual-add"
            onClick={openAddTask}
          >
            <span>+</span>
            Add task manually
          </button>
        </section>

        {completedTasks.length > 0 && (
          <p className="completed-summary">
            {completedTasks.length}{" "}
            {completedTasks.length === 1
              ? "task"
              : "tasks"}{" "}
            completed
          </p>
        )}
      </main>

      <nav className="bottom-nav">
        <button className="nav-item active">
          <span>✓</span>
          Tasks
        </button>

        <button
          className="nav-add"
          onClick={startVoiceFlow}
          aria-label="Add task with voice"
        >
          +
        </button>

        <button className="nav-item">
          <span>□</span>
          Calendar
        </button>

        <button className="nav-item">
          <span>⚙</span>
          Settings
        </button>
      </nav>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showTaskForm && (
        <div
          className="modal-overlay"
          onMouseDown={() =>
            setShowTaskForm(false)
          }
        >
          <div
            className="task-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  {editingTask
                    ? "Edit task"
                    : "New task"}
                </p>

                <h2>
                  {editingTask
                    ? "Update your task"
                    : "Add a task"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowTaskForm(false)
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={saveManualTask}>
              <label>
                Task title
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      title: event.target.value,
                    })
                  }
                  autoFocus
                />
              </label>

              <label>
                Description
                <textarea
                  placeholder="Add some details (optional)"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      description:
                        event.target.value,
                    })
                  }
                  rows="3"
                />
              </label>

              <div className="form-row">
                <label>
                  Date
                  <input
                    type="text"
                    placeholder="e.g. Today"
                    value={formData.date}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        date: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Time
                  <input
                    type="text"
                    placeholder="e.g. 7:00 PM"
                    value={formData.time}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        time: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Priority
                  <select
                    value={formData.priority}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        priority:
                          event.target.value,
                      })
                    }
                  >
                    <option value="low">
                      Low
                    </option>
                    <option value="medium">
                      Medium
                    </option>
                    <option value="high">
                      High
                    </option>
                  </select>
                </label>

                <label>
                  Category
                  <select
                    value={formData.category}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        category:
                          event.target.value,
                      })
                    }
                  >
                    <option value="general">
                      General
                    </option>
                    <option value="work">
                      Work
                    </option>
                    <option value="study">
                      Study
                    </option>
                    <option value="personal">
                      Personal
                    </option>
                    <option value="personal">
                      Personal
                    </option>

                    <option value="health">
                      Health
                    </option>

                    <option value="finance">
                      Finance
                    </option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingTask
                    ? "Update task"
                    : "Add task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;