import { execSync } from "child_process"
import { Octokit } from "@octokit/rest"
import { parse } from "leasot"
import fs from "fs"
import path from "path"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

console.log(`Current working directory: ${process.cwd()}`);

const owner = "josephclaytonhansen";
const repo = "blog-jhd";

function fromDir(startPath, filter, callback){
  if (!fs.existsSync(startPath)){
      console.log("no dir ", startPath);
      return;
  }

  const files = fs.readdirSync(startPath);
  for(let i=0;i<files.length;i++){
      const filename=path.join(startPath,files[i]);
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
          fromDir(filename,filter,callback); //recurse
      }
      else if (filename.indexOf(filter)>=0) {
          fs.readFile(filename, "utf8", (err, data) => {
              if (err) {
                  console.error(err)
                  return
              }

              const todos = parse(data)

              todos.forEach((todo) => {
                  if (todo.tag === "TODO") {
                      console.log(`Creating issue for TODO: ${todo.text}`)
                      octokit.issues.create({
                          owner,
                          repo,
                          title: `TODO: ${todo.text}`,
                          body: `This issue is automatically created by a build script.\n\nFile: ${todo.file}\nLine: ${todo.line}\nDescription: ${todo.text}`,
                      })
                  }
              })
          });
      }
  }
}

fromDir(process.cwd(), '.js', function(filename){
  console.log('-- found: ',filename);
});
const date = new Date()
const formattedDate = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`
const commitMessage = `buildbot: ${formattedDate}`
execSync(
  `git add . && git commit --allow-empty -m "${commitMessage}" && git push`,
  { stdio: "inherit" },
)


