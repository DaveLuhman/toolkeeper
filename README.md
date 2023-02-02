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

This is a full-stack web application built with NodeJS and Express that allows an contractor to manage their tool crib.

## Features

- Add and archive tools
- Search for tools by serial number, barcode, in/out status, or service assignment
- Checkout and check-in tools to/from service assignments (employees, vehicles, or jobsites)
- Generate reports on tool usage and inventory levels (coming soon...)

## Technologies Used

- NodeJS
- Express
- MongoDB (for database management)
- TailwindCSS + DaisyUI (for styling)

## Getting Started

### Prerequisites

- NodeJS 19+
- MongoDB to point the server at (docker-compose is on the roadmap)

### Installation

1. Clone the repository to your local machine

`git clone https://github.com/DaveLuhman/toolkeeper.git`

2. Install the dependencies

`npm install`

3. Start the server

`npm start`

4. Open a web browser and navigate to http://localhost:3000

## For Developers

### Logging Conventions:

`console.log()` - Only used during development, replaced with `console.info()`, `console.warn()`, or `console.error()` if being left into production versions of the site. This allows devs to use `console.log()` as needed during development without worrying about these conventions. Once a feature branch is ready to be submitted for PR, devs can search their local branch for `console.log()` and add prefixes/colors/etc and replace `.log()` with the appropriate alternative.

###Console Prefixes
`[AUTH]` - Part of the auth chain
`[MW]` - Part of a middleware function

### MW Entries

'middlewareName-in/out-index' is the convention, e.g. `[MW] createUser-in` would indicate the stack is entering the createUser middleware, and `[MW] getTools-out-3` would indicate the stack is exiting the getTools middleware at the third `next()` call

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
