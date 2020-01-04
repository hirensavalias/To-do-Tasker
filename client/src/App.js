import React, { Component } from 'react';
import axios from 'axios';
import { TaskList } from './List';

class App extends Component {
  state = {
    username: '',
    auth: true,
  };

  login = (username) => {
    axios.post('http://localhost:3001/api/login', { username: this.state.username }).then(res => {
      this.setState({ auth: true });
    });
  }

  render() {
    const { auth } = this.state;
    return (
      <div>
        {!auth && <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ username: e.target.value })}
            placeholder="enter username"
            value={this.state.username}
            style={{ width: '200px' }}
          />
          <button onClick={() => this.login(this.state.username)}>
            login
          </button>
        </div>}
        {auth && <TaskList/>}
      </div>
    );
  }
}

export default App;