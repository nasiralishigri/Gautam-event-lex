const transactionTime = "2023-10-09T08:31:40.000Z"; // Replace with your actual transaction time

const dateObject = new Date(transactionTime);

// Get the date in YYYY-MM-DD format
const date = dateObject.toISOString().split("T")[0];

// Get the time in HH:MM:SS format
const time = dateObject.toTimeString().split(" ")[0];

console.log("Date:", date);
console.log("Time:", time);
