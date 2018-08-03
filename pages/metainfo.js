import React, { Component } from 'react';

export default class MetaInfoPage extends Component {

  static async getInitialProps({ query: { session } }) {
    const initProps = {
      session: session,
    };
    return initProps || {}
  }

  constructor(props) {
    super(props);
  }

  render() {
    return(
        <p>POST request is only approved</p>
    )
  }
}
