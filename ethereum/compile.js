const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // Removes the folder and everything inside it.
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;
fs.ensureDirSync(buildPath); // ensureDir checks if the directory exists.
// If it doesnot exists then it is created.

for (let contract in output) {
	fs.outputJsonSync(
		path.resolve(buildPath, contract.replace(':', '') + '.json'),
		/* ES6 Synatx
			path.resolve(buildPath, `${contract.replace(':', '')}.json`),
		*/
		output[contract]
		// contract contains Name of Contract and it is a key
		// So, to get it's value we do output[contracts]
	);
} 