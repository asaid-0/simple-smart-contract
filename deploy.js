const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiled = require('./compile');
const abi = compiled.abi;
const bytecode = compiled.evm.bytecode.object;

const provider = new HDWalletProvider('favorite island pig desert address hat execute exile female tongue nothing cabin',
  'https://rinkeby.infura.io/v3/3c2790fbf0284beb8a7f2bd952c550fc'
);

const web3 = new Web3(provider);
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  try {
    console.log('Deploying from', accounts[0]);
    const result = await new web3.eth.Contract(abi)
      .deploy({ data: '0x' + bytecode })
      .send({ from: accounts[0], gas: '1000000' });

    console.log('Deployed Successfuly [contract address]: ', result.options.address);
  } catch (err) {
    console.log(err);
  }
};
deploy();