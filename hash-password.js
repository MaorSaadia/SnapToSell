import { hash as _hash } from "bcryptjs";

_hash("password123", 10)
  .then((hash) => {
    console.log("Hash for password123:", hash);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
