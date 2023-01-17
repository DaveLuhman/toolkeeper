/*!
  * ToolKeeper by ADO Software - https://toolkeeper.dev.ado.software
  * Copyright 2022 ADO Software - https://ado.software
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */

// dashboard functions

// look up a tool by id
async function fetchToolByID(id) {
    let response = await fetch(`/tool/${id}`);
    let data = await response.json();
    console.log(data);
}