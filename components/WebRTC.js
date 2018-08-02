import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';

var QRCode = require('qrcode.react');

class WebRTC extends Component {

  constructor() {
    super();
    this.state = {
      baseRequestUri: 'meta://information?request=name&request=email&service=https%3A%2F%2Fmetastellar.metadium.com&callback=http%3A%2F%2F13.125.251.87%2F3000/conn?p=',
      requestUri: 'meta://information?request=name&request=email&service=https%3A%2F%2Fmetastellar.metadium.com&callback=http%3A%2F%2F13.125.251.87%2F3000/conn?p=1'
    }
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
        verticalOffset={20}
        position='bottom center'>
          <QRCode value={this.state.requestUri} size="80"/>
      </Popup>
    );
  }
}

export {WebRTC};