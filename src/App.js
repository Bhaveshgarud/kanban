import React, { useState, useEffect } from 'react';
import './App.css';

const API_ENDPOINT = 'https://api.quicksell.co/v1/internal/frontend-assignment';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTickets(data.tickets);
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGroupingChange = (value) => {
    setGrouping(value);
    setIsDropdownOpen(false);
  };

  const handleOrderingChange = (value) => {
    setOrdering(value);
    setIsDropdownOpen(false);
  };

  const groupTickets = () => {
    if (grouping === 'status') {
      return tickets.reduce((acc, ticket) => {
        (acc[ticket.status] = acc[ticket.status] || []).push(ticket);
        return acc;
      }, {});
    } else if (grouping === 'user') {
      return tickets.reduce((acc, ticket) => {
        const user = users.find(u => u.id === ticket.userId);
        (acc[user.name] = acc[user.name] || []).push(ticket);
        return acc;
      }, {});
    } else if (grouping === 'priority') {
      const priorityNames = ['No priority', 'Low', 'Medium', 'High', 'Urgent'];
      return tickets.reduce((acc, ticket) => {
        (acc[priorityNames[ticket.priority]] = acc[priorityNames[ticket.priority]] || []).push(ticket);
        return acc;
      }, {});
    }
  };

  const sortTickets = (ticketGroup) => {
    return Object.keys(ticketGroup).reduce((acc, key) => {
      acc[key] = ticketGroup[key].sort((a, b) => {
        if (ordering === 'priority') {
          return b.priority - a.priority;
        } else if (ordering === 'title') {
          return a.title.localeCompare(b.title);
        }
      });
      return acc;
    }, {});
  };

  const groupedAndSortedTickets = sortTickets(groupTickets());

  return (
    <div className="app">
      <div className="header">
        <div className="dropdown-container">
          <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span className="icon">☰</span> Display
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <span>Grouping</span>
                <select value={grouping} onChange={(e) => handleGroupingChange(e.target.value)}>
                  <option value="status">Status</option>
                  <option value="user">User</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
              <div className="dropdown-item">
                <span>Ordering</span>
                <select value={ordering} onChange={(e) => handleOrderingChange(e.target.value)}>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="board">
        {Object.entries(groupedAndSortedTickets).map(([group, tickets]) => (
          <div key={group} className="column">
            <h2 className="column-header">
              <span className="column-title">{group}</span>
              <span className="ticket-count">{tickets.length}</span>
            </h2>
            {tickets.map(ticket => (
              <div key={ticket.id} className="card">
                <div className="card-header">
                  <span className="ticket-id">{ticket.id}</span>
                  <span className="user-avatar">{users.find(u => u.id === ticket.userId)?.name[0]}</span>
                </div>
                <h3 className="ticket-title">{ticket.title}</h3>
                <div className="card-footer">
                  <span className="priority-indicator">
                    {/* Add priority icon here */}
                  </span>
                  <span className="tag">{ticket.tag[0]}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;