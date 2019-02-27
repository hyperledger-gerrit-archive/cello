#
# SPDX-License-Identifier: Apache-2.0
#
from enum import Enum, unique, EnumMeta
import inspect


def separate_upper_class(class_name):
    x = ""
    i = 0
    for c in class_name:
        if c.isupper() and not class_name[i - 1].isupper():
            x += " %s" % c.lower()
        else:
            x += c
        i += 1
    return "_".join(x.strip().split(" "))


class ExtraEnum(Enum):
    @classmethod
    def get_info(cls, title="", list_str=False):
        str_info = """
        """
        str_info += title
        if list_str:
            for name, member in cls.__members__.items():
                str_info += """
            %s
            """ % (
                    name.lower().replace("_", "."),
                )
        else:
            for name, member in cls.__members__.items():
                str_info += """
            %s: %s
            """ % (
                    member.value,
                    name,
                )
        return str_info

    @classmethod
    def to_choices(cls, string_as_value=False, separate_class_name=False):
        if string_as_value:
            choices = [
                (name.lower().replace("_", "."), name)
                for name, member in cls.__members__.items()
            ]
        elif separate_class_name:
            choices = [
                (separate_upper_class(name), name)
                for name, member in cls.__members__.items()
            ]
        else:
            choices = [
                (member.value, name)
                for name, member in cls.__members__.items()
            ]

        return choices


@unique
class HostStatus(ExtraEnum):
    Inactive = 0
    Active = 1


@unique
class NetworkStatus(ExtraEnum):
    Stopped = 0
    Running = 1
    Error = 2


@unique
class LogLevel(ExtraEnum):
    Info = 0
    Warning = 1
    Debug = 2
    Error = 3
    Critical = 4


@unique
class Operation(ExtraEnum):
    Start = 0
    Stop = 1
    Restart = 2


@unique
class NetworkOperation(ExtraEnum):
    Join = 0
    Leave = 1


@unique
class HostType(ExtraEnum):
    Docker = 0
    Kubernetes = 1


@unique
class ChannelType(ExtraEnum):
    System = 0
    Normal = 1


@unique
class NetworkType(ExtraEnum):
    Fabric1_3 = 0
    Fabric1_4 = 1


@unique
class NodeType(ExtraEnum):
    Ca = 0
    Orderer = 1
    Peer = 2


@unique
class NetworkCreateType(ExtraEnum):
    New = 0
    Import = 1


@unique
class K8SCredentialType(ExtraEnum):
    CertKey = 0
    Config = 1
    UsernamePassword = 2


@unique
class ConsensusPlugin(ExtraEnum):
    Solo = 0
    Kafka = 1


@unique
class UserRole(ExtraEnum):
    Administrator = 0
    Operator = 1
    User = 2


class EnumWithDisplayMeta(EnumMeta):
    def __new__(mcs, name, bases, attrs):
        display_strings = attrs.get("DisplayStrings")

        if display_strings is not None and inspect.isclass(display_strings):
            del attrs["DisplayStrings"]
            if hasattr(attrs, "_member_names"):
                attrs._member_names.remove("DisplayStrings")

        obj = super().__new__(mcs, name, bases, attrs)
        for m in obj:
            m.display_string = getattr(display_strings, m.name, None)

        return obj


@unique
class ErrorCode(Enum, metaclass=EnumWithDisplayMeta):
    UnknownError = 20000
    ValidationError = 20001
    ParseError = 20002
    ResourceInUse = 20003
    ResourceExists = 20004
    ResourceNotFound = 20005
    PermissionError = 20006
    CustomError = 20007

    class DisplayStrings:
        UnknownError = "Unknown Error."
        ValidationError = "Validation parameter error."
        ParseError = "Parse error."
        ResourceInUse = "Resource is inuse."
        ResourceExists = "Resource already exists."
        ResourceNotFound = "Request Resource Not found."
        PermissionError = "Permission Error."
        CustomError = "Custom Error."

    @classmethod
    def get_info(cls):
        error_code_str = """
        Error Codes:
        """
        for name, member in cls.__members__.items():
            error_code_str += """
            %s: %s
            """ % (
                member.value,
                member.display_string,
            )

        return error_code_str
