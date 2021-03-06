const fs = require('fs');
const ShrkERC20 = require('../abi/SharkERC20Token.json');
const SharkTreasury = require('../abi/SharkTreasury.json');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const SHRK = new ethers.Contract(ShrkERC20.address, ShrkERC20.abi, deployer);
    console.log(`SHRK address: ${SHRK.address}`);

    const treasury = new ethers.Contract(SharkTreasury.address, SharkTreasury.abi, deployer);
    console.log(`SharkTreasury address: ${treasury.address}`);

    const _epochLength = 8 * 60 * 60;	// 8 hours
    const _nextEpochTime = 1649860428;

    const contractFactory = await ethers.getContractFactory('Distributor');
    const contract = await contractFactory.deploy(SHRK.address, treasury.address, _epochLength, _nextEpochTime);
    console.log(`Contract address: ${contract.address}`);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    };
    fs.writeFileSync('abi/Distributor.json', JSON.stringify(data));

    console.log("Verify contract:");
    console.log(`npx hardhat verify --network rinkeby ${contract.address} ${SHRK.address} ${treasury.address} ${_epochLength} ${_nextEpochTime}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
