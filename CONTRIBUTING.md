# Contributing

Welcome, and thanks for thinking about contributing back to our project. Before you get started please read through the following.

## Code of Conduct

Please read and adhere to our [code of conduct](CODE_OF_CONDUCT.md).

## Bugs

If you think you've found a bug, please check our github issues page and verify it hasn't already been logged, then create a new issue using our bug template. Even better, submit a PR, with details about the issue/fix.

## Feature Requests

Got an idea for a feature? Add it to our github issues page using the feature template. Please note, our maintainers only have a limited amount of time to develop new features, and not every idea fits into the scope of the project. Unfortunately we can't say yes to everything. If you'd also like to work on a proposed feature, let us know let us know in advance so we can coordinate work.

## Pull Requests

### Testing

PRs for new features won't be accepted without unit tests. We don't aim for 100% code coverage, but PRs with better coverage are more likely to be accepted. All tests must pass for the PR to be accepted.

### Compilation/Linting

Our CI performs linting/compiling/autoformatting checks, all PRs must past these checks before being accepted.

### Commit Messages

Commit messages should follow conventional changelog format. For more info see [DEVELOPER.md](DEVELOPER.md). Your commits must conform to this before your PR will be accepted.

### Third party dependencies

We take a cautious approach to adding dependencies, (particularly non development dependencies) to the project. If you are planning on adding a feature with a new dependency, notify us in advance on the github issue.
