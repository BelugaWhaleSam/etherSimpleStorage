// Import ether to use its feature
const ethers = require("ethers");
// To read ABI and binary data
const fs = require("fs");
// Pull environment variables
require("dotenv").config();

async function main() {
  // create a wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  // encrypt function will return a encrypted json key that we can only decrypt with a password
  // takes two parameters, password and key
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  );
  console.log(encryptedJsonKey);
  // save this encryptedJsonObject of our key to a new file using fs
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
