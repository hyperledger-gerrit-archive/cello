# Contribution
Any kind of contribution is encouraged, e.g., bug fix and question report.

Before taking actions, we highly recommend reading the [docs](../README.md).

## Jira board usage

We are using [Jira](https://jira.hyperledger.org/projects/CE) to track the project progress, and welcome to report bug issues or create to-do tasks there.

Task items may have 4 status:

* `To Do`: Available for picking.
* `In Progress`: Picked by someone (check the assignee) to work on.
* `Under Review`: Related patchset has been submitted for review.
* `Done`: Patchset merged, the item is done.

So If you want to contribute, create or find some `To Do` item, and assign it to yourself, then update the status to `In Progress`. Remember to mark it to `Under Review` and `Done` when the patch is submitted and merged.

## Questions and discussions

* [Chat](https://chat.hyperledger.org/channel/cello): technical discussions and questions.

## Code Commit Steps

The project employs [Gerrit](https://gerrit.hyperledger.org) as the code commit/review system.

*Before committing code, please go to [Jira](https://jira.hyperledger.org/projects/CE) to create a new task or check if there's related existing one, then assign yourself as the assignee. Notice each task will get a jira number like [CE-2](https://jira.hyperledger.org/browse/CE-2).*

* Clone the project to your working directory with your Linux Foundation ID (`LFID`). If you do not have LFID, can [apply one](https://identity.linuxfoundation.org).

```sh
$ git clone ssh://LFID@gerrit.hyperledger.org:29418/cello && scp -p -P 29418 LFID@gerrit.hyperledger.org:hooks/commit-msg cello/.git/hooks/
```

(Optionally) Config your git name and email if not setup previously.

```sh
$ git config user.name "your name"
$ git config user.email "your email"
```

(Optionally) Setup git-review by inputting your LFID. Notice this is only necessary once.
```sh
$ git review -s
```

* Assign yourself a `To Do` jira task, mark it as `In progress`, then create a branch with the jira task number off of your cloned repository, e.g., for CE-2, it can be:

```sh
$ cd cello
$ git checkout -b CE-2
```

* After modifying the code, run `make check` to make sure all the checking is passed. Then Commit your code with `-s` to sign-off, and `-a` to automatically add changes (or run `git add .` to include all changes manually).

```sh
$ make check
  ...
  py27: commands succeeded
  py30: commands succeeded
  py35: commands succeeded
  flake8: commands succeeded
  congratulations :)

$ git commit -s -a
```

Example commit msg may look like:

```sh
[CE-2] A short description of your change with no period at the end

You can add more details here in several paragraphs, but please keep each line
width less than 80 characters. A bug fix should include the issue number.

Fix https://jira.hyperledger.org/browse/CE-2.

Change-Id: IF7b6ac513b2eca5f2bab9728ebd8b7e504d3cebe1
Signed-off-by: Your Name <committer@email.address>
```

* Submit your commit using `git review`, and mark the corresponding jira item as `Under Review`.

```sh
$ git review
```

After the patchset is uploaded successfully and ci checking passed, open [Gerrit Dashboard](https://gerrit.hyperledger.org/r/#/dashboard/self) to invite [reviewers](https://wiki.hyperledger.org/projects/cello#contributors) for review. The patch will be merged into the `master` branch after passing the review, then mark the jira item as `Done`.

* If you need to refine the patch further as the reviewers may suggest, you can change on the same branch, and commit the new code with `git commit -a --amend`, and then use the `git review` command again.
