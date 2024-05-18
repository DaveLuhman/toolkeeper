<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://toolkeeper.dev.ado.software">
    <img src="src\public\img\toolKeeperLogo-light-full.png">
  </a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-on">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]][product-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Introduction

This is a full-stack web application built with NodeJS and Express that allows an contractor to manage their tool crib. Currently at v1.1.6

## Features

- Add and archive tools (No-Deletion Philosophy)
- Search for tools by a variety of fields
- Add and delete service assignments (employees, vehicles, or jobsites)
- Checkout and check-in tools to/from service assignments (employees, vehicles, jobsites, and stockrooms)
    - Status Assignments are set via service assignment type.
- Users can set personal theme and sorting preferences
- Generate reports on tool usage and inventory levels (coming soon...)

## Technologies Used

- NodeJS
- Express
- MongoDB (mongoose)
- TailwindCSS + DaisyUI (for styling)

## Getting Started

### Prerequisites

- NodeJS 19+
- MongoDB Target

### Docker-Compose
1. In the repo, there is a docker-compose folder. Either download, or copy the contents of both the docker-compose.yml and compose.env to the same folder on your local machine.
2. Edit the contents of the .env file to your environment
3. In a terminal, run `docker compose up -d` to start the containers.

Note: This is configured with /data/db and /data/configdb persistent storage volumes. No secrets are left unencrypted at rest, other than in your .env file.

### Node.js Native
#### Note: this assumes you have your own MongoDB to point TK at.
1. Clone the `master` branch either from the GH repo [Link](https://github.com/DaveLuhman/toolkeeper) or via terminal
	`git clone https://github.com/DaveLuhman/toolkeeper.git`

2. Duplicate the .env.sample file and fill in the details to match your environment
	a. note the .env file in the monorepo is in ./src/config/.env

3. In a terminal, run `npm ci` to perform a clean install of the node dependancies
4. Next, we'll run `npm run build:css` to build the tailwind CSS files
5. Finally, we'll run `npm start` to start the services

## For Developers

### Logging Conventions:

`console.log()` - Only used during development, replaced with `console.info()`, `console.warn()`, or `console.error()` if being left into production versions of the site. This allows devs to use `console.log()` as needed during development without worrying about these conventions. Once a feature branch is ready to be submitted for PR, devs can search their local branch for `console.log()` and add prefixes/colors/etc and replace `.log()` with the appropriate alternative.

### Console Prefixes
`[AUTH]` - Part of the auth chain
`[MW]` - Part of a middleware function

### MW Entries

'middlewareName-in/out-index' is the convention, e.g. `[MW] createUser-in` would indicate the stack is entering the createUser middleware, and `[MW] getTools-out-3` would indicate the stack is exiting the getTools middleware at the third `next()` call

### Route URL Naming Convention

`/model/verb/[id]` is the convention, e.g. `/tools/create` would indicate the route is for creating a new tool, and `/tools/update/123456789` would indicate the route is for updating a tool with the id of 123456789

### Route Prefixes

`[GET]` - GET request
`[POST]` - POST request


### Colorful Logs:

<ul>
<li><font color="red">.red</font> - Error messages</li>
<li><font color="green">.green</font> - Success messages</li>
<li><font color="yellow">.yellow</font> - warnings like no parameters submitted or no search results found</li>
<li><span style="color: blue; background-color: white;">.bgBlue.white</span> - entering middleware</li>
<li><span style="color: white; background-color: blue;">.bgWhite.blue</span> - exiting middleware</li>
</ul>

## Contributing

We welcome contributions to this project. If you are interested in contributing, please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/DaveLuhman/toolkeeperDesign.svg?style=for-the-badge
[contributors-url]: https://github.com/DaveLuhman/toolkeeperDesign/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/DaveLuhman/toolkeeperDesign.svg?style=for-the-badge
[forks-url]: https://github.com/DaveLuhman/toolkeeperDesign/network/members
[stars-shield]: https://img.shields.io/github/stars/DaveLuhman/toolkeeperDesign.svg?style=for-the-badge
[stars-url]: https://github.com/DaveLuhman/toolkeeperDesign/stargazers
[issues-shield]: https://img.shields.io/github/issues/DaveLuhman/toolkeeperDesign.svg?style=for-the-badge
[issues-url]: https://github.com/DaveLuhman/toolkeeperDesign/issues
[license-shield]: https://img.shields.io/github/license/DaveLuhman/toolkeeperDesign.svg?style=for-the-badge
[license-url]: https://github.com/DaveLuhman/toolkeeperDesign/blob/master/LICENSE.txt
[product-screenshot]: ./src/public/img/dashboardScreenshot.png
[product-url]: https://toolkeeper.dev.ado.software
[nodejs-shield]: https://img.icons8.com/color/512/nodejs.png
