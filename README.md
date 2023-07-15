# GitHub Project Summary

This GitHub project is a GitHub App built with Probot. It utilizes the Probot framework to perform a specific function. The main functionality of the app is to listen for two types of events: "issue_comment.created" and "pull_request.opened". 

When one of these events is triggered, the app executes the following steps:

1. Log a message indicating that the app has been loaded.
2. Check if the comment or commit message contains a specific command ("/execute").
3. If the command is detected, retrieve the code from the pull request.
4. Execute the retrieved code using the Piston API.
5. Post the output of the executed code as a comment on the pull request.

The project includes the following key components:

## `getCodeFromPullRequest`:
A function that retrieves the code from a pull request using the GitHub REST API.

## `executeCodeWithPiston`:
A function that executes the retrieved code using the Piston API.

## `createCommentOnPullRequest`:
A function that creates a comment on the pull request using the GitHub REST API.

The project utilizes the `axios` library for making HTTP requests to the GitHub API and the `piston-client` library for interacting with the Piston API.

To set up and run the app, follow these steps:

### Install dependencies
`npm install`

### Run the bot
`npm start`






