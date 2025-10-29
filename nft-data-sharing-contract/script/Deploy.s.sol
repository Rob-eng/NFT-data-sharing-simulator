// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/NFTDataSharing.sol";

/**
 * @title DeployNFTDataSharing
 * @dev Script de deploy para o contrato NFTDataSharing
 */
contract DeployNFTDataSharing is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NFTDataSharing nftContract = new NFTDataSharing();

        vm.stopBroadcast();

        console.log("NFTDataSharing deployed to:", address(nftContract));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
    }
}
