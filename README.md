<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
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
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<div align="center">
    <img src="src\public\img\dashboardScreenshot.png" width="65%">
  </div>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Introduction

This is a full-stack web application built with NodeJS and Express that allows an contractor to manage their tool crib. Currently at v1.1.6

## Features

- Add and archive tools (No-Deletion Philosophy)
   - Add tools individually from anywhere, or batch import tools to save time
- Search for tools by a variety of fields
- Add and delete service assignments (employees, vehicles, or jobsites)
- Checkout and check-in tools to/from service assignments (employees, vehicles, jobsites, and stockrooms)
    - Status is derived via service assignment type.
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

3. In a terminal, run `bun install` to perform a clean install of the node dependancies
4. Next, we'll run `bun run build:css` to build the tailwind CSS files
5. Finally, we'll run `bun start` to start the services

## License

ToolKeeper is released under the MIT License. However, the exclusive rights to host it for SAAS resale are retained by the author. Others can self-host and use it or run it locally, but not resell hosting without meaningfully changing it first.

## Contributing

Contributions are welcome! Please submit issues or pull requests on [GitHub](https://github.com/daveluhman/toolkeeper). Here's a template for submitting issues or pull requests:

### Issue Template

Description
A clear and concise description of what the issue is.

Steps to Reproduce
Steps to reproduce the behavior:

Go to '...'
Click on '...'
Scroll down to '...'
See error
Expected behavior
A clear and concise description of what you expected to happen.

Screenshots
If applicable, add screenshots to help explain your problem.

Additional context
Add any other context about the problem here.

### Pull Request Template:

#### Description
- A clear and concise description of what the pull request is.
#### Related Issue
- Link to the related issue if applicable.
#### Changes
- List of changes made:
#### Screenshots
- If applicable, add screenshots to help explain your changes.
#### Additional context
- Add any other context about the pull request here.
## Contact

For any questions or feedback, you can reach out via email at [dave@ado.software](mailto:dave@ado.software) or on GitHub [@DaveLuhman](https://github.com/DaveLuhman).

---

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
