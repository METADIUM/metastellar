import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';
import SimpleWebRTC from 'simplewebrtc';

var QRCode = require('qrcode.react');
const NodeRSA = require('node-rsa');
/*
var crypto = require('crypto');
crypto.privateDecrypt(PRIVKEY, Buffer.from(encmsg, 'base64'));
*/

class MetaInfo extends Component {

  constructor() {
    super()
  }

  componentDidMount() {
    
    const key = new NodeRSA({b: 2048});
    var pubkey = key.exportKey('public')
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s+|\n\r|\n|\r$/gm, '')
    
    this.baseRequestUri = "meta://information?request=name&request=email&service=https%3A%2F%2Fmetastellar.metadium.com&callback=http%3A%2F%2F13.125.251.87%2F3000/conn?p=";
    this.requestUri = this.baseRequestUri + 1 + "&public_key=" + encodeURIComponent(pubkey);
    console.log(this.requestUri)
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
        position='bottom right'
        style={{padding: '2em'}}>
          <QRCode value={this.requestUri} size="128"/>
          <div></div>
      </Popup>
    );
  }
}

export {MetaInfo};