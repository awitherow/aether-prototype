import React, { Component } from 'react';
import { FormattedTime } from 'react-intl';

import Overlay from './components/Overlay';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      entryInput: "",
      edit: {
        on: false,
        content: {},
        edits: {},
      },
    };
  }

  componentDidMount() {
    this.fetchEntries();
  }

  fetchEntries() {
    fetch('/api/entries')
      .then(r => r.json())
      .then(res => {
        this.setState({
          entries: res.data,
          loading: false,
        });
      })
      .catch(e => console.log(e));
  }

  captureEntry(e) {
    this.setState({ entryInput: e.target.value });
  }

  addEntry() {
    this.setState({ loading: true });
    const { entryInput } = this.state;

    fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: entryInput,
        prio: 2,
      }),
    }).then(() => this.fetchEntries());

    this.setState({ entryInput: "" });
  }

  deleteEntry(id) {
    this.setState({ loading: true });
    fetch(`/api/entries/${id}`, {
      method: 'DELETE',
    }).then(() => this.fetchEntries());
  }

  render() {
    const { entries, loading, entryInput, edit } = this.state;
    if (loading) return <Overlay type="spinner" />;

    if (edit.on) {
      let view = 'no-view-found';

      if (edit.content.type === 'entry') {
        let entry = entries.filter(entry => entry.id === edit.content.id)[0];
        if (!entry) return;

        const { archived, content, created, id, prio } = entry;
        view = (
          <form>
            <h1>Edit entry (#{id})</h1>
            <p>
            Prio:
            <select value={prio}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            </p>
            <fieldset>
              <input
                id="archived"
                name="archived"
                type="checkbox"
                checked={archived ? "checked" : null}
                />
              <label htmlFor="archived">Archived</label>
            </fieldset>
            <FormattedTime value={created} />
            <textarea value={content}></textarea>
            <button>Submit</button>
          </form>
        );
      }

      if (view === 'no-view-found') return <Overlay type="error" />;

      return (
        <div className="editor">
          {view}
        </div>
      );
    }

    return (
      <div className="aether">

        <header>
          <h1>Aether</h1>
        </header>

        <div className="main">
          <h2>Entries <span>({entries.length})</span></h2>
          <ul className="entries-list">
            {entries.map(entry => {
              let { id, content } = entry;
              return (
                <li key={id}>
                  <button onClick={this.deleteEntry.bind(this, id)}>x</button>
                  <span
                    className="content"
                    onClick={() => this.setState({ edit: {
                      on: true,
                      content: {
                        type: 'entry',
                        id,
                      },
                    }})}
                    >{content}</span>
                </li>
              );
            })}
          </ul>
          <div className="add-entry">
            <label htmlFor="entry">Awaiting Entry... </label>
            <input
              id="entry"
              type="text"
              value={entryInput}
              onChange={this.captureEntry.bind(this)}
              />
            <button onClick={this.addEntry.bind(this)}>+</button>
          </div>
        </div>

      </div>
    );
  }
}
