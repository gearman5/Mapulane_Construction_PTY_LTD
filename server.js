const express = require("express");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");
app.use(express.static(__dirname, {
    dotfiles: "deny",
    index: "index.html"
}));

app.listen(port, () => {
    console.log(`Mapulane website listening on port ${port}.`);
});
