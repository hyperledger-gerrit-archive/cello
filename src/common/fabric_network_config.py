# Copyright IBM Corp, All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#
from common.blockchain_network_config import BlockchainNetworkConfig

from common import CONSENSUS_PLUGINS


class FabricPreNetworkConfig(BlockchainNetworkConfig):
    """
    FabricPreNetworkConfig includes configs for fabric v0.6 network.
    """

    def __init__(self, consensus_plugin, consensus_mode, size):
        """
        Init.

        Args:
            consensus_plugin: consensus plugin to use, e.g., pbft
            consensus_mode: consensus mode, e.g., sieve
            size: size of nodes in the network

        >>> config = FabricPreNetworkConfig('plugin', 'mode', 'size')
        """
        self.consensus_plugin = consensus_plugin
        self.consensus_mode = consensus_mode
        self.size = size
        super(FabricPreNetworkConfig, self).__init__()


class FabricV1NetworkConfig(BlockchainNetworkConfig):
    """
    FabricV1NetworkConfig includes configs for fabric v1.0 network.
    """

    def __init__(self):
        """
        Init.

        Args:
        """
        super(FabricV1NetworkConfig, self).__init__()


if __name__ == "__main__":
    import doctest
    doctest.testmod()
