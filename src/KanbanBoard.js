import React, { useState, useEffect } from "react";
import axios from "axios";

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        setTickets(response.data.tickets);
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const groupTickets = () => {
    switch (groupBy) {
      case "status":
        return tickets.reduce((groups, ticket) => {
          const group = groups[ticket.status] || [];
          group.push(ticket);
          groups[ticket.status] = group;
          return groups;
        }, {});
      case "user":
        return tickets.reduce((groups, ticket) => {
          const group = groups[ticket.userId] || [];
          group.push(ticket);
          groups[ticket.userId] = group;
          return groups;
        }, {});
      case "priority":
        return tickets.reduce((groups, ticket) => {
          const group = groups[ticket.priority] || [];
          group.push(ticket);
          groups[ticket.priority] = group;
          return groups;
        }, {});
      default:
        return tickets;
    }
  };

  const sortTickets = (groupedTickets) => {
    return groupedTickets.sort((a, b) => {
      if (sortBy === "priority") {
        return b.priority - a.priority;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else {
        return 0;
      }
    });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 1:
        return "assets/Img - High Priority.svg";
      case 2:
        return "assets/Img - Medium Priority.svg";
      case 3:
        return "assets/Img - Low Priority.svg";
      case 4:
        return "assets/No-priority.svg";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Backlog":
        return "assets/Backlog.svg";
      case "In progress":
        return "assets/in-progress.svg";
      case "Todo":
        return "assets/To-do.svg";
      default:
        return "";
    }
  };

  const renderKanbanBoard = () => {
    const groupedTickets = groupTickets();

    return Object.keys(groupedTickets).map((group) => (
      <div key={group} className="kanban-column">
        <div className="kanban-column-header">
          {/* Show number of tickets and group title */}
          <h3>
            {/* Group title */}
            {groupBy === "status" && getStatusIcon(group) && (
              <img
                src={getStatusIcon(group)}
                alt={`Status: ${group}`}
                className="status-icon"
              />
            )}
            <span className="ticket-count">{groupedTickets[group].length}</span>
            {groupBy === "user"
              ? users.find((u) => u.id === group)?.name
              : group}
          </h3>
          {/* Add and More Options icons */}
          <div className="group-icons">
            <img src="assets/add.svg" alt="Add ticket" className="add-icon" />
            <img
              src="assets/3 dot menu.svg"
              alt="More options"
              className="more-options-icon"
            />
          </div>
        </div>

        {/* Render the tickets in the group */}
        {sortTickets(groupedTickets[group]).map((ticket) => (
          <div key={ticket.id} className="kanban-card">
            <h5>{ticket.id}</h5>
            <div className="ticket-header">
              {getStatusIcon(ticket.status) && (
                <img
                  src={getStatusIcon(ticket.status)}
                  alt={`Status: ${ticket.status}`}
                  className="status-icon"
                />
              )}
              <h4>{ticket.title}</h4>
            </div>
            <div className="ticket-info">
              {getPriorityIcon(ticket.priority) && (
                <img
                  src={getPriorityIcon(ticket.priority)}
                  alt={`Priority Level ${ticket.priority}`}
                  className="priority-icon"
                />
              )}
              <p>{ticket.tag}</p>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        className="floating-button"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        <img
          src="assets/Display.svg"
          alt="display-icon"
          className="status-icon"
        />{" "}
        Display
      </button>

      {/* Filter dropdown as a floating window */}
      {showFilters && (
        <div className="filter-dropdown">
          <div>
            <label htmlFor="groupBy">Grouping: </label>
            <select
              id="groupBy"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortBy">Ordering: </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}

      <div className="kanban-board">{renderKanbanBoard()}</div>
    </div>
  );
}

export default KanbanBoard;
