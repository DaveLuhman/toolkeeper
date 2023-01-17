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
// look up a tool by SN
async function fetchToolBySN(serialNumber) {
    let response = await fetch(`/api/tool/search?serialNumber=${serialNumber}`);
    let data = await response.json();
    console.log(data);
}
// lookup a tool by part number
async function fetchToolByPN(partNumber) {
    let response = await fetch(`/api/tool/search?partNumber=${partNumber}`);
    let data = await response.json();
    console.log(data);
}
// lookup a tool by barcode
async function fetchToolbyBC(barcode) {
    let response = await fetch(`/api/tool/search?barcode=${barcode}`);
    let data = await response.json();
    console.log(data);
}
// lookup a tool by service Assignment
async function fetchToolbyBC(serviceAssignment) {
  let response = await fetch(`/api/tool/search?serviceAssignment=${serviceAssignment}`);
  let data = await response.json();
  console.log(data);
}
