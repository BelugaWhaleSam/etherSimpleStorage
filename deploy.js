// http://127.0.0.1:7545 can make api calls to RPC server of ganache

// Import ether to use its feature
const ethers = require("ethers");
// To read ABI and binary data
const fs = require("fs");
// Pull environment variables
require("dotenv").config();

async function main() {
  // Connect to RPC server or any url, also alchemy
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

  // Connect to a wallet and sign transactions
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // // using encrypted private key to return a wallet object

  // // first we need to read the encryptedKey from the json file
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
  // // Now to create a wallet out of it, pass args as encryptedJson key and password from .env
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // // since we are using let and not const with the wallet above is because we still need to connect..
  // // .. the wallet to the provider in order to function
  // wallet = await wallet.connect(provider);

  //To read from abi and binary synchornously
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  // contractfactory is an object used to deploy
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("deploying please wait....");
  //deploying using ethers and async implies to stop and wait for the contract to deploy and finish
  const contract = await contractFactory.deploy({gasPrice: 100000000000});
  // console.log(contract);
  // transaction receipt you'll receive when we wait for the block/transaction to finish
  await contract.deployTransaction.wait(1);

  console.log(`Contract Address: ${contract.address}`);

  // Calling retrieve function to return a value

  // calls retrieve function from the contract object through abi
  // It should return our current favourite number
  // retrieve function won't cost any gas, since it's a read function
  const currentFavouriteNumber = await contract.retrieve();
  // toString function makes the number to be converted to a number
  // Else(w/o toString) it is represented as BigNumber notation which we do not want, or is hard to understand
  console.log(currentFavouriteNumber.toString());
  // This console log can be made more readable for strings and variables
  // for wraping everything we use backticks ``
  // variables are denoted by $ sign and {} around it
  console.log(
    `Current Favourite Number : ${currentFavouriteNumber.toString()}`
  );

  // Calling store function to update the value of the number

  // Calling store function to pass value to update our number
  // Note: always pass numbers as strings in js
  // This will cost gas as it does something
  const transactionResponse = await contract.store("7");
  // Await function on functions call uses transactionResponse.wait
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();

  console.log(
    `Updated Favourite Number : ${updatedFavouriteNumber.toString()}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
