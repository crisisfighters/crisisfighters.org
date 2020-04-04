import path from "path";

// Thanks to https://zihao.me/post/building-a-blog-with-hugo-and-webpack/

export default {
  entry: {
    'public/js/recruiter': ["./app/recruiter/recruiter.js"],
    'public/js/strings.en-us': ["./app/data/strings.js"],
    'public/js/strings.de-de': ["./app/data/strings.de-de.js"],
  },
  output: {
    path: path.resolve(__dirname),
    filename: "[name].js",
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