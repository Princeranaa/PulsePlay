import app from "./src/app";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
