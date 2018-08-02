import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';

class WebRTC extends Component {

  constructor() {
    super();
  }

  componentDidMount() {

  }

  onClickSetInfo() {
    console.log('clicked')
  }

  render() {
    return (
        <Button onClick={() => this.onClickSetInfo()}>Set Info</Button>
    );
  }
}

export {WebRTC};