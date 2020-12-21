import fs from 'fs-extra';
import { join } from 'path';
import { exec } from 'child_process';
import axios from 'axios';
import gitP, { SimpleGit } from 'simple-git/promise';

async function cloneAll(user: string) {
  const git: SimpleGit = gitP();
  const res = await axios.get(`https://api.github.com/users/${user}/repos`, {
    params: { per_page: 1000 },
  });
  res.data.forEach((item: any) => {
    const path = `/Users/tom/Documents/GitHub/${item.full_name}`;
    if (!fs.existsSync(path)) {
      git.clone(item.clone_url, path);
    }
  });
}

// cloneAll('react-component');

const path = '/Users/tom/Documents/GitHub/react-component';

const dependencies = Object.keys(
  fs.readJSONSync('/Users/tom/Documents/GitHub/ant-design/package.json')
    .dependencies,
);

async function createBranch() {
  fs.readdirSync(path).forEach(async (item) => {
    const packagePath = join(path, item, 'package.json');
    if (fs.existsSync(packagePath)) {
      const content = fs.readJSONSync(packagePath);
      if (
        content.peerDependencies &&
        content.peerDependencies['react-dom'] &&
        content.peerDependencies['react-dom'] !== '*' &&
        dependencies.indexOf(content.name) > -1
      ) {
        // const git: SimpleGit = gitP(join(path, item));
        // await git.checkoutLocalBranch('react17');
        // content.peerDependencies = {};
        // content.peerDependencies['react'] = '>=16.9.0';
        // content.peerDependencies['react-dom'] = '>=16.9.0';
        // fs.writeJSONSync(packagePath, content, { spaces: 2 });
        // await git.add('./*');
        // await git.commit('chore: support react 17');
        // await git.push('origin', 'react17');
        // exec(
        //   'gh pr create --title "chore: support react 17" --body "https://github.com/ant-design/ant-design/issues/26136"',
        //   {
        //     cwd: join(path, item),
        //   },
        // );
      }
    }
  });
}

// createBranch();
