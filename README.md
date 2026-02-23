# planar-echo
Tools to decompile InfinityEngine into json and convert the json into games running on custom engine


## planar-prism

Tool to decompile InfinityEngine binary files to json.

This tool is an entry point to the whole process, but it does not work without official game binaries. Buy the official game and pass its data into the planar-prism to create a planar-ghost.

This tool is licensed under repository license.


## planar-ghost

This is an intermediate result of the planar-prism pipe. This folder is empty by default and will be filled with jsons from planar-prism.

These data must be threated in the same way, as the original game binary data is, because these data is its derivative form. In other words, these data inherits game license, not repository license.


## planar-shell

Custom engine to run the planar-ghost data.

This is React engine, that may run pregenerated data as a web app. That means, it can be run on linux, mac, windows, android devices.

This tool is licensed under repository license.
