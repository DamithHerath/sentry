from __future__ import absolute_import

from sentry.lang.native.processing import process_applecrashreport, \
    process_minidump, process_payload
from sentry.lang.native.minidump import is_minidump_event
from sentry.lang.native.utils import is_native_event
from sentry.lang.native.unreal import is_applecrashreport_event
from sentry.plugins.base.v2 import Plugin2


class NativePlugin(Plugin2):
    can_disable = False

    def get_event_enhancers(self, data):
        if is_minidump_event(data):
            return [process_minidump]
        elif is_applecrashreport_event(data):
            return [process_applecrashreport]
        elif is_native_event(data):
            return [process_payload]
