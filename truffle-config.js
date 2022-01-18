
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'your_mnemonic';

module.exports = {
  networks: {
    development: {      
      host: 'localhost',
      port: 7545,
      network_id: '*',
      gas: 5000000
    },
    goerli: {
      provider: () => new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/88751e7941e84f4b9e1fbce85516eee6"),
      network_id: 5
    }
  }
}

/**
 * Example deploy on goerli testnet
 * truffle deploy --reset 
--network goerli
Compiling .\contracts\Airline.sol...
Writing artifacts to .\build\contracts

Using network 'goerli'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x306d7018dc6ae914e64f918e31b671faa3c196828436fa5b0ae4f36397fb1bdd
  Migrations: 0x7ba4e50a655e692703b794309f251bbb8a2eaf7e
Saving successful migration to network...
  ... 0x53a3690d7b31d85cb94e69f559da4481e1130b12161116815ed374f6c550ec51
Saving artifacts...
Running migration: 2_airline_migration.js
  Deploying Airline...
  ... 0xa86e379e0cefb2927c476d7d467f955efe9ad3774bee25a2fa423899adbab804
  Airline: 0xb02da21c7168c8a45d4f7abdf5f1809fe33808b5
Saving successful migration to network...
  ... 0x51836f8651f30e934fb5da9d823227beda7b376e27c8fa3c8090890c360a9207
Saving artifacts...
 * 
 */