import path from "path";

export default {
  entry: {
    app: ["./app/app.js"],
    // js bundle for other posts, e.g.
    // secondpost: ["./app/second-post.js"]
  },
  output: {
    path: path.resolve(__dirname, "public", "js"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  }
};