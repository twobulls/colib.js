# Developer

## Environment Dependencies

- yarn ^1.12.1
- git
- bash
- node 10

## Development

Install dependencies

```bash
yarn install
```

To run the build:

```bash
yarn build
```

To run the build in watch mode:

```bash
yarn build-watch
```

To run tests:

```bash
yarn test
```

To run tests in watch mode:

```bash
yarn test-watch
```

To lint the build:

```bash
yarn lint
```

## Debugging

If you are using VSCode, you can debug tests by running the "Jest All" or "Jest Current File" commands in the debug menu. Also, if you are using the 'orta.vscode-jest' plugin, you can debug tests inline using the '>Jest: Start Runner' command.

## Commits

This project uses conventional changelog and commitizen. These libraries help us build changelogs, and adhere to semantic versioning conventions. When you are ready to commit, stage your changes and then use the following command:

```bash
yarn commit
```

If you prefer to use regular git just make sure your commits follow the [conventional changelog pattern](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines). We use a git post-commit hooks to guarantee the commit follows the correct pattern.
