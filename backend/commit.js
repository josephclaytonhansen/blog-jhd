import {
  execSync
} from "child_process"
import {
  Octokit
} from "@octokit/rest"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
dotenv.config()

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

function parse(filename, data) {
  const lines = data.split('\n');
  const todos = lines
    .map((line, index) => {
      const match = line.match(/\s*\/\/ TODO: (.*)/)
      let fil = filename.split('blog-jhd')[1]
      if (match) {
        return {
          tag: 'TODO',
          text: match[1],
          line: index + 1,
          file: fil,
        };
      }
    })
    .filter(Boolean);
  return todos;
}

console.log(`Current working directory: ${process.cwd()}`);

const owner = "josephclaytonhansen";
const repo = "blog-jhd";

function fromDir(startPath, filter, callback) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      if (filename.includes('/node_modules')) {
        continue; // Skip node_modules directory
      }
      fromDir(filename, filter, callback); //recurse
    } else if (filename.indexOf(filter) >= 0 && !filename.endsWith('commit.js')) {
      fs.readFile(filename, "utf8", (err, data) => {
        if (err) {
          console.error(err)
          return
        }

        const todos = parse(filename, data)
        console.log(`Found ${todos.length} TODOs in ${filename}`)

        todos.forEach(async (todo) => {
          if (todo.tag === "TODO") {
            const title = `TODO: ${todo.text}`;

            // Fetch the list of open issues
            const {
              data: issues
            } = await octokit.issues.listForRepo({
              owner,
              repo,
              state: 'open',
            });

            // Check if an issue with the same title already exists
            const existingIssue = issues.find(issue => issue.title === title);

            if (!existingIssue) {
              console.log(`Creating issue for TODO: ${todo.text}`);
              octokit.issues.create({
                owner,
                repo,
                title,
                body: `This issue is automatically created by a build script.\n\nFile: ${todo.file}\nLine: ${todo.line}\nDescription: ${todo.text}`,
              });
            } else {
              console.log(`Skipping issue for TODO: ${todo.text} as it already exists.`);
            }
          }
        })
      })
    }
  }
}

fromDir(path.resolve(process.cwd(), '..'), '.js', function (filename) {
  console.log('-- found: ', filename);
})

const date = new Date()
const formattedDate = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
const commitMessage = `buildbot: ${formattedDate}`
execSync(
  `git add . && git commit --allow-empty -m "${commitMessage}" && git push`, {
    stdio: "inherit"
  },
)