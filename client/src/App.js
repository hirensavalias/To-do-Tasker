import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: '',
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    userId: `user${parseInt((Math.random()*10000000))}`,
  };

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getMessages')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  sendMessage = (message) => {
    message && axios.post('http://localhost:3001/api/sendMessage', { userId: this.state.userId, message });
    this.setState({ message: '' });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <h1>Chat: {this.state.userId}</h1>
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data.message}>
                  <span style={{ color: 'gray' }}> user: </span> {dat.userId} <br />
                  <span style={{ color: 'gray' }}> data: </span>
                  {dat.message}
                </li>
              ))}
        </ul>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ message: e.target.value })}
            placeholder="write a message"
            value={this.state.message}
            style={{ width: '200px' }}
          />
          <button onClick={() => this.sendMessage(this.state.message)}>
            send
          </button>
        </div>
      </div>
    );
  }
}

export default App;