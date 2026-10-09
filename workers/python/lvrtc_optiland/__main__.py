"""``python -m lvrtc_optiland``: the optiland worker on the standard streams.

The order matters and is the whole of this module: the caches are pointed away from optiland and the reply stream
is reserved at the level of its file descriptor **before** anything of optiland, numpy or numba is imported; only
then is the engine loaded. Whatever those print or warn about while they load, or later, goes to the log.

``--identity`` prints the engine's identity as one line of JSON and exits: 0 when optiland could be loaded, 1 with
the reason on the standard error when it could not.
"""

from __future__ import annotations

import json
import os
import sys

from lvrtc_worker_kit.protocol import parse_json, protect_stdout, serve_stdio

from .hygiene import CacheDirs, HygieneError, prepare

OPTIONS_VARIABLE = "LVRTC_ENGINE_OPTIONS"
"""The environment variable that holds the engine's configured options, as JSON text. The engine has none."""


def main(argv: list[str] | None = None) -> int:
    arguments = sys.argv[1:] if argv is None else argv
    if any(argument != "--identity" for argument in arguments):
        print("usage: python -m lvrtc_optiland [--identity]", file=sys.stderr)
        return 2
    text = os.environ.get(OPTIONS_VARIABLE, "")
    try:
        options = parse_json(text) if text != "" else {}
    except ValueError:
        options = None
    if options != {}:
        print(f"lvrtc_optiland: {OPTIONS_VARIABLE} must be {{}}: the engine optiland has no options", file=sys.stderr)
        return 2

    dirs: CacheDirs | HygieneError
    try:
        dirs = prepare()
    except HygieneError as error:
        # Nothing of optiland is imported then: the worker stays a worker and says why to every hello.
        dirs = error
    replies = protect_stdout()
    from .engine import UnavailableEngine, load_engine, refused_engine  # noqa: PLC0415 - after the two above

    engine = refused_engine(dirs) if isinstance(dirs, HygieneError) else load_engine(dirs)
    if arguments:
        if isinstance(engine, UnavailableEngine):
            print(engine.reason, file=sys.stderr)
            return 1
        line = json.dumps(engine.describe()["identity"], sort_keys=True, separators=(",", ":"), allow_nan=False)
        replies.write(line.encode("ascii") + b"\n")
        replies.flush()
        return 0
    return serve_stdio(engine, replies=replies)


if __name__ == "__main__":
    sys.exit(main())
