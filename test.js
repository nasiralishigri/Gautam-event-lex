const transactionTime = "2023-10-09T08:31:40.000Z"; // Replace with your actual transaction time

const dateObject = new Date(transactionTime);

// Get the date in YYYY-MM-DD format
const date = dateObject.toISOString().split("T")[0];

// Get the time in HH:MM:SS format
const time = dateObject.toTimeString().split(" ")[0];

console.log("Date:", date);
console.log("Time:", time);

// level income and staging no appropriate data
// Lucky draw History to eth from wei// 4 decimal point
// Send balance filter added on connected wallet and convert amount to 4 decimal and eth format
// 0f0 admin account   0xb8d4217b314192857a2ba34f413008f4eadfd0f0
