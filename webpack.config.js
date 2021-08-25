// подключаем скаченные плагины
const path = require("path"); // подключаем путь
const HtmlWebPackPlugin = require("html-webpack-plugin"); // либа позволяет сжать файл index.html
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // очищает старые файлы с contenthash
const CopyWebpackPlugin = require("copy-webpack-plugin"); // указывает куда копировать файлы
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Этот плагин извлекает CSS в отдельные файлы. Он создает файл CSS для каждого файла JS, который содержит CSS. Он поддерживает загрузку CSS и SourceMaps по запросу.
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development";
console.log("-> IS DEVELOPMENT MODE: ", isDev);
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            // схлопывает одинакоые файлы кода в файлы с префиксом vendor
            chunks: "all",
        },
    };
    if (isProd) {
        config.minimizer = [new OptimizeCssAssetsWebpackPlugin(), new TerserWebpackPlugin()];
    }
    return config;
};

const jsLoaders = () => {
    const loaders = ["babel-loader"];
    if (isDev) {
        loaders.push("eslint-loader");
    }
    return loaders;
};

const getPlugins = () => {
    // дополнительно загружаемные плагины к вебпаку
    const base = [
        new HtmlWebPackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/favicon.ico"),
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
        }),
    ];
    if (isProd) {
        base.push(new BundleAnalyzerPlugin());
    }
    return base;
};

module.exports = {
    context: path.resolve(__dirname, "src"), // добавляем путь для контекста
    mode: "development",

    devServer: {
        // webpack-dev-server (запускает сервер и позволяет отслеживать изменения в реальном времени)
        port: 5000,
        open: true,
        hot: isProd,
    },

    devtool: isDev ? "eval-source-map" : "hidden-source-map",

    entry: {
        // файлы входа
        main: ["@babel/polyfill", "./main.js"],
        analytics: "./analytics.ts",
    },

    output: {
        // файлы выхода
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "dist"),
    },

    //  optimization: optimization(),

    resolve: {
        // разрешение
        extensions: [".js", ".json", ".png"], // Расширения которые можно не указывать при иммпорте
        alias: {
            // резервируем сокращения для путей
            "@models": path.resolve(__dirname, "src/models"),
            // '@': path.resolve(__dirname, 'src'),
        },
    },

    plugins: getPlugins(),

    // Лоадеры:
    module: {
        rules: [
            // правила для неизвестных типов файлов
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Указываем лоадер который загрузили (правило действует с право на лево <---)
                    isDev
                        ? "style-loader" // Creates `style` nodes from JS strings
                        : MiniCssExtractPlugin.loader,
                    "css-loader", // Translates CSS into CommonJS
                    "sass-loader", // Compiles Sass to CSS
                ],
            },
            {
                test: /\.css$/,
                use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpg|gif|jpeg|svg)$/,
                use: ["file-loader"], // Указываем лоадер который загрузили
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: ["file-loader"],
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"],
            },
            {
                test: /\.csv$/,
                loader: "csv-loader",
                options: {
                    dynamicTyping: true,
                    header: true,
                    skipEmptyLines: true,
                },
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
};
