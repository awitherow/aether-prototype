import React, { Component, PropTypes } from 'react'

import FlexibleInput from '../FlexibleInput'
import CheckboxInput from '../CheckboxInput'

import * as noteService from '../../api/notes'

export default class AddNote extends Component {
  state = {
    content: '',
  }

  static propTypes = {
    type: PropTypes.string.isRequired,
  }

  static contextTypes = {
    update: PropTypes.func.isRequired,
    getNotes: PropTypes.func.isRequired,
  }

  resetState = () => {
    for (let thing in this.state) {
      if (thing) {
        delete this.state[thing]
      }
    }
    this.setState(...this.state, {})
  }

  addNote = (e) => {
    e.preventDefault()
    this.context.update('loading', true)
    noteService.add({
      ...this.state,
      type: this.props.type,
    }, () => {
      this.resetState()
      this.context.getNotes()
    })
  }

  render() {
    return (
      <form className="note-list__add-note" onSubmit={this.addNote}>
        <FlexibleInput
          id="note"
          label="Awaiting changes..."
          type="text"
          value={this.state.content}
          onChange={(e) => this.setState({ content: e.target.value })}
          />

          {this.props.type === 'note' ? (
            <CheckboxInput
              id="prio"
              label="Important task?"
              defaultChecked={false}
              onClick={(e) => {
                this.setState({ prio: e.target.checked })
              }}
              />
          ) : null}

        <button>&#43;</button>
      </form>
    )
  }
}
