$(document).ready(function () {

let today = moment();
console.log(today);

$("#current-day").text(today.format("dddd | LL | h mm a"));





});