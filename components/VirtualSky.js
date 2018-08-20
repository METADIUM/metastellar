import React, {Component} from 'react';
import metaStellar from '../ethereum/metaStellar.js';
import web3 from '../ethereum/web3';
import { Astro, RankingList, Login } from './index.js';
import { Dropdown, Header, Menu } from 'semantic-ui-react';
import LayoutHeader from './Header';
import searchBase from '../static/data/ko/search_base.json';
import virtualskyInitializer from '../static/data/initializer.json';
import Alert from 'react-s-alert';

export default class VirtualSky extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      sns: '',
      modalOpen: false,
      currentAstro: {
        target: {name: 'Astro'}, ra: {decimal: 0}, dec: {decimal: 0}, currentBid: '0', minBidTic: '0', lastBid: '0'
      },
      currentMetaID: {
        name: 'Esji', joined: 'Since 2018', about: 'Anonymous', image: 'https://apod.nasa.gov/apod/image/9612/sagan_uc.gif'
      },
      formattedSearchBase: [],
      formLoading: false,
      message: null,
      messageUrl: null,
      popup:false
    }
  }

  componentDidMount() {
    this.vs = $.virtualsky({
      id: 'starmap',
      lang: 'ko',
      objects: this.props.astros,
      ...virtualskyInitializer,
      onClickObject: (o) => this.openAstroModal(o),
    });
    const fsb = searchBase.map((star) => {
      return {
        key: star.target.name, value: star, text: star.target.name,
        content: <Header className={'ui header text search-result-bar'} icon={`${star.type==='star'?'empty ':''}star`}
                         content={star.target.name} subheader={star.type_locale} />
      }
    });
    this.setState({formattedSearchBase: fsb});
    this.baseTrxRequestUri ="meta://transaction?usage=buyAstro&service=https%3A%2F%2Fmetastellar.metadium.com";

    this.trxRequestUri = this.baseTrxRequestUri;
    // this.setState({ popup: false});
  }

  async checkNetwork() {
    let network = true;
    /*
    if (!(typeof window !== 'undefined' && typeof window.web3 !== 'undefined')) {
      Alert.info('<h4>Metamask not available.</h4><ul><li><a href="https://metamask.io/" target="_blank">Get Metamask now.</a></li></ul>', {
        position: 'top-right',
        effect: 'slide',
        html: true,
        timeout: 5000
      });
      network = false;
    } else {
      await web3.eth.net.getNetworkType()
          .then((network) => {
            if (network !== 'ropsten' && network !== 'private') {
              Alert.info('<h4>You are not in a ropsten network.</h4><ul><li><a href="https://metamask.io/" target="_blank">Open Metamask and change your network to ropsten.</a></li></ul>', {
                position: 'top-right',
                effect: 'slide',
                html: true,
                timeout: 5000
              });
            }
          });
      network =false
    }
    */
    return network;
  }

  invalidForm(name, sns) {
    let invalid = false;
    if (name === '' || sns === '') {
      Alert.info(`<h4>${name === ''?'Name field ':''} ${sns === ''?'SNS field ':''}not given.</h4>`, {
        position: 'top-right',
        effect: 'slide',
        html: true,
        timeout: 5000
      });
      invalid = true;
    }
    return invalid;
  }

  async onPressBuy(bid, name, sns) {
     if  (this.invalidForm(name, sns)) { // await this.checkNetwork() ||
       return false;
     }
    const { id } = this.state.currentAstro;

    this.setState({formLoading: true}, async () => {
      var request = metaStellar.methods.buyAstro(id, name, sns).send.request({from: "", value: web3.utils.toWei(bid, 'ether'), gasPrice: '1'})
      this.trxRequestUri = this.baseTrxRequestUri 
      + "&to="+ request.params[0].to
      + "&value="+ request.params[0].value
      + "&data="+ request.params[0].data;
      console.log("trxReq URI : "+this.trxRequestUri);
      this.setState({ message: `Scan QR Code with MetaID App. and Send Tx`, formLoading: false, popup: true });
    });
  };

  moveTo(star) {
    var self=this;
    setTimeout(function(){
      self.vs.panTo(star.ra.decimal, star.dec.decimal, 500);
    }, 10);
  };

  openAstroModal(object) {
    this.setState({currentAstro: object, message: null, messageUrl: null}, () => {
      this.handleOpen()
    })
  };

  handleOpen() {this.setState({ modalOpen: true })};
  handleClose() {this.setState({ modalOpen: false })};
  upBid() {this.setState({currentAstro: {...this.state.currentAstro, currentBid: this.state.currentAstro.currentBid + 0.1} })};
  downBid() {this.setState({currentAstro: {...this.state.currentAstro, currentBid: this.state.currentAstro.currentBid - 0.1} })};

  setInfo(name, sns) {this.setState({name: name, sns: sns})};

  render() {
    return (
        <div>
          <LayoutHeader>
            <Menu.Item style={{width: '30%', height: '10vh'}}>
              <Dropdown
                placeholder='Search'
                fluid selection search
                options={this.state.formattedSearchBase}
                onChange={(e, { value }) => this.moveTo(value)}
              />
            </Menu.Item>
            <Menu.Item style={{/*width: '30%',*/ height: '10vh'}}>
              <Login setInfo={(name, sns) => this.setInfo(name, sns)}/>
            </Menu.Item>
            <Menu.Item style={{/*width: '20%',*/ height: '10vh'}}>
              <RankingList rankers={this.props.rankers} ranking_hashes={this.props.ranking_hashes} />
            </Menu.Item>
            <Menu.Item>
              {this.state.name != "" && <p>{this.state.name},{this.state.sns}</p>}
            </Menu.Item>
          </LayoutHeader>
          <div style={styles.starmapContainer}>
            <div id={"starmap"} style={styles.container}></div>
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
              openPopup = {this.state.popup}
              targetUrl = {this.trxRequestUri}
              name = {this.state.name}
              sns = {this.state.sns}
          />
        </div>
        
    );
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
};
