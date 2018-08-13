import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';
import SimpleWebRTC from 'simplewebrtc';

var QRCode = require('qrcode.react');
const NodeRSA = require('node-rsa');
var crypto = require('crypto');

class Login extends Component {

  constructor() {
    super();
    this.state = {
      session: 'undefined',
      name: '',
      sns: '',
    };
  }

  componentDidMount() {
    const key = new NodeRSA({b: 2048});
    this.pubkey = key.exportKey('public')
    this.privkey = key.exportKey('private')
    var pubkey = key.exportKey('public')
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s+|\n\r|\n|\r$/gm, '')
    
    this.baseRequestUri = "meta://information?request=name&request=email&service=https%3A%2F%2Fmetastellar.metadium.com&callback=http%3A%2F%2F13.125.251.87%2F3000/metainfo?session=";
    pubkey = encodeURIComponent(pubkey);

    this.webrtc = new SimpleWebRTC({
      autoRequestMedia: false,
    });
    this.webrtc.on('connectionReady', (sessionId) => {
      this.requestUri = this.baseRequestUri + sessionId + "&public_key=" + pubkey;
      this.setState({session: sessionId});
    });

    // test
    var name = crypto.publicEncrypt(this.pubkey, Buffer('abc')).toString('base64');
    var sns = crypto.publicEncrypt(this.pubkey, Buffer('a@b.c')).toString('base64');
    console.log(name)
    console.log(sns)
    /*
    var rname = crypto.privateDecrypt(this.privkey, Buffer.from(name, 'base64')).toString();
    var rsns = crypto.privateDecrypt(this.privkey, Buffer.from(sns, 'base64')).toString();
    console.log(rname)
    console.log(rsns)
    */
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
        console.log(msg)
        var name = crypto.privateDecrypt(this.privkey, Buffer.from(msg.name, 'base64')).toString();
        var sns = crypto.privateDecrypt(this.privkey, Buffer.from(msg.sns, 'base64')).toString();
        console.log(name, sns)
        this.setState({name: name, sns: sns});
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
      <Popup trigger={<Button>Login</Button>}
        on='click'
        onOpen={() => this.onOpenSetInfo()}
        onClose={() => this.onCloseSetInfo()}
        verticalOffset={20}
        position='bottom right'
        style={{padding: '2em'}}>
          <QRCode value={this.requestUri} size="128"/>
          {this.state.name} {this.state.sns}
      </Popup>}
      </div>
    );
  }
}

export {Login};