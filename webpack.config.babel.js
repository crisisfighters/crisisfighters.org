import path from "path";

// Thanks to https://zihao.me/post/building-a-blog-with-hugo-and-webpack/

export default {
  entry: {
    app: ["./app/app.js"],
    recruiter: ["./app/recruiter/recruiter.js"],
    'strings.en': ["./app/data/strings.en.js"],
    'strings.de': ["./app/data/strings.de.js"],
  },
  output: {
    path: path.resolve(__dirname, "public", "js"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.md$/i,
        use: 'raw-loader',
      },
    ]
  }
};