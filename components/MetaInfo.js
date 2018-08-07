import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';
import SimpleWebRTC from 'simplewebrtc';

var QRCode = require('qrcode.react');
const NodeRSA = require('node-rsa');
var crypto = require('crypto');

class MetaInfo extends Component {

  constructor() {
    super();
    this.state = {
      session: 'undefined',
    };
  }

  componentDidMount() {
    const key = new NodeRSA({b: 2048});
    var pubkey = key.exportKey('public')
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s+|\n\r|\n|\r$/gm, '')
    
    this.baseRequestUri = "meta://information?request=name&request=email&service=https%3A%2F%2Fmetastellar.metadium.com&callback=http%3A%2F%2F13.125.251.87%2F3000/metainfo?session=";
    this.pubkey = encodeURIComponent(pubkey);

    this.webrtc = new SimpleWebRTC({
      autoRequestMedia: false,
    });
    this.webrtc.on('connectionReady', (sessionId) => {
      this.setState({session: sessionId});
      this.requestUri = this.baseRequestUri + sessionId + "&public_key=" + this.pubkey;
      console.log('req uri', this.requestUri);
    });

    //crypto.privateDecrypt(PRIVKEY, Buffer.from(encmsg, 'base64'));
    //console.log(crypto.publicEncrypt(key.exportKey('public'), Buffer('abc')).toString('base64'));
  }

  onOpenSetInfo() {
    this.webrtc.createRoom(this.state.session, (err, name) => {
      console.log(`created chatroom`, name, err);
    });
    this.webrtc.on('createdPeer', (peer) => {
      console.log('createdPeer', peer);
    });
    this.webrtc.connection.on('message', (data) => {
      if (data.type === 'pinfo') {
        const msg = data.payload;
        console.log('msg', msg);
      }
    });
  }

  onCloseSetInfo() {
    this.webrtc.leaveRoom();
  }

  render() {
    return (
      <div>
      {this.state.session != 'undefined' &&
      <Popup trigger={<Button>Set Info</Button>}
        on='click'
        onOpen={() => this.onOpenSetInfo()}
        onClose={() => this.onCloseSetInfo()}
        verticalOffset={20}
        position='bottom right'
        style={{padding: '2em'}}>
          <QRCode value={this.requestUri} size="128"/>
      </Popup>}
      </div>
    );
  }
}

export {MetaInfo};