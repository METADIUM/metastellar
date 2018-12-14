import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import Alert from 'react-s-alert'

import { Layout } from '../components/index'
import VirtualSky from '../components/VirtualSky'

import metaStellar from '../ethereum/metaStellar.js'

class MetaStellarIndex extends Component {
  static async getInitialProps () {
    const astros = await metaStellar.methods.lastId().call()
      .then(async (res) => {
        const minimumPrice = await metaStellar.methods.minimumPrice().call()
        const starIDs = Array.from(Array(parseInt(res))).map((e, i) => i + 1)

        return await Promise.all(starIDs.map(async (id) => {
          const rawAstro = await metaStellar.methods.getAstro(id).call()
          const lastBid = await new BigNumber(parseInt(rawAstro.lastBid))
          const minBidTic = await new BigNumber(parseInt(minimumPrice))
          const currentBid = await lastBid.plus(minBidTic)

          return {
            id: parseInt(rawAstro.id),
            target: { name: rawAstro.name },
            ra: { decimal: rawAstro.raDecimal / 1000 },
            dec: { decimal: rawAstro.decDecimal / 1000 },
            metaID: {
              name: rawAstro.metaIDName,
              owner: rawAstro.metaIDOwner,
              sns: rawAstro.metaIDSns
            },
            lastBid: lastBid,
            minBidTic: minBidTic,
            currentBid: currentBid
          }
        }))
      })

    const ranking_hashes = {}
    astros.forEach(function (astro) {
      var x = astro.metaID.owner
      ranking_hashes[x] = (ranking_hashes[x] || 0) + 1
    })
    const rankers = Object.keys(ranking_hashes).sort(function (a, b) { return ranking_hashes[b] - ranking_hashes[a] })
    return {
      astros: astros,
      rankers: rankers,
      ranking_hashes: ranking_hashes
    }
  }

  constructor () {
    super()
    this.state = {
      loading: false,
      currentUser: null
    }
  }

  render () {
    return (
      <Layout fluid>
        <VirtualSky astros={this.props.astros} rankers={this.props.rankers} ranking_hashes={this.props.ranking_hashes} />
        <Alert stack={{ limit: 3 }} />
      </Layout>
    )
  }
}

export default MetaStellarIndex
