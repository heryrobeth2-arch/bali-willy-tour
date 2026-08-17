const { createClient } = require("@libsql/client");
const turso = createClient({
  url: "libsql://bali-willy-tour-purnomo.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3RjRFT0pvREVmR25xR1l5ZXRWX0tnIiwib3JnX2lkIjoxMDAwMjIzMDMwfQ.YWtDRB2JeorruW0EnKwIT8oTHrqzlnOng4bR132msO9nuRIzkhn3N26NCfbh4pDdLKikOka8mgsLTZTxIh91CA"
});
turso.execute("SELECT 1 as test").then(r => {
  console.log("SUCCESS:", r.rows);
}).catch(e => {
  console.error("FAILED:", e.message);
});
