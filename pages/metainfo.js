import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';

export default class MetaInfoPage extends Component {

  static async getInitialProps({ query: { session, name, sns } }) {
    const initProps = {
      session: session,
      name: decodeURIComponent(name),
      sns: decodeURIComponent(sns),
    };
    return initProps || {}
  }

  constructor(props) {
    super(props);
  }

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
    this.webrtc.leaveRoom()
  }

  render() {
    return(
        <p>OK</p>
    )
  }
}
