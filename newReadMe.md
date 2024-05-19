# ToolKeeper

ToolKeeper is a tool crib management application designed to assist contractors in keeping tabs on what jobs, employees, and vehicles their various tools are assigned to.

## Key Features

- **Flexible ServiceAssignments**: Easily manage and assign tools to various jobs, employees, and vehicles.
- **Print-Friendly Reports**: Generate reports for shop members to use when cleaning out a job site.
- **Access Control**: Allow anyone to log in without compromising the safety of the data.

## Technologies Used

- **Backend**: Express
- **Database**: Mongoose ODM connecting to MongoDB v14
- **Frontend**: Handlebars and Tailwind CSS

## Setup Instructions

1. Duplicate the `.env.sample` file and fill in the appropriate fields.
2. The default user credentials are `admin@toolkeeper.site:asdfasdf`.

## Usage Instructions

- ToolKeeper starts with a few default categories and service assignments but no tools or other configuration.
- Users can import their existing data from the settings > import page or start by creating their stockroom ServiceAssignments (SAs), then job/employee SAs.
- Once ServiceAssignments are created, tools can be created and assigned as needed.

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


### Pull Request Template
Description
A clear and concise description of what the pull request is.

Related Issue
Link to the related issue if applicable.

Changes
List of changes made:

...
...
Screenshots
If applicable, add screenshots to help explain your changes.

Additional context
Add any other context about the pull request here.

markdown
Copy code

## Contact

For any questions or feedback, you can reach out via email at [dave@ado.software](mailto:dave@ado.software) or on GitHub [@DaveLuhman](https://github.com/DaveLuhman).

---

## Documentation

### Getting Started

1. **Installation**
   - Clone the repository:
     ```sh
     git clone https://github.com/daveluhman/toolkeeper.git
     ```
   - Navigate to the project directory:
     ```sh
     cd toolkeeper
     ```
   - Install dependencies:
     ```sh
     npm install
     ```

2. **Configuration**
   - Duplicate the `.env.sample` file and rename it to `.env`.
   - Fill in the appropriate fields in the `.env` file.

3. **Running the Application**
   - Start the application:
     ```sh
     npm start
     ```
   - The application will be available at `http://localhost:3000`.

### User Guide

- **Importing Data**
  - Navigate to `Settings > Import`.
  - Upload your existing data files to import them into ToolKeeper.

- **Creating Service Assignments**
  - Go to `Settings > Service Assignments`.
  - Create stockroom ServiceAssignments first, followed by job/employee ServiceAssignments.

- **Managing Tools**
  - Create tools and assign them to various jobs, employees, and vehicles as needed.

### Advanced Configuration

- **Environment Variables**
  - Customize the environment variables in the `.env` file to suit your setup.

- **Database**
  - Ensure MongoDB v14 is running and accessible to the application.

---

## Marketing Copy

**ToolKeeper: Your Ultimate Tool Crib Management Solution**

Efficiently manage your tools, jobs, employees, and vehicles with ToolKeeper. Designed with contractors in mind, ToolKeeper offers a seamless way to keep track of tool assignments and ensure nothing gets lost in the shuffle.

**Key Benefits:**

- **Flexible Assignments**: Easily manage where your tools are assigned, whether to jobs, employees, or vehicles.
- **Print-Friendly Reports**: Generate and print reports to streamline your operations, especially useful when cleaning out job sites.
- **Secure Access Control**: Ensure your data is safe while allowing team members to log in and manage tools.

**Why Choose ToolKeeper?**

ToolKeeper stands out with its robust features and user-friendly interface. Built on a solid tech stack including Express, MongoDB, and Tailwind CSS, it guarantees performance and reliability. Plus, with our MIT license, you're free to self-host and customize the solution to fit your exact needs.

**Get Started Today**

Visit [GitHub](https://github.com/daveluhman/toolkeeper) to clone the repository and set up ToolKeeper for your business. For any questions or support, reach out to us at [dave@ado.software](mailto:dave@ado.software).
