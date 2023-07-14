const axios = require("axios");

module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");

  app.on(["issue_comment.created", "pull_request.opened"], async (context) => {
    const { comment, pull_request } = context.payload;

    // Check if the comment or commit message contains the specific command ("/execute")
    if (comment && comment.body.includes("/execute")) {
      // Retrieve the code from the pull request
      const code = await getCodeFromPullRequest(context, pull_request);

      // Execute the code using the Piston API
      const output = await executeCodeWithPiston(code);

      // Post the output as a comment on the pull request
      await createCommentOnPullRequest(context, pull_request, output);
    }
  });

  async function getCodeFromPullRequest(context, pull_request) {
    // Retrieve the files modified in the pull request
    const { data: files } = await context.octokit.pulls.listFiles({
      owner: context.repo().owner,
      repo: context.repo().repo,
      pull_number: pull_request.number,
    });

    // Retrieve the content of the first code file
    if (files.length > 0) {
      const file = files[0];
      const { data: fileContent } = await context.octokit.repos.getContent({
        owner: context.repo().owner,
        repo: context.repo().repo,
        path: file.filename,
        ref: pull_request.head.sha,
      });
      return Buffer.from(fileContent.content, "base64").toString();
    }

    return null;
  }

  async function executeCodeWithPiston(code) {
    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: "javascript",
        source: code,
      });
      return response.data.stdout || response.data.stderr || "";
    } catch (error) {
      app.log.error("Error executing code with Piston API:", error);
      return "";
    }
  }

  async function createCommentOnPullRequest(context, pull_request, comment) {
    await context.octokit.issues.createComment({
      owner: context.repo().owner,
      repo: context.repo().repo,
      issue_number: pull_request.number,
      body: comment,
    });
  }
};
