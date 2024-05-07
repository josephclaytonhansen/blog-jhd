import {
  execSync
} from "child_process"
import {
  Octokit
} from "@octokit/rest"
import fs from "fs"
import path from "path"
import fetch from "node-fetch";
import dotenv from "dotenv"
dotenv.config()

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    fetch: fetch,
  },
})

if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_TOKEN.length) {
  console.error("GITHUB_TOKEN environment variable is required.")
  process.exit(1)
}

const owner = "josephclaytonhansen"
const repo = "blog-jhd"

const {
  data: issues
} = await octokit.issues.listForRepo({
  owner,
  repo,
  state: 'open',
})

if (!issues) {
  console.error("Failed to fetch issues.")
  process.exit(1)
}

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

console.log(`Current working directory: ${process.cwd()}`)

async function fromDir(startPath, filters, callback) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      await fromDir(filename, filters, callback)
    } else if (filters.some(filter => filename.indexOf(filter) >= 0) && !filename.endsWith('commit.js')) {
      try {
        const data = fs.readFileSync(filename, "utf8");

        const todos = parse(filename, data)

        for (const todo of todos) {
          if (todo.tag === "TODO") {
            const title = `TODO: ${todo.text}`;

            const existingIssue = issues.find(issue => issue.title === title && issue.state === 'open');

            if (!existingIssue && todo.file.indexOf('node_modules') === -1 || todo.file.indexOf('.git') === -1 && todo.file.indexOf('.nuxt') === -1 && todo.file.indexOf('.output') !== -1) {
              console.log(`Creating issue for TODO: ${todo.text}`);
              await octokit.issues.create({
                owner,
                repo,
                title,
                body: `This issue is automatically created by a build script.\n\nFile: ${todo.file}\nLine: ${todo.line}\nDescription: ${todo.text}`,
              });

              await new Promise(resolve => setTimeout(resolve, 1000));
            } else if (existingIssue) {
              console.log(`Skipping issue for TODO: ${todo.text} as it already exists.`);
            }
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}

await fromDir(path.resolve(process.cwd(), '..'), ['.js', '.vue', '.ts'], function (filename) {
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