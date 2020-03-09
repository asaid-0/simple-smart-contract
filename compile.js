const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const CONTRACT_FILE = 'Lottery.sol';

const input = {
  language: 'Solidity',
  sources: {
    [CONTRACT_FILE]: {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', "evm.bytecode"]
      }
    }
  }
}

const compiled = solc.compile(JSON.stringify(input));
const output = JSON.parse(compiled);

module.exports = output.contracts[CONTRACT_FILE]['Lottery'];

