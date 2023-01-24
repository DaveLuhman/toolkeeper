<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="public\img\toolKeeperLogo-light-full.png">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  </div>
# ToolKeeper - A Tool Crib Management System


## Introduction

This is a full-stack web application built with NodeJS and Express that allows an electrical contractor to manage their tool crib inventory.

## Features

- Add and remove tools from inventory
- Checkout and check-in tools to/from employees
- Generate reports on tool usage and inventory levels
- Search for tools by name or category

## Getting Started

1. Clone the repository to your local machine

``git clone https://github.com/[username]/tool-crib-manager.git``

2. Install the dependencies

``npm install
``

3. Start the server

`npm start`

4. Open a web browser and navigate to http://localhost:3000

## Technologies Used

- NodeJS
- Express
- MongoDB (for database management)
- Bootstrap (for styling)

## For Developers
### Logging Conventions:
`console.log()` - Only used during development, replaced with `, `, or`if being left into production versions of the site. This allows devs to use ` as needed during development without abiding these conventions. Once a feature branch is ready to be submitted for PR, devs can search their local branch for ` and add prefixes/colors/etc and replace ` with the appropriate method.
Console Prefixes
` - Part of the auth chain
` - Part of a middleware function

### MW Entries
` 'middlewareName-in/out-index' is the convention, e.g. ` would indicate the stack is entering the createUser middleware, and ` would indicate the stack is exiting the getTools middleware at the third ` call

### Color Designations:
.red - error
.yellow - like no parameters submitted or no search results found
.bgBlue.white - entering middleware
.bgWhite.blue - exiting middleware



## Contributing

We welcome contributions to this project. If you are interested in contributing, please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).