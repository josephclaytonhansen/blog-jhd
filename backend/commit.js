import { execSync } from "child_process"
import { Octokit } from "@octokit/rest"
import { parse } from "leasot"
import fs from "fs"
import { glob } from "glob"

const date = new Date()
const formattedDate = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
const commitMessage = `buildbot: ${formattedDate}`

execSync(
  `git add . && git commit --allow-empty -m "${commitMessage}" && git push`,
  { stdio: "inherit" },
)

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Make sure to set this environment variable
})

const owner = "josephclaytonhansen";
const repo = "blog-jhd";

glob("**/*.js", (err, files) => {
  if (err) {
    console.error(err);
    return
  }

  files.forEach((file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      const todos = parse(data)

      todos.forEach((todo) => {
        if (todo.tag === "TODO") {
          octokit.issues.create({
            owner,
            repo,
            title: `TODO: ${todo.text}`,
            body: `This issue is automatically created by a build script.\n\nFile: ${todo.file}\nLine: ${todo.line}\nDescription: ${todo.text}`,
          })
        }
      })
    })
  })
})