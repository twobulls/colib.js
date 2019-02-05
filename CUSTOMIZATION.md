# Customization

Follow this guide to start a new open source project.

- [ ] Clone the project

  ```bash
    git clone git@github.com:twobulls/nyc-frontend-library-template.git
  ```

- [ ] Clear/recreate the git repository

  This is so the project history is clean. Since our changelogs are generated from git history, it's important that we keep the history clean.

  ```bash
  rm -rf .git
  git init
  git add .
  git commit
  ```

- [ ] Create a new project in github

  Make sure you set the language as typescript and the organization as Two Bulls. Leave the repository for now as private.

- [ ] Turn on Vulnerability Alerts

  Under github project settings -> data services, make sure that vulnerability alerts are turned on.

- [ ] Upload the project to github

  ```bash
  git remote add origin git@github.com:twobulls/{your-repo-name-here}
  git push origin master
  ```

- [ ] Customize the docs

  Update the README with basic details about your project/project name. For now, leave usage fields blank, but you should come back and fill it out before making the project public. Update the badges with your repository name.

- [ ] Update the package.json

  Set the repository url, the project name, and description.

- [ ] Develop your library

  Get your library to an MVP version that you are comfortable making public.

- [ ] Make your project public on Github
- [ ] Set up CI

  We use cloud.drone.io for CI/CD. Enable the repository on drone.

- [ ] Set up NPM and github publish secrets

  Next you will need to generate an NPM token and a github token for publishing. A shorthand way to do that with the correct permissions is:

  ```bash
  npx semantic-release-cli
  ```

  Follow the prompts, (it will ask you for your github and npm logons then create tokens for you). When it gets to the CI step, select 'Other'. Then go into drone, add the github token as `publish_github_token` and the npm token as `npm_token`. Make sure the secrets are **disabled** for pull requests.

- [ ] Set up Danger github secret

  Danger.js is used to write feedback into github PRs. We need to create a second locked down token with just the 'public_repo' scope. Create the token [here](https://github.com/settings/tokens/new). Add the token to drone as `danger_github_token`. This token should be **enabled** for pull requests.

- [ ] Add Greenkeeper.io

  Greenkeeper.io automatically submits pull requests to update dependencies to their latest version, and warns you about breaking changes with your dependencies. You can add it from the GitHub marketplace.

- [ ] Delete this file
