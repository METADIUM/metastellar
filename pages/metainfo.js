import React, { Component } from 'react';
import SimpleWebRTC from 'simplewebrtc';

export default class MetaInfoPage extends Component {

  static async getInitialProps({ query: { session, name, sns } }) {
    const initProps = {
      session: session,
      name: name,
      sns: sns,
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
    this.webrtc.joinRoom(this.props.session, (err, name) => {
      this.webrtc.sendToAll('pinfo', {
        name: name,
        sns: sns,
      });
    })
  }

  componentWillUnmount() {
    this.webrtc.leaveRoom()
  }

  render() {
    return(
        <p>{this.props.session},{this.props.name},{this.props.sns}</p>
    )
  }
}
