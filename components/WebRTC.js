import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';

var QRCode = require('qrcode.react');

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
        hideOnScroll
        verticalOffset={20}
        position='bottom center'>
          <QRCode value="helloqrcode" size="80"/>
      </Popup>
    );
  }
}

export {WebRTC};