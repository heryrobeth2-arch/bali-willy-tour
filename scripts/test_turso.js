const { createClient } = require("@libsql/client");
const turso = createClient({
  url: "libsql://bali-willy-tour-purnomo.aws-ap-northeast-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODY5NDk1NDYsImlkIjoiMDFhMDBlNGEtODAwMS03Mjk3LTlkNzEtOTllY2I0Mjc5NDIwIiwia2lkIjoiSE9sX3VBUUhHV1o0NEJMQ2FsdUZqeEY4MGpPX2NzR004U2llUVpMTTdiQSIsInJpZCI6ImM0NDBjNzc4LTJlMDAtNDU2ZC04NmYyLWJiMGNkODhmYTU0NiJ9.iz6GZtr_i1_evr4_OW4WrrR8pMCE4xNTdS3z6LK_cLmVkX9HCPkAdJ2YtFzeoZTZgZVM7EXmdgmZ0h5xR0KHDA"
});
turso.execute("SELECT 1 as test").then(r => {
  console.log("SUCCESS:", r.rows);
}).catch(e => {
  console.error("FAILED:", e.message);
});
