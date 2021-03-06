const fs = require('fs');
const ShrkERC20 = require('../abi/SharkERC20Token.json');
const sShrkERC20 = require('../abi/StakedShark.json');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const SHRK = new ethers.Contract(ShrkERC20.address, ShrkERC20.abi, deployer);
    console.log(`SHRK address: ${SHRK.address}`);

    const sSHRK = new ethers.Contract(sShrkERC20.address, sShrkERC20.abi, deployer);
    console.log(`sSHRK address: ${sSHRK.address}`);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const timenow = block.timestamp;

    const _epochLength = 8 * 60 * 60;	// 8 hours
    const number = 0;

    const contractFactory = await ethers.getContractFactory('SharkStaking');
    const contract = await contractFactory.deploy(
        SHRK.address,
        sSHRK.address,
        _epochLength,
        number,
        timenow
    );
    console.log(`Contract address: ${contract.address}`);

    const data = {
        address: contract.address,
        abi: JSON.parse(contract.interface.format('json'))
    };
    fs.writeFileSync('abi/SharkStaking.json', JSON.stringify(data));

    console.log("Verify contract:");
    console.log(`npx hardhat verify --network rinkeby ${contract.address} ${SHRK.address} ${sSHRK.address} ${_epochLength} ${number} ${timenow}`);
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });
