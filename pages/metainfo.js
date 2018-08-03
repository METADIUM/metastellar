import React, { Component } from 'react';

export default class MetaInfoPage extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
        <p>MetaInfo {this.props.session}</p>
    )
  }
}
