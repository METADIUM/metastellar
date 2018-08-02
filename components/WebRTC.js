import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';

class WebRTC extends Component {

  constructor() {
    super();
  }

  componentDidMount() {

  }

  onOpenSetInfo() {
    console.log('opened')
  }

  onCloseSetInfo() {
    console.log('closed')
  }

  render() {
    return (
      <Popup trigger={<Button>Set Info</Button>}
        on='click'
        onOpen={() => this.onOpenSetInfo()}
        onClose={() => this.onCloseSetInfo()}
        hideOnScroll>
        test
      </Popup>
    );
  }
}

export {WebRTC};