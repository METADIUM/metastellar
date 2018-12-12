## Metastellar project.

Constellation market on Blockchain

#### Getting Started

##### Install package dependencies

```bash
$ npm install
```

##### Regenerate star base for deploy

```ruby
$ cd metastellar
$ ruby generate_star_seeds.rb
"Constellation Generated."
# for test purpose -> generate 5 stars only
$ ruby generate_star_seeds.rb -test
"Test Constellation Generated."
```

##### Generate search base for constellation search

```bash
$ cd metastellar
$ ruby generate_search_seeds.rb
```

##### Compile smart contract. (in case you updated MetaStellar.sol)

```bash
cd ethereum
node compile.js
# generates ethereum/build/MetaStellar.json
```

##### Figuring ethereum enviroment

> static/data/credentials.json
You can set your basic credentials here.

##### Deploying smart contract & star bases

```bash
$ cd ethereum
# deploy stars only
$ node deploy.js
```

##### Test Solidity Smart Contract

```bash
npm run test
```

##### Prerequisite for Web3

Before compiling, `static/data/credentials.json` should be provided following spec. Here is example:
```
{
  "url": "http://ropsten.infura.io",
  "contractAddr": "0xe00fDd5D31c11eACb3D016cC5f9459F81214895f",
  "addr": "0xA408FCD6B7f3847686Cb5f41e52A7f4E084FD3cc",
  "privkey": "11111111111111111111111111111111111111111111"
}
```

##### Run application in local environment

```bash
$ npm run dev
// check from: localhost: 3000
```

##### Deploy

```bash
cd metastellar
sudo service nginx restart
npm run build
pm2 start npm -- start
```

#### Technical specs

1. React for Front-end application.
2. Semantic UI for UI framework.
3. Next.js for routing & server-side rendering.
4. [VirtualSky](https://github.com/slowe/VirtualSky) for constellation draw.
5. Solidity for Ethereum smart contract.
6. Mocha for testing.
7. React Alert module from ['react-s-alert'](https://github.com/juliancwirko/react-s-alert)

#### Reference

- [Deploy environment](https://medium.com/@sscaff1/nextjs-from-npm-init-to-production-c9f543169bfb)
- [Stargazing](http://curious.astro.cornell.edu/about-us/112-observational-astronomy/stargazing/technical-questions/699-what-are-ra-and-dec-intermediate)
