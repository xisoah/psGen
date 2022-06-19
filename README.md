# psGen

psGen is a small tool that generates powershell encoded payloads for use with Out-of-Band testing.
This tool was mainly made to save time spent on manually crafting payload and encoding them whenever a different uri and command is used.

Installation
----

You can download psgen by cloning the [Git](https://github.com/xisoah/psGen) repository:

    git clone https://github.com/xisoah/psGen.git

psGen is built on NodeJS and requires a few modules before it can be used:

    npm install

Usage
----

To get a list of basic options:

    node psgen.js -h

To get detailed information about the input arguments:

    node psgen.js -h [arg]

Full example:

    node psgen.js -m dns -c 2 -l 10 -u [interaction uri here]

The encoded payload is automatically copied to the clipboard once generated.

Decode
----

The repository has an extra script decode.js which accepts a text file containing DNS interactions from [Interact-sh](https://github.com/projectdiscovery/interactsh) as input and produces the decoded output from the OOB session. 

Usage:

    node decode.js output.txt

Todo
----

1) Refactor code with yargs
2) decode.js assumes interactions are in sequence and no sorting takes place
3) Add more stuff to psgen
