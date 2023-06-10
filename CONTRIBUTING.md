# Development

Use **node 18+**.

Install prerequisites once: `bash bin/install.sh`.

To serve the library locally on port 8081 run `bash bin/serve.sh`.

Make sure your code is compiled (run `bash bin/compile.sh` to start compilation in watch mode; if you've changed a file that isn't a typescript file, you have to re-run this command).

> **Tip:** You may use `npm start` to combine those two commands.

## Code minification

To minify files run `bash bin/minify.sh` script.

## Code linting

Use `npm run lint` to lint the code.

## Testing

To run unit tests use `npm run test` or `npm run coverage` command from the project root.

This repository contains example projects covered with end-to-end tests.
To run them continuously use `npm run cypress`.
Run `npm run e2e` to run e2e tests in headless Chrome.

## Pre-commit

If you've run the install script, the hook should be already in place.
To add the git hook to the project manually, run the following command from the project root:

```bash
ln -s ../../bin/pre-commit.sh .git/hooks/pre-commit
```
