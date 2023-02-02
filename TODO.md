# To Do List - 1-29-23

- Add dropdown selector for tools per page
  - Issue here is how to store the value in the session.  I don't want to store it in the session, but I also don't want to have to pass it in the query string. It would have to be user specific, so maybe have a preference on the profile and store it in the user object?
- Audit createTool for pageCount errors.
    What: Set page count to 1 if it's not defined when leaving that middlware function.
    Details: It's not causing the function to fail, but it's throwing an error and stopping the server because handlebars can't render the template properly.
- Audit checkTools for attempting to return a null value, rather than an empty array.

- Build out a way to change the sort target and direction by clicking on the table headers.
  - Simple Solution: Add parameters for each header and ascending/decending flags to the query string.  This would be a simple solution, but it would require a lot of work to get it to work with the current pagination system as it would only work on the current page of results.
  - Starting Point: Set a user-preference for sort method and direction. It would affect all results, as the database query would be sorted by the user's preference.  This would be a good starting point, but it would be nice to have the ability to sort by different criteria on the fly.
  - Long Term Goal: Build sorting middleware that would sort the results by the users preference before pagination is done. This would allow the user to change sorting method on the fly as it's done before pagination.

- Dashboard table edit dropdown menu is cut off by footer at the bottom of the page.
  - solution: add a margin to the bottom of the table to push it up a bit.

- Barcode Scanning utility:
  - simple solution: use a barcode scanner to scan the barcode and then use the `window.location` to redirect to the tool's page.