import { compare } from "bcryptjs";

const hash = "$2b$10$Ql0j1GmFI0TwwVs1PQ0KAeNXVV5JGd7YjGLYTLGrHH.jYhBZULk6y";
const password = "password123";

compare(password, hash)
  .then((result) => {
    console.log("Password match:", result);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
