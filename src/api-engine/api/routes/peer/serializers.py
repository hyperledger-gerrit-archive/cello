#
# SPDX-License-Identifier: Apache-2.0
#
import logging

from rest_framework import serializers
from api.common.enums import (
    Operation,
    NetworkType,
    FabricNodeType,
    FabricVersions,
    HostType,
)
from api.common.serializers import PageQuerySerializer
from api.models import Node

LOG = logging.getLogger(__name__)


class PeerQuery(PageQuerySerializer, serializers.ModelSerializer):
    agent_id = serializers.UUIDField(
        help_text="Agent ID, only operator can use this field",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Node
        fields = (
            "page",
            "per_page",
            "name",
            "network_type",
            "network_version",
            "agent_id",
        )


class PeerIDSerializer(serializers.Serializer):
    id = serializers.UUIDField(help_text="ID of peer")


class PeerInListSerializer(PeerIDSerializer, serializers.ModelSerializer):
    agent_id = serializers.UUIDField(
        help_text="Agent ID", required=False, allow_null=True
    )
    network_id = serializers.UUIDField(
        help_text="Network ID", required=False, allow_null=True
    )

    class Meta:
        model = Node
        fields = (
            "id",
            "name",
            "network_type",
            "network_version",
            "created_at",
            "agent_id",
            "network_id",
        )
        extra_kwargs = {
            "id": {"required": True, "read_only": False},
            "created_at": {"required": True, "read_only": False},
        }


class PeerListSerializer(serializers.Serializer):
    data = PeerInListSerializer(many=True, help_text="Peers list")
    total = serializers.IntegerField(
        help_text="Total number of peers", min_value=0
    )


class PeerCreateBody(serializers.ModelSerializer):
    agent_type = serializers.ChoiceField(
        help_text="Agent type",
        choices=HostType.to_choices(True),
        required=False,
    )

    class Meta:
        model = Node
        fields = (
            "network_type",
            "network_version",
            "agent_type",
            "agent",
        )
        extra_kwargs = {
            "network_type": {"required": True},
            "network_version": {"required": True},
        }

    def validate(self, attrs):
        network_type = attrs.get("network_type")
        network_version = attrs.get("network_version")
        agent_type = attrs.get("agent_type")
        agent = attrs.get("agent")
        if network_type == NetworkType.Fabric.name.lower():
            if network_version not in FabricVersions.values():
                raise serializers.ValidationError("Not valid fabric version")

        if agent_type is None and agent is None:
            raise serializers.ValidationError("Please set agent_type or agent")

        if agent_type and agent:
            if agent_type != agent.type:
                raise serializers.ValidationError(
                    "agent type not equal to agent"
                )

        return attrs


class PeerOperationSerializer(serializers.Serializer):
    action = serializers.ChoiceField(
        help_text=Operation.get_info("Operation for peer:", list_str=True),
        choices=Operation.to_choices(True),
    )
