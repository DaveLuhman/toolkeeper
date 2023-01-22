# ToolKeeper
Tool Crib Web Application

Logging Conventions
console.log() - Only used during development, replaced with console.info(), console.warn(), or console.error() if being left into production versions of the site. This allows devs to use console.log() as needed during development without abiding these conventions. Once a feature branch is ready to be submitted for PR, devs can search their local branch for console.log() and add prefixes/colors/etc and replace .log() with the appropriate method.
Console Prefixes
[AUTH] - Part of the auth chain
[MW] - Part of a middleware function

MW Entries
[MW] 'middlewareName-in/out-index' is the convention, e.g. [MW] createUser-in would indicate the stack is entering the createUser middleware, and [MW] getTools-out-3 would indicate the stack is exiting the getTools middleware at the third next() call

Color Designations:
.red - error
.yellow - like no parameters submitted or no search results found
.bgBlue.white - entering middleware
.bgWhite.blue - exiting middleware
## Design Document
Click here to view the [design documentation](designDocument/index.md)