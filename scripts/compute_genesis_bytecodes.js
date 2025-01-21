const SBCDepositContractProxy = artifacts.require("SBCDepositContractProxy");
const SBCInit = artifacts.require("SBCInit");
const SBCTokenProxy = artifacts.require("SBCTokenProxy");
const SBCWrapperProxy = artifacts.require("SBCWrapperProxy");
const UnsafeTokenProxy = artifacts.require("UnsafeTokenProxy");

// # How to use
//
// Create a keystore and set its public key to env ADMIN. This account you both:
// - Have control of its private key
// - Have some native token funds from genesis allocation. This script adds a pre-mine for admin
//
// ## Connecting to network
//
// To output contracts bytecodes and constructor calls for the specific devnet deployment, run:
// 
// ```
// npx truffle exec scripts/compute_genesis_bytecodes.js --network <name>
// ```
// 
// The network name is the network configuration specified in the networks section of truffle-config.js.
// For instance, devnet3. The secrets or other local settings must be defined in .env file.
// 
// ## Without connecting to network
//
// ```
// ADMIN=0xba61bac431387687512367672613571625671547 npx truffle exec scripts/compute_genesis_bytecodes.js --network xdai_ro
// ```
//
// The resulting JSON must be added to the end of the a chainspec.json genesis file,
// on the 'accounts' field's object.

async function computeGenesisBytecode() {
  const admin = process.env.ADMIN || (await web3.eth.getAccounts())[0];
  const depositAddress = "0xbabe2bed00000000000000000000000000000003";
  const initializerAddress = "0xface2face0000000000000000000000000000000";
  const GNOTokenAddress = "0xbabe2bed00000000000000000000000000000002";

  if (!admin) throw Error("must set ADMIN env");

  // Partial object of an execution layer genesis including only withdrawals contracts.
  // pre-compile contracts should be added latter
  const chainSpecAccounts = {
    // Default pre-mine for admin account
    [admin]: {
      balance: "0xc9f2c9cd04674edea40000000"
    }
  }

  function addBytecode(address, bytecode, params) {
    chainSpecAccounts[address] = {
      balance: "0",
      constructor: bytecode + params.substring(2)
    }
  }

  // Stake token proxy
  addBytecode(
    GNOTokenAddress,
    SBCTokenProxy.bytecode,
    web3.eth.abi.encodeParameters(["address", "string", "string"], [initializerAddress, "Stake GNO", "GNO"])
  );

  // Deposit proxy
  addBytecode(
    depositAddress,
    SBCDepositContractProxy.bytecode,
    web3.eth.abi.encodeParameters(["address", "address"], [initializerAddress, GNOTokenAddress])
  );

  // Initializer
  addBytecode(
    initializerAddress,
    SBCInit.bytecode,
    web3.eth.abi.encodeParameters(
      ["address", "address", "address"],
      [admin, GNOTokenAddress, depositAddress]
    )
  );

  // Done, dump
  return chainSpecAccounts
}

module.exports = async function (callback) {
  try {
    console.log(JSON.stringify(await computeGenesisBytecode(), null, 2));
  } catch (e) {
    console.error(e);
  }

  callback();
};

module.exports.computeGenesisBytecode = computeGenesisBytecode
