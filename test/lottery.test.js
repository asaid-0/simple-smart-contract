const assert = require('assert'); 
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiled = require('../compile');
const abi = compiled.abi;
const bytecode = compiled.evm.bytecode.object

let accounts;
let initialBalance;
let lottery;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    // Use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery', () => {

    it('Deploys a contract', () => {
        //show accounts with balance
        accounts.map(async (account) => {
            console.log(account, ": ", await web3.eth.getBalance(account));
        });
        assert.ok(lottery.options.address);
    });

    it('should get random number', async () => {
        const random = await lottery.methods.generateRandom().call();
        console.log("random: ", random);
        assert.ok(random);
    });

    it('Player can enter', async () => {
        await lottery.methods.enter().send({ from: accounts[1], value: 20000000000000000 });
        const count = await lottery.methods.getPlayersCount().call();
        // console.log(count);
        assert.equal(count, 1);
    });

    it('Test Winner', async () => {
        await lottery.methods.enter().send({ from: accounts[1], value: 20000000000000000 }); //enter lottery
        initialBalance = web3.utils.fromWei(await web3.eth.getBalance(accounts[1]), 'ether'); //get balance after entering
        await lottery.methods.pickRandomWinner().send({
            from: accounts[0],
            gas: '1000000'
        });
        const newBalance = web3.utils.fromWei(await web3.eth.getBalance(accounts[1]), 'ether'); //get balance after wining
        const reward = newBalance - initialBalance;

        console.log("Reward: ", reward);
        assert(reward > 0.018);  //should be 0.01999 increase
        
    });

});