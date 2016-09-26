import React, { Component, PropTypes } from 'react';

import Overlay from './views/Overlay';
import NoteList from './views/NoteList';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      view: 'notelist',
    };
  }

  getChildContext() {
    return {
      update: this.update.bind(this),
    };
  }

  update(action, data) {
    let payload;
    switch(action) {
      case 'loading': payload = { loading: data }; break;
    }
    this.setState(payload);
  }

  render() {
    const { loading, view } = this.state;

    return (
      <div className="aether">

        { loading ? <Overlay type="loading" /> : null }

        <header>
          <h1>Aether</h1>
        </header>

        <NoteList />

      </div>
    );
  }
}

App.childContextTypes = {
  update: PropTypes.func,
};
