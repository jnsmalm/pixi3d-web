const path = require("path")

module.exports = {
  devServer: {
    host: "0.0.0.0",
    contentBase: path.join(__dirname, "."),
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vert|frag)$/,
        use: "webpack-glsl-loader",
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "."),
    filename: "app.js"
  }
}