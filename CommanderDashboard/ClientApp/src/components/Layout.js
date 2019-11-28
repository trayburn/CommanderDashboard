import React, { Component } from 'react';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div className="fill">
			{this.props.children}
      </div>
    );
  }
}
