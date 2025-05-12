const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const input = document.getElementById("command");
const typeSound = document.getElementById("typeSound");

let history = [];
let historyIndex = 0;
let currentPath = ["home", "sam"];

// Simulated file system
const fileSystem = {
  home: {
    sam: {
      about: "I'm Sam Sundar — B.Tech CSE student with a love for cybersecurity, CTFs, and building cool projects.",
      skills: `Languages: HTML, CSS, Python, SQL, Java, MongoDB
Frameworks: React.js, Django, Metasploit
Other: AWS, Linux, Bash scripting`,
      projects: `1. Cloud Privacy with Blockchain
2. ML + AES Encryption
3. MERN-PHP AWS Integration`
    }
  }
};

// Get current directory object from path array
function getDir(pathArray) {
  let dir = fileSystem;
  for (let part of pathArray) {
    if (dir[part] && typeof dir[part] === "object") {
      dir = dir[part];
    } else {
      return null;
    }
  }
  return dir;
}

// Get current path prompt
function getPrompt() {
  return `sam@linux:/${currentPath.join("/")}$`;
}

// Execute commands
function runCommand(cmd) {
  const fullPrompt = `${getPrompt()} ${cmd}`;
  output.innerHTML += `<div>${fullPrompt}</div>`;

  const args = cmd.trim().split(" ");
  const base = args[0].toLowerCase();
  const dir = getDir(currentPath);

  if (base === "clear") {
    output.innerHTML = "";
    return;
  }

  switch (base) {
    case "ls":
      if (dir && typeof dir === "object") {
        output.innerHTML += `<div>${Object.keys(dir).join("  ")}</div>`;
      } else {
        output.innerHTML += `<div>ls: not a directory</div>`;
      }
      break;

    case "cd":
      const folder = args[1];
      if (!folder) {
        output.innerHTML += `<div>Usage: cd &lt;directory&gt;</div>`;
        break;
      }
      if (folder === "..") {
        if (currentPath.length > 1) currentPath.pop();
      } else if (dir && dir[folder] && typeof dir[folder] === "object") {
        currentPath.push(folder);
      } else if (dir && dir[folder] && typeof dir[folder] === "string") {
        output.innerHTML += `<div>cd: '${folder}' is a file, not a directory</div>`;
      } else {
        output.innerHTML += `<div>cd: no such directory: ${folder}</div>`;
      }
      break;

    case "cat":
      const file = args[1];
      if (!file) {
        output.innerHTML += `<div>Usage: cat &lt;file&gt;</div>`;
        break;
      }
      if (dir && dir[file] && typeof dir[file] === "string") {
        output.innerHTML += `<div>${dir[file]}</div>`;
      } else {
        output.innerHTML += `<div>cat: no such file: ${file}</div>`;
      }
      break;

    case "help":
      output.innerHTML += `<div>Available commands:
- ls
- cd &lt;dir&gt;
- cd ..
- cat &lt;file&gt;
- clear
- help</div>`;
      break;

    default:
      output.innerHTML += `<div>Command not found: ${base}</div>`;
      break;
  }

  input.value = "";
  terminal.scrollTop = terminal.scrollHeight;
}

// Handle key events
input.addEventListener("keydown", (e) => {
  typeSound.play();

  if (e.key === "Enter") {
    const command = input.value.trim();
    if (command) {
      history.push(command);
      historyIndex = history.length;
      runCommand(command);
    }
  }

  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  }

  if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      input.value = "";
    }
  }
});
