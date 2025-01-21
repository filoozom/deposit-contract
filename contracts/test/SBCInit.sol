// SPDX-License-Identifier: CC0-1.0

pragma solidity ^0.8.9;

import {SBCDepositContractProxy} from "../SBCDepositContractProxy.sol";
import {SBCToken} from "../SBCToken.sol";
import {SBCTokenProxy} from "../SBCTokenProxy.sol";

contract SBCInit {
    constructor(address admin, uint256 initialGNOStake, address GNOTokenProxyAddr, address depositProxyAddr) {
        SBCToken GNOToken = SBCToken(GNOTokenProxyAddr);
        SBCDepositContractProxy depositContractProxy = SBCDepositContractProxy(payable(depositProxyAddr));

        // Prefund the admin account with some balance to test deposits
        GNOToken.mint(admin, initialGNOStake);

        // Change default admin on deploy (system sender) to actual admin
        depositContractProxy.setAdmin(admin);
        SBCToken(payable(GNOTokenProxyAddr)).setMinter(admin);
        SBCTokenProxy(payable(GNOTokenProxyAddr)).setAdmin(admin);
    }
}
