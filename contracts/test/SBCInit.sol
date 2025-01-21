// SPDX-License-Identifier: CC0-1.0

pragma solidity ^0.8.9;

import {SBCDepositContractProxy} from "../SBCDepositContractProxy.sol";
import {SBCToken} from "../SBCToken.sol";
import {SBCTokenProxy} from "../SBCTokenProxy.sol";

contract SBCInit {
    constructor(address admin, address GNOTokenProxyAddr, address depositProxyAddr) {
        SBCDepositContractProxy depositContractProxy = SBCDepositContractProxy(payable(depositProxyAddr));

        // Change default admin on deploy (system sender) to actual admin
        depositContractProxy.setAdmin(admin);
        SBCToken(payable(GNOTokenProxyAddr)).setMinter(admin);
        SBCTokenProxy(payable(GNOTokenProxyAddr)).setAdmin(admin);
    }
}
