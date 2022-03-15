const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	mode: 'development',
	entry: {
		main: path.resolve(__dirname, './src/main.js'),
		index: path.resolve(__dirname, './src/index.js')
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].[hash:8].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'public/index.html'
		})
	],
	devServer: {
		port: 9090,
		host: '0.0.0.0'
	}
}
