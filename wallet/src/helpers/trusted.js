const { keccak256 } = require("js-sha3");
const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function generatePassword() {
  return crypto.randomBytes(8).toString("hex"); // 16-character hex password
}

function getPasswordHash(password) {
  // Use keccak256 from js-sha3 library
  return keccak256(password);
}

function main() {
  console.log("=== Emergency Withdrawal Password Generator ===\n");

  const password = generatePassword();
  const passwordHash = getPasswordHash(password);

  console.log("New password generated:");
  console.log(`Password: ${password}`);
  console.log(`Hash: 0x${passwordHash}`);
  console.log("\nInstructions:");
  console.log("1. Send the password to the vault owner via SMS");
  console.log(
    "2. Call setPasswordHash(0x" + passwordHash + ") on the vault contract"
  );
  console.log("3. This password will be valid for 7 days");
  console.log("\nSecurity Warning:");
  console.log("- Never share the password over unencrypted channels");
  console.log("- Delete the password after use");
  console.log("- Generate a new password for each emergency withdrawal");

  rl.close();
}

main();
