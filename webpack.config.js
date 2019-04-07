const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' ); // CSS loader for styles specific to block editing.
const glob = require( 'glob' );
// FIX WEBPACK TO COMPILE CSS
// Configuration for the ExtractTextPlugin.
const extractConfig = {
	use: [
		{
			loader: 'css-loader',
			options: {
				importLoaders: 1,
			},
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: [
					require( 'autoprefixer' ),
				],
			},
		},
		{
			loader: 'sass-loader',
			query: {
				outputStyle: 'production' === process.env.NODE_ENV ? 'compressed' : 'nested',
			},
		},
	],
};

const externals = {
	react: 'React',
	'react-dom': 'ReactDOM',
	'react-dom/server': 'ReactDOMServer',
	tinymce: 'tinymce',
	moment: 'moment',
	jquery: 'jQuery',
};

module.exports = {
	entry: {
		blocks: glob.sync( './blocks/*/index.js' ),
	},
	output: {
		filename: 'blocks/build/build.js',
		path: __dirname,
	},
	externals,
	resolve: {
		modules: [
			__dirname,
			'node_modules',
		],
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV || 'development' ),
		} ),
	],
};

if ( process.env.NODE_ENV === 'production' ) {
	module.exports.plugins = ( module.exports.plugins || [] ).concat( [
		new webpack.optimize.UglifyJsPlugin( {
			sourceMap: true,
			compress: {
				warnings: false,
			},
		} ),
	] );
}
