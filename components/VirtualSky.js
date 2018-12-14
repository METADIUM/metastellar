import React, { Component } from 'react'
import { Dropdown, Header, Menu } from 'semantic-ui-react'
import Alert from 'react-s-alert'
import { Request } from 'metasdk-react'

import searchBase from '../static/data/ko/search_base.json'
import virtualskyInitializer from '../static/data/initializer.json'

import { Astro, RankingList } from './index.js'
import LayoutHeader from './Header'

import metaStellar from '../ethereum/metaStellar.js'
import web3 from '../ethereum/web3'

// Callback function binding
var setInfo

export default class VirtualSky extends Component {
  setInfo (req) {
    this.setState({ name: req['12'], sns: req['30'] })
  };

  constructor () {
    super()
    this.state = {
      name: '',
      sns: '',
      modalOpen: false,
      currentAstro: {
        target: { name: 'Astro' }, ra: { decimal: 0 }, dec: { decimal: 0 }, currentBid: '0', minBidTic: '0', lastBid: '0'
      },
      currentMetaID: {
        name: 'Esji', joined: 'Since 2018', about: 'Anonymous', image: 'https://apod.nasa.gov/apod/image/9612/sagan_uc.gif'
      },
      formattedSearchBase: [],
      formLoading: false,
      message: null,
      messageUrl: null,
      popup: false
    }
    setInfo = this.setInfo.bind(this)
  }

  componentDidMount () {
    this.vs = $.virtualsky({
      id: 'starmap',
      lang: 'ko',
      objects: this.props.astros,
      ...virtualskyInitializer,
      onClickObject: (o) => this.openAstroModal(o)
    })
    const fsb = searchBase.map((star) => {
      return {
        key: star.target.name,
        value: star,
        text: star.target.name,
        content: <Header className={'ui header text search-result-bar'} icon={`${star.type === 'star' ? 'empty ' : ''}star`}
          content={star.target.name} subheader={star.type_locale} />
      }
    })
    this.setState({ formattedSearchBase: fsb })
    this.baseTrxRequestUri = 'meta://transaction?usage=buyAstro&service=https%3A%2F%2Fmetastellar.metadium.com'

    this.trxRequestUri = this.baseTrxRequestUri
    // this.setState({ popup: false});
  }

  invalidForm (name, sns) {
    let invalid = false
    if (name === '' || sns === '') {
      Alert.info(`<h4>${name === '' ? 'Name field ' : ''} ${sns === '' ? 'SNS field ' : ''}not given.</h4>`, {
        position: 'top-right',
        effect: 'slide',
        html: true,
        timeout: 5000
      })
      invalid = true
    }
    return invalid
  }

  async onPressBuy (bid, name, sns) {
    if (this.invalidForm(name, sns)) {
      return false
    }
    const { id } = this.state.currentAstro

    this.setState({ formLoading: true }, async () => {
      this.trxRequest = metaStellar.methods.buyAstro(id, name, sns).send.request({ from: '', value: web3.utils.toWei(bid, 'ether'), gasPrice: '1' })
      this.setState({ message: `Scan QR Code with MetaID App. and Send Tx`, formLoading: false, popup: true })
    })
  };

  moveTo (star) {
    var self = this
    setTimeout(function () {
      self.vs.panTo(star.ra.decimal, star.dec.decimal, 500)
    }, 10)
  };

  openAstroModal (object) {
    this.setState({ currentAstro: object, message: null, messageUrl: null }, () => {
      this.handleOpen()
    })
  };

  handleOpen = () => this.setState({ modalOpen: true });
  handleClose = () => this.setState({ modalOpen: false });
  upBid = () => this.setState({ currentAstro: { ...this.state.currentAstro, currentBid: this.state.currentAstro.currentBid + 0.1 } });
  downBid = () => this.setState({ currentAstro: { ...this.state.currentAstro, currentBid: this.state.currentAstro.currentBid - 0.1 } });

  render () {
    return (
      <div>
        <LayoutHeader>
          <Menu.Item style={{ width: '30%', height: '10vh' }}>
            <Dropdown
              placeholder='Search'
              fluid selection search
              options={this.state.formattedSearchBase}
              onChange={(e, { value }) => this.moveTo(value)}
            />
          </Menu.Item>
          <Menu.Item style={{/* width: '30%', */ height: '10vh' }}>
            {this.state.name == ''
              ? <Request
                request={['12', '30']}
                usage='metastellar'
                qrtext='Login'
                qrsize={256}
                qrvoffset={20}
                qrposition='bottom right'
                qrpadding='2em'
                callback={setInfo} />
              : <p>{this.state.name}<br />{this.state.sns}</p>}
          </Menu.Item>
          <Menu.Item style={{/* width: '20%', */ height: '10vh' }}>
            <RankingList rankers={this.props.rankers} ranking_hashes={this.props.ranking_hashes} />
          </Menu.Item>
        </LayoutHeader>
        <div style={styles.starmapContainer}>
          <div id={'starmap'} style={styles.container} />
        </div>
        <Astro
          astro={this.state.currentAstro}
          message={this.state.message}
          messageUrl={this.state.messageUrl}
          modalOpen={this.state.modalOpen}
          handleClose={() => this.handleClose()}
          upBid={() => this.upBid()}
          downBid={() => this.downBid()}
          formLoading={this.state.formLoading}
          onPressBuy={(bid, name, sns) => this.onPressBuy(bid, name, sns)}
          openPopup={this.state.popup}
          trxRequest={this.trxRequest}
          name={this.state.name}
          sns={this.state.sns}
        />
      </div>
    )
  }
}

const styles = {
  container: {
    height: '70vh',
    width: '70%'
  },
  starmapContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: 'black',
    backgroundImage: 'url(static/images/bg.jpg)',
    backgroundSize: 'cover',
    overflow: 'hidden'
  }
}
