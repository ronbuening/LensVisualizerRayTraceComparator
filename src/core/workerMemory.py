"""Pool-only interpreter launcher: own-process RSS heartbeats, outside every engine source hash.

Runs the original Python module/script unchanged under the worker's existing environment. Diagnostics go only
to the transient pool directory, never stdout, stderr, the optical protocol, or a result artifact.
"""

import atexit
import ctypes
import json
import os
from pathlib import Path
import runpy
import resource
import sys
import threading


def rss_bytes():
    if sys.platform == "darwin":
        library = ctypes.CDLL(None)
        task = ctypes.c_uint.in_dll(library, "mach_task_self_").value
        info = (ctypes.c_uint64 * 32)()
        count = ctypes.c_uint(64)
        if library.task_info(task, 20, ctypes.byref(info), ctypes.byref(count)) != 0:
            raise OSError("own task_info failed")
        return info[1]  # MACH_TASK_BASIC_INFO.resident_size, bytes (not lifetime maximum).
    return int(Path("/proc/self/statm").read_text().split()[1]) * os.sysconf("SC_PAGE_SIZE")


directory = Path(os.environ["LVRTC_POOL_MEMORY_DIR"])
target = directory / f"{os.getpid()}.json"
temporary = target.with_suffix(".tmp")
peak = 0


def report(exited=False):
    global peak
    rss = rss_bytes()
    high = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss * (1 if sys.platform == "darwin" else 1024)
    peak = max(peak, rss, high)
    temporary.write_text(json.dumps({"pid": os.getpid(), "parent": os.getppid(), "rssBytes": rss,
                                     "peakRssBytes": peak, "exited": exited}))
    temporary.replace(target)


def heartbeat():
    while not stopped.wait(0.25):
        report()


stopped = threading.Event()
report()
thread = threading.Thread(target=heartbeat, daemon=True)
thread.start()


def finish():
    stopped.set()
    thread.join()
    report(exited=True)


atexit.register(finish)
arguments = sys.argv[1:]
if arguments[0] == "-m":
    sys.argv = arguments[1:]
    runpy.run_module(arguments[1], run_name="__main__", alter_sys=True)
else:
    sys.argv = arguments
    runpy.run_path(arguments[0], run_name="__main__")
