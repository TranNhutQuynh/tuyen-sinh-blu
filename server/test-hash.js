const bcrypt = require("bcryptjs");

async function run() {
  const plain = "admin123";
  const hash = "$2a$10$CbOAUH3ItBnz./p9VYlEmeL2talYZQyoLKOywJwG33l3.5ID9PwY.";

  const matched = await bcrypt.compare(plain, hash);
  console.log("matched = ", matched);
}
run();
