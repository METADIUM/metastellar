import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';
var https = require('https');

export default class MetaInfoPage extends Component {

  static async getInitialProps({ query: { session, secret, name, sns } }) {
    const initProps = {
      session: session,
      secret: secret,
      name: name,
      sns: sns,
    }
    return initProps || {}
  }

  handleResponse(response) {
    var serverData = '';
    response.on('data', function (chunk) {
      serverData += chunk;
    });
    response.on('end', function () {
      console.log("received server data:", serverData);
    });
  }

  constructor(props) {
    super(props);
    var data = this.props.secret + "," + this.props.name + "," + this.props.sns;
    https.request({
      hostname: '2g5198x91e.execute-api.ap-northeast-2.amazonaws.com',
      path: '/test?key=' + this.props.session + '&val=' + encodeURIComponent(data)},
      this.handleResponse).end();
  }

  /*
  componentDidMount() {
    this.webrtc = new SimpleWebRTC({
      autoRequestMedia: false,
    })
    this.webrtc.on('connectionReady', (sessionId) => {
      this.webrtc.joinRoom(this.props.session, (err, name) => {
        this.webrtc.sendToAll('pinfo', {
          name: this.props.name,
          sns: this.props.sns,
        });
      });
    });
  }

  componentWillUnmount() {
    this.webrtc.leaveRoom();
  }
  */

  render() {
    return(
      <p>OK</p>
    )
  }
}
