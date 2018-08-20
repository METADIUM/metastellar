import React, {Component} from 'react';
import {Button, Popup} from 'semantic-ui-react';
import SimpleWebRTC from 'simplewebrtc';

var QRCode = require('qrcode.react');
const NodeRSA = require('node-rsa');
var crypto = require('crypto');
var https = require('https');
var constants = require('constants');

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
    console.log('session', text)    
    return text;
  }

  componentDidMount() {
    const key = new NodeRSA({b: 2048});
    this.pubkey = key.exportKey('public')
    this.privkey = key.exportKey('private')
    
    /* test */
    /*
    this.pubkey = '-----BEGIN PUBLIC KEY-----' + '\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqfyf289+iHxMouSXCGo0' + '\n' +
    'dUObSnGjFxFUfPwWBHIJzViMRXcbnFruA4gerp8Ha/GXTa3e5XUzWnR+E30WnpEO' + '\n' +
    'GIuyyU5z1XqbBsn+LSOoM/TnLGKUKwsot8aUyYMxRjJUGhbwFFQJj60HP58TTrVO' + '\n' +
    'S4ZzMfecwUDfOT1t+YR1jOfSv+Wbo6BhNdqiPb0kym/ayxis32DU1SJpIdFf7wwb' + '\n' +
    'R18nYaFG5IGkkQZ4i/61TYOJgv673q9RgY5YTEOQJT8IylPxt5HDle+/sAUVR0Hj' + '\n' +
    'QUCCK5rCDJLgbc5aquLC2yvE1C7bgm2/4kqZApAm4gdnbqso1P+W5DwRzWgeec+W' + '\n' +
    'wwIDAQAB' + '\n' +
    '-----END PUBLIC KEY-----';
    this.privkey = '-----BEGIN RSA PRIVATE KEY-----' + '\n' +
    'MIIEpAIBAAKCAQEAqfyf289+iHxMouSXCGo0dUObSnGjFxFUfPwWBHIJzViMRXcb' + '\n' +
    'nFruA4gerp8Ha/GXTa3e5XUzWnR+E30WnpEOGIuyyU5z1XqbBsn+LSOoM/TnLGKU' + '\n' +
    'Kwsot8aUyYMxRjJUGhbwFFQJj60HP58TTrVOS4ZzMfecwUDfOT1t+YR1jOfSv+Wb' + '\n' +
    'o6BhNdqiPb0kym/ayxis32DU1SJpIdFf7wwbR18nYaFG5IGkkQZ4i/61TYOJgv67' + '\n' +
    '3q9RgY5YTEOQJT8IylPxt5HDle+/sAUVR0HjQUCCK5rCDJLgbc5aquLC2yvE1C7b' + '\n' +
    'gm2/4kqZApAm4gdnbqso1P+W5DwRzWgeec+WwwIDAQABAoIBAF8xfuBc4bJTUaOD' + '\n' +
    'OeVXfIsS0jstSjTX2qWnkjjpF/4sEVmxav/zmAjYSL5nhoN3ptC0hvee26RTSmtl' + '\n' +
    'iK5B80/ho7zCN3IcmAaERdhHeKGoC3G6vtkgBaxtA9OZqZVzB9AYelgX+8a/EikZ' + '\n' +
    'z3krZW48G/Smgt1ik999PEIYYLAIE9RqIfcoCRXEpBfaf77bsWslDk9cGgorO08b' + '\n' +
    'wYDvGhZdlI7jFrqQds2BoqmpWpm7JaFziiBWYVA3IR2Guh/p7bCuHUOdzlbntS+m' + '\n' +
    'y46rt+oHEDVM0Os/N5yIWkBXIVsGOeuQxq9xkMLLX+lTniRRlmCrJNEhyh91bL5K' + '\n' +
    'lAPmEIECgYEA6QpBsw7EczpFoUvqOX7QKpxXoYXxsrNhzocwiTtKwH2Z5Y7Zc5Fo' + '\n' +
    'IUBI3lHC9t9gegQcV1wd0lOoFZHvbiRS14L4HCEIipf8/o0xEoYNzPF2t6d4RrZg' + '\n' +
    'uOqZPo5HAJR8gM+AAoz8SOOpTeM54HmtHwsZJgH++YHPjaMsz+FYxwMCgYEAurwJ' + '\n' +
    'cCpDRE2kJ6zJDUiSkNY6N0GBic+E0L5rA1pnlSIYDB4L30E4fNXnHHfMEVS2u1dz' + '\n' +
    'rUUlvO8wRCHdKi5fi6rQUKXeAe5bsKTayEVJG0ltTBDMVBfifZbdM6fN+eHMCDwM' + '\n' +
    'R5swMEwv9D2FuYHc+U7vDtc5pmF/1FV7sZl2BUECgYEAyRnzxjxJJRK1QdMMJl+b' + '\n' +
    '7hmKubWn9Mk97wbUyKglAuWgp+vVFRj23jLmbwvpjjcHv2PKvUyd44ITu8F69/Za' + '\n' +
    'kuXPjB6pi0hLp7NaFJ0gTapWA3h+n68E2q6AXe5TsVlx84qc8haOI6xqzu72ZBM8' + '\n' +
    'ZVyjcBwq10/BN34HzsCtZtcCgYAXkQmj5UGOCjpwY2cQTRtqOg8o0BSYHt+FNLLu' + '\n' +
    'vmcaNC5SwSwAZgvJ/XjoZ9oSSd2x8QyBTpu/p3Qw9REjdKzMRKd7tiM5nSpnNbcC' + '\n' +
    '1XOvhOnNUsVmy4jjDrol/cSKB8wnMeTe2KARSFw499a7nb8Um7ih59m3vNBULOGq' + '\n' +
    'fVKewQKBgQCME7JmWrzvp/vk40p1hwjyk0xtYXJZkt40b4icD3h0D4+XBSOJghfs' + '\n' +
    'pgthoLxvLkNHSkvqBITlzK/7XZ7SaWcw8l7ba4yQrQ8+nJ60ZYeGJkcZwV5qcGaU' + '\n' +
    'g7SQ/K86gtOnmpDAHDGAiGeUnz+61hUrB8WT+RJx8c90ePeNmJ/AkA==' + '\n' +
    '-----END RSA PRIVATE KEY-----';
    */
    
    var pubkey = this.pubkey
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
    var secret = 'xQ1mwjPlRFZKar/A3A8tY764zPBpcfcSQY8sfq9OAxQ=';
    console.log(crypto.publicEncrypt({key: this.pubkey, padding: constants.RSA_NO_PADDING}, Buffer.from(secret, 'base64')).toString('base64'));    
    // RSA_PKCS1_PADDING
    */

    /*
    var secret = 'XvNeYJAkjs90nJpzUnkVEUPPLmc4BjOAyVFZwg9AQgyhb5Xar74EEcAS9xXaIuVTLWmZNFPq/iRbldrjjDhbrWOv0cG3OUx47LUuXYEys+8AT+80lA5JxW37uJNYKO69BOLBcgC8SXt6MwLCp5bN/h9Iheq41txfe7Cbr6J176wboBZDE+YuHVD/9tm8DEiIscdjwyFt0hDClkq2GPCRoVIYmwfzn3rowf+pi3OdAWD/B9LGgiWnjV6EvJ+9UFEPZLHocFHT/7Qq7DSGTSSshwGA5XZvLuOLjpgxkj+AdqcsIErYzYN+T5mLLftA3ONABP8TZzS6i+ag8TRQZwPpVA==,oy3LF8bLb/QUdG4XEKzAhA==';
    var rsecret = crypto.privateDecrypt(this.privkey, Buffer.from(secret, 'base64')).toString();
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
          var secret = crypto.privateDecrypt({key: this.privkey, padding: constants.RSA_PKCS1_PADDING}, Buffer.from(ret[0], 'base64')).toString();
          console.log('secret', secret);
          var decipher = crypto.createDecipher('aes-256-ecb', secret);
          var chunks = []
          chunks.push(decipher.update(Buffer.from(ret[1], 'base64'), 'binary'));
          chunks.push(decipher.final('binary'));
          var name = Buffer.from(chunks.join(''), 'binary').toString('utf-8');
          chunks = []
          chunks.push(decipher.update(Buffer.from(ret[2], 'base64'), 'binary'));
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