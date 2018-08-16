import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';
import SimpleWebRTC from 'simplewebrtc';

var QRCode = require('qrcode.react');
const NodeRSA = require('node-rsa');
var crypto = require('crypto');
var https = require('https');

class Login extends Component {

  static async getInitialProps({ query: { setInfo } }) {
    const initProps = {
      setInfo: setInfo,
    }
    return initProps || {}
  }

  constructor() {
    super();
    this.state = {
      session: this.makeSessionID(),
    };
  }

  makeSessionID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  componentDidMount() {
    const key = new NodeRSA({b: 2048});
    this.pubkey = key.exportKey('public')
    this.privkey = key.exportKey('private')
    var pubkey = key.exportKey('public')
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s+|\n\r|\n|\r$/gm, '');
    pubkey = encodeURIComponent(pubkey);
    
    this.baseRequestUri = "meta://information?request=name&request=email&service=https%3A%2F%2Fmetastellar.metadium.com&callback=http%3A%2F%2F13.125.251.87%3A3000/metainfo?session=";
    this.requestUri = this.baseRequestUri + this.state.session + "&public_key=" + pubkey;

    /*
    this.webrtc = new SimpleWebRTC({
      autoRequestMedia: false,
    });
    this.webrtc.on('connectionReady', (sessionId) => {
      this.requestUri = this.baseRequestUri + sessionId + "&public_key=" + pubkey;
      this.setState({session: sessionId});
    });
    */

    // test
    /*
    var name = crypto.publicEncrypt(this.pubkey, Buffer('abc')).toString('base64');
    var sns = crypto.publicEncrypt(this.pubkey, Buffer('a@b.c')).toString('base64');
    console.log(name)
    console.log(sns)
    var rname = crypto.privateDecrypt(this.privkey, Buffer.from(name, 'base64')).toString();
    var rsns = crypto.privateDecrypt(this.privkey, Buffer.from(sns, 'base64')).toString();
    console.log(rname)
    console.log(rsns)
    */
  }

  checkResponse() {
    https.request({
      host: '2g5198x91e.execute-api.ap-northeast-2.amazonaws.com',
      path: '/test?key=' + this.state.session,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (data !== '') {
          clearInterval(this.interval);
          var ret = decodeURIComponent(data).split(',');
          var secret = crypto.privateDecrypt(this.privkey, Buffer.from(ret[0], 'base64')).toString();
          console.log('secret', secret);
          var decipher = crypto.createDecipher('aes-256-ecb', secret);		
          chunks = []
          chunks.push(decipher.update(Buffer.from(ret[1], 'base64').toString('binary')));
          chunks.push(decipher.final('binary'));
          var name = Buffer.from(chunks.join(''), 'binary').toString('utf-8');
          chunks = []
          chunks.push(decipher.update(Buffer.from(ret[2], 'base64').toString('binary')));
          chunks.push(decipher.final('binary'));
          var sns = Buffer.from(chunks.join(''), 'binary').toString('utf-8');
          this.props.setInfo(name, sns);
        }
      });
    }).on('error', (err) => {
      console.log('error', err);
    }).end();
  }

  onOpenSetInfo() {
    /*
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
    */

    this.interval = setInterval(() => {
      this.checkResponse();
    }, 2000);
  }

  onCloseSetInfo() {
    //this.webrtc.leaveRoom();
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
      {this.state.session != undefined && this.state.session != 'undefined' &&
      <Popup trigger={<Button>Login</Button>}
        on='click'
        onOpen={() => this.onOpenSetInfo()}
        onClose={() => this.onCloseSetInfo()}
        verticalOffset={20}
        position='bottom right'
        style={{padding: '2em'}}>
          <QRCode value={this.requestUri} size='128'/>
      </Popup>}
      </div>
    );
  }
}

export {Login};