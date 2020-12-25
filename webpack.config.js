const path = require("path")

module.exports = {
  devServer: {
    host: "0.0.0.0",
    contentBase: path.join(__dirname, "."),
    port: 3000
  },
  output: {
    path: path.resolve(__dirname, "."),
    filename: "app.js"
  }
}