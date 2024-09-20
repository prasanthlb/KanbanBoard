import axios from 'axios';
import { useEffect, useState } from 'react';

function KanbanBoard() {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState('status'); // default grouping by status
  const [sortBy, setSortBy] = useState('priority'); // default sorting by priority
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        setTickets(response.data.tickets); // assuming the tickets are in response.data.tickets
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  // Save view state in local storage
  useEffect(() => {
    const savedGroupBy = localStorage.getItem('groupBy');
    const savedSortBy = localStorage.getItem('sortBy');
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy', sortBy);
  }, [groupBy, sortBy]);

  const groupTickets = () => {
    switch (groupBy) {
      case 'status':
        return tickets.reduce((groups, ticket) => {
          const group = groups[ticket.status] || [];
          group.push(ticket);
          groups[ticket.status] = group;
          return groups;
        }, {});
      case 'user':
        return tickets.reduce((groups, ticket) => {
          const group = groups[ticket.user] || [];
          group.push(ticket);
          groups[ticket.user] = group;
          return groups;
        }, {});
      case 'priority':
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
    if (sortBy === 'priority') {
      return groupedTickets.sort((a, b) => b.priority - a.priority);
    } else if (sortBy === 'title') {
      return groupedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }
  };

  const renderKanbanBoard = () => {
    const groupedTickets = groupTickets();
  
    return Object.keys(groupedTickets).map((group) => (
      <div key={group} className="kanban-column">
        <h3>{group}</h3>
        {sortTickets(groupedTickets[group]).map((ticket) => (
          <div key={ticket.id} className="kanban-card">
            <h4>{ticket.title}</h4>
            <p>{ticket.description}</p>
            <p>Priority: {ticket.priority}</p>
          </div>
        ))}
      </div>
    ));
  };
  return (
    <div>
      {loading ? <p>Loading tickets...</p> : null}
      
      <div>
        <button onClick={() => setGroupBy('status')}>Group by Status</button>
        <button onClick={() => setGroupBy('user')}>Group by User</button>
        <button onClick={() => setGroupBy('priority')}>Group by Priority</button>
      </div>
  
      <div>
        <button onClick={() => setSortBy('priority')}>Sort by Priority</button>
        <button onClick={() => setSortBy('title')}>Sort by Title</button>
      </div>
  
      <div className="kanban-board">
        {renderKanbanBoard()}
      </div>
    </div>
  );
    
}
