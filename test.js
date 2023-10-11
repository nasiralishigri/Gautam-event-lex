const BigNumber = require("bignumber.js");

// Hexadecimal input string
const hexString =
  "0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6";

// Convert the hex string to a BigNumber
const bn = new BigNumber(hexString);

// Convert the BigNumber to a regular JavaScript string
const numberString = bn.toString();

console.log(numberString); // Output: "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
