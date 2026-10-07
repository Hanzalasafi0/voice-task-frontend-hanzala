import { useEffect, useState } from "react";
import "./App.css";

function MicIcon() {
  return (
    <svg
      className="mic-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="3" width="8" height="12" rx="4" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
      <path d="M8 21h8" />
    </svg>
  );
}

const initialTasks = [
  {
    id: 1,
    title: "Complete React assignment",
    description: "Finish the pending React practice questions.",
    scheduledDate: "Today",
    scheduledTime: "10:00 AM",
    priority: "high",
    category: "study",
    status: "pending",
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Milk, bread and fruits.",
    scheduledDate: "Today",
    scheduledTime: "6:00 PM",
    priority: "medium",
    category: "personal",
    status: "pending",
  },
  {
    id: 3,
    title: "Go for a cricket practice",
    description: "Evening cricket practice.",
    scheduledDate: "Tomorrow",
    scheduledTime: "5:00 PM",
    priority: "low",
    category: "health",
    status: "pending",
  },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const [screen, setScreen] = useState("home");
  const [selectedTask, setSelectedTask] = useState(null);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    priority: "medium",
    category: "general",
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    if (
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setIsInstalled(true);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      setShowInstallHelp(true);
      return;
    }

    deferredPrompt.prompt();

    try {
      await deferredPrompt.userChoice;
    } catch {
      // Installation cancelled or unavailable.
    }

    setDeferredPrompt(null);
  };

  const startVoiceFlow = () => {
    setScreen("recording");
  };

  const stopRecording = () => {
    setScreen("processing");

    setTimeout(() => {
      setSelectedTask({
        id: Date.now(),
        title: "Complete my project work",
        description: "Finish the remaining project tasks.",
        scheduledDate: "Today",
        scheduledTime: "8:00 PM",
        priority: "medium",
        category: "work",
        status: "pending",
      });

      setScreen("confirmation");
    }, 1500);
  };

  const saveVoiceTask = () => {
    if (!selectedTask) return;

    setTasks((prev) => [
      {
        ...selectedTask,
        id: Date.now(),
      },
      ...prev,
    ]);

    setSelectedTask(null);
    setScreen("home");
  };

  const cancelVoiceTask = () => {
    setSelectedTask(null);
    setScreen("home");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
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
    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (selectedTask?.id === id) {
      setSelectedTask(null);
    }
  };

  const openAddTask = () => {
    setEditingTask(null);

    setFormData({
      title: "",
      description: "",
      scheduledDate: "",
      scheduledTime: "",
      priority: "medium",
      category: "general",
    });

    setShowTaskForm(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title || "",
      description: task.description || "",
      scheduledDate: task.scheduledDate || "",
      scheduledTime: task.scheduledTime || "",
      priority: task.priority || "medium",
      category: task.category || "general",
    });

    setShowTaskForm(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveManualTask = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...formData,
              }
            : task
        )
      );
    } else {
      setTasks((prev) => [
        {
          id: Date.now(),
          ...formData,
          status: "pending",
        },
        ...prev,
      ]);
    }

    setShowTaskForm(false);
    setEditingTask(null);
  };

  const formatCategory = (category) => {
    if (!category) return "General";

    return (
      category.charAt(0).toUpperCase() +
      category.slice(1)
    );
  };

  const getPriorityLabel = (priority) => {
    if (priority === "high") return "High";
    if (priority === "low") return "Low";
    return "Medium";
  };

  const getTaskCount = () => {
    return tasks.filter((task) => task.status !== "completed").length;
  };

  // RECORDING SCREEN
  if (screen === "recording") {
    return (
      <div className="app">
        <header className="simple-header">
          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            ←
          </button>

          <span>Voice Task</span>

          <div className="header-spacer" />
        </header>

        <main className="recording-content">
          <p className="eyebrow">VOICE INPUT</p>

          <h2>Tell me what you need to do</h2>

          <p className="screen-description">
            Speak naturally. VoiceTasks will turn your
            words into a task.
          </p>

          <div className="recording-visual">
            <div className="recording-circle">
              <MicIcon />
            </div>
          </div>

          <p className="recording-status">
            Listening...
          </p>

          <div className="spoken-box">
            <span>You can say something like</span>
            <p>
              "Remind me to complete my project
              tomorrow at 5 PM."
            </p>
          </div>

          <div className="recording-actions">
            <button
              className="secondary-btn"
              onClick={() => setScreen("home")}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={stopRecording}
            >
              Done
            </button>
          </div>
        </main>
      </div>
    );
  }

  // PROCESSING SCREEN
  if (screen === "processing") {
    return (
      <div className="app">
        <header className="simple-header">
          <span>Voice Task</span>
        </header>

        <main className="processing-content">
          <div className="processing-loader">
            <div className="loader-dot" />
            <div className="loader-dot" />
            <div className="loader-dot" />
          </div>

          <p className="eyebrow">PROCESSING</p>

          <h2>Creating your task...</h2>

          <p className="screen-description">
            We are understanding your voice input and
            preparing the task details.
          </p>
        </main>
      </div>
    );
  }

  // CONFIRMATION SCREEN
  if (screen === "confirmation") {
    return (
      <div className="app">
        <header className="simple-header">
          <button
            className="back-button"
            onClick={cancelVoiceTask}
          >
            ←
          </button>

          <span>Confirm Task</span>

          <div className="header-spacer" />
        </header>

        <main className="confirmation-content">
          <p className="eyebrow">TASK READY</p>

          <h2>Does this look right?</h2>

          {selectedTask && (
            <div className="confirmation-card">
              <div className="confirmation-top">
                <span className="category-label">
                  {formatCategory(selectedTask.category)}
                </span>

                <span
                  className={`priority-tag priority-${selectedTask.priority}`}
                >
                  {getPriorityLabel(
                    selectedTask.priority
                  )}
                </span>
              </div>

              <h3>{selectedTask.title}</h3>

              <p>{selectedTask.description}</p>

              <div className="confirmation-meta">
                <span>
                  📅 {selectedTask.scheduledDate}
                </span>

                <span>
                  🕐 {selectedTask.scheduledTime}
                </span>
              </div>
            </div>
          )}

          <div className="confirmation-actions">
            <button
              className="secondary-btn"
              onClick={cancelVoiceTask}
            >
              Cancel
            </button>

            <button
              className="primary-btn"
              onClick={saveVoiceTask}
            >
              Save Task
            </button>
          </div>
        </main>
      </div>
    );
  }

  // HOME SCREEN
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-mark">V</div>
          <h1>VoiceTasks</h1>
        </div>

        <div className="header-actions">
          {!isInstalled && (
            <button
              className="install-button"
              onClick={handleInstallApp}
            >
              <span className="install-icon">↓</span>
              <span>Install App</span>
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <section className="welcome">
          <p className="eyebrow">YOUR DAY</p>

          <h2>
            What do you want
            <br />
            to get done?
          </h2>

          <p className="task-count">
            {getTaskCount()} tasks remaining
          </p>
        </section>

        {/* TAP TO SPEAK CARD */}
        <section
          className="voice-card"
          onClick={startVoiceFlow}
        >
          <div className="voice-mic">
            <MicIcon />
          </div>

          <div className="voice-content">
            <strong>Tap to speak</strong>

            <span>
              Tell me what you need to remember
            </span>

            <small>
              Voice input • Multiple languages supported
            </small>
          </div>

          <div className="voice-arrow">→</div>
        </section>

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TASKS</p>
              <h3>Today</h3>
            </div>

            <button
              className="text-button"
              onClick={openAddTask}
            >
              + Add task
            </button>
          </div>

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>

                <h4>No tasks yet</h4>

                <p>
                  Add your first task using voice or
                  manually.
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
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.status === "completed"
                        ? "Mark task as pending"
                        : "Mark task as completed"
                    }
                  >
                    {task.status === "completed"
                      ? "✓"
                      : ""}
                  </button>

                  <div className="task-details">
                    <h4>{task.title}</h4>

                    {task.description && (
                      <p>{task.description}</p>
                    )}

                    <div className="task-meta">
                      <span>
                        {task.scheduledDate}
                      </span>

                      <span>
                        {task.scheduledTime}
                      </span>

                      <span className="category-tag">
                        {formatCategory(task.category)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`priority-tag priority-${task.priority}`}
                  >
                    {getPriorityLabel(task.priority)}
                  </span>

                  <div className="task-actions">
                    <button
                      onClick={() => openEditTask(task)}
                      aria-label="Edit task"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      aria-label="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* FOOTER NAVIGATION */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <span>✓</span>
          Tasks
        </button>

        <button className="nav-item calendar-nav">
          <span>□</span>
          Calendar
        </button>

        {/* ONLY FOOTER MIC */}
        <button
          className="nav-add"
          onClick={startVoiceFlow}
          aria-label="Add task with voice"
        >
          <MicIcon />
        </button>

        <button className="nav-item settings-nav">
          <span>⚙</span>
          Settings
        </button>
      </nav>

      {/* INSTALL HELP MODAL */}
      {showInstallHelp && (
        <div
          className="modal-overlay install-overlay"
          onMouseDown={() =>
            setShowInstallHelp(false)
          }
        >
          <div
            className="install-help-card"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setShowInstallHelp(false)
              }
            >
              ×
            </button>

            <div className="install-help-icon">
              ↓
            </div>

            <p className="eyebrow">
              INSTALL VOICETASKS
            </p>

            <h2>Add VoiceTasks to your device</h2>

            <p>
              If automatic installation is not
              available, open your browser menu and
              choose <strong>Install App</strong> or
              <strong> Add to Home Screen</strong>.
            </p>

            <button
              className="primary-btn install-help-button"
              onClick={() =>
                setShowInstallHelp(false)
              }
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT TASK MODAL */}
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
                    ? "EDIT TASK"
                    : "NEW TASK"}
                </p>

                <h2>
                  {editingTask
                    ? "Edit your task"
                    : "Create a task"}
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
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="What needs to be done?"
                  required
                />
              </label>

              <label>
                Description

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Add some details..."
                  rows="3"
                />
              </label>

              <div className="form-row">
                <label>
                  Date

                  <input
                    type="text"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleFormChange}
                    placeholder="Today"
                  />
                </label>

                <label>
                  Time

                  <input
                    type="text"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleFormChange}
                    placeholder="5:00 PM"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Priority

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
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
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    >
                    <option value="work">
                      Work
                    </option>

                    <option value="study">
                      Study
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

                    <option value="general">
                      General
                    </option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowTaskForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingTask
                    ? "Save Changes"
                    : "Add Task"}
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