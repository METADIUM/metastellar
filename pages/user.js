import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { Menu, Button } from 'semantic-ui-react'
import Alert from 'react-s-alert'

import { Layout, AstroList } from '../components/index'
import LayoutHeader from '../components/Header'

import metaStellar from '../ethereum/metaStellar.js'

export default class User extends Component {
  static async getInitialProps ({ query: { address } }) {
    const bucketLength = await metaStellar.methods.getBucketLength(address).call()
    const starIndexes = Array.from(Array(parseInt(bucketLength))).map((e, i) => i)
    var pages = []; var per_pages = 18
    while (starIndexes.length > 0) {
      pages.push(starIndexes.splice(0, per_pages))
    }

    const initProps = {
      address: address,
      pages: pages
    }
    return initProps || {}
  }

  constructor () {
    super()
    this.state = {
      astros: [],
      page: 0,
      no_more: false,
      loading: true,
      metaID: {
        name: '',
        sns: '',
        owner: ''
      }
    }
  }

  componentDidMount () {
    this.paginateChain()
      .then(() => this.setState({ loading: false, page: this.state.page + 1 }))
  }

  onClickPagination () {
    this.setState({ loading: true }, () => {
      this.paginateChain()
        .then(() => this.setState({ loading: false, page: this.state.page + 1 }))
    })
  }

  async paginateChain () {
    await this.generatePromises(this.state.page).then(async (promises) => {
      console.log(promises.length)
      if (promises.length < 18) {
        await this.setState({ no_more: true })
      }
      for (const promise of promises) {
        try {
          var astro = await promise
          this.setState({
            astros: [...this.state.astros, astro]
          })
          if (this.state.metaID.name === '') {
            this.setState({ metaID: astro.metaID })
          }
        } catch (error) {
          console.log(error, 'error')
        }
      }
    })
  }

  async generatePromises (page) {
    const minimumPrice = await metaStellar.methods.minimumPrice().call()

    let promises = this.props.pages[page].map(async (idx) => {
      const astroId = await metaStellar.methods.astroBucket(this.props.address, idx).call()
      const rawAstro = await metaStellar.methods.getAstro(astroId).call()
      const lastBid = await new BigNumber(parseInt(rawAstro.lastBid))
      const minBidTic = await new BigNumber(parseInt(minimumPrice))
      const currentBid = await lastBid.plus(minBidTic)

      return {
        id: parseInt(rawAstro.id),
        target: { name: rawAstro.name },
        ra: { decimal: (rawAstro.raDecimal / 1000) },
        dec: { decimal: (rawAstro.decDecimal / 1000) },
        metaID: {
          name: rawAstro.metaIDName,
          owner: rawAstro.metaIDOwner,
          sns: rawAstro.metaIDSns
        },
        lastBid: lastBid,
        minBidTic: minBidTic,
        currentBid: currentBid
      }
    })

    return promises
  }

  render () {
    return (
      <Layout fluid style={{ margin: '5vw' }}>
        <LayoutHeader>
          <Menu.Item>
            <h3>{`${this.state.metaID.name}'s space`} | <a href={`https:${this.state.metaID.sns}`} target={'_blank'}>SNS</a> | <a href={`https://testnetexplorer.metadium.com/address/${this.state.metaID.owner}`} target={'_blank'}>Address</a></h3>
          </Menu.Item>
        </LayoutHeader>
        <AstroList astros={this.state.astros} />
        {this.state.no_more
          ? null : <Button fluid basic loading={this.state.loading} style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => this.onClickPagination()}>
          Next Page
          </Button>}
        <Alert stack={{ limit: 3 }} />
      </Layout>
    )
  }
}
