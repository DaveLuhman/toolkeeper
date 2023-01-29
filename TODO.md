# To Do List - 1-29-23

- Add dropdown selector for tools per page
- Audit createTool for pageCount errors.
    P4: Set page count to 1 if it's not defined when leaving that middlware function.
    Details: It's not causing the function to fail, but it's throwing an error and stopping the server because handlebars can't render the template properly.
- Audit checkTools for attempting to return a null value, rather than an empty array.
-