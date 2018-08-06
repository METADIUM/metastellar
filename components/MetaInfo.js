import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';

var QRCode = require('qrcode.react');
var keypair = require('keypair');
var crypto = require('crypto');

class MetaInfo extends Component {

  constructor() {
    super()
  }

  componentDidMount() {
    var pair = keypair()
    var pubkey = pair.public
      .replace('-----BEGIN RSA PUBLIC KEY-----', '')
      .replace('-----END RSA PUBLIC KEY-----', '')
      .replace(/\s+|\n\r|\n|\r$/gm, '')
    this.baseRequestUri = "meta://information?request=name&request=email&service=https%3A%2F%2Fmetastellar.metadium.com&callback=http%3A%2F%2F13.125.251.87%2F3000/conn?p=";
    this.requestUri = this.baseRequestUri + 1 + "&public_key=" + window.btoa(pubkey);
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
          <QRCode value={this.requestUri} size="80"/>
      </Popup>
    );
  }
}

export {MetaInfo};