import path from "path";
import webpack, {Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import "dotenv/config";
import CopyPlugin from "copy-webpack-plugin";

const webpackConfig = (env): Configuration => ({
    entry: "./src/index.tsx",
    ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "build.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                },
                exclude: /dist/
            },
            {
                test: /\.css$/i,
                loader: "css-loader",
                options: {
                    modules: true
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "node_modules/scichart/_wasm/scichart2d.data", to: ""},
                {from: "node_modules/scichart/_wasm/scichart2d.wasm", to: ""}
            ]
        }),
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": env.production || !env.development,
            "process.env.NAME": JSON.stringify(require("./package.json").name),
            "process.env.VERSION": JSON.stringify(require("./package.json").version),
            "process.env.RUNTIME_KEY": process.env.RUNTIME_KEY
        }),
        new ForkTsCheckerWebpackPlugin()
        // new ESLintPlugin({files: "./src/**/*.{ts,tsx,js,jsx}"})
    ]
});

export default webpackConfig;
