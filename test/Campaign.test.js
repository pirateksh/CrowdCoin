const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/Factory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory; // reference to deployed instance of factory
let campaignAddress;
let campaign;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send( { from: accounts[0], gas: '1000000' });

	await factory.methods.createCampaign('100').send({
		from: accounts[0],
		gas: '1000000' 
	});

	[campaignAddress] = await factory.methods.getDeployedCampaigns().call();
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		campaignAddress
	);
});

describe('Campaigns', () => {
	it('deploys a factory and a campaign', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);
	});

	it('marks caller as the campaign manager', async () => {
		const manager = await campaign.methods.manager().call();
		assert.equal(accounts[0], manager);
	});

	it('allows people to contribute money and marks them as approvers', async () => {
		await campaign.methods.contribute().send({
			from: accounts[1],
			// gas: '1000000', gas might be optional in payable function
			value: '200'
		});

		const is_contributor = await campaign.methods.approvers(accounts[1]).call();
		assert(is_contributor);
	});

	it('requires a minimum contribution', async () => {
		try{
			await campaign.methods.contribute().send({
				from: accounts[1],
				value: '50'
			});
			assert(false);
		} catch(err) {
			assert(err);
		}
	});

	it('allows a manager to make a payment request', async () => {
		await campaign.methods
			.createRequest('Buy Batteries', '100', accounts[1])
			.send({ 
				from: accounts[0],
				gas: '1000000' // Why was gas amount specified here?
			});

		const request = await campaign.methods.requests(0).call();
		assert.equal('Buy Batteries', request.description);
	});

	it('processes requests', async () => {
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei('10', 'ether')
		});

		await campaign.methods
			.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
			.send({ from: accounts[0], gas: '1000000' })
	
		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		})

		await campaign.methods.finaliseRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		});

		let balance = await web3.eth.getBalance(accounts[1]); // Balance is a string representing wei
		balance = web3.utils.fromWei(balance, 'ether'); // Balance is a string representing ether
		balance = parseFloat(balance); // Balance is a float number representing ether
		assert(balance > 104);
	});
});