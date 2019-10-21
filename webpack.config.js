const path = require( 'path' );
//const nodeExternals = require( 'webpack-node-externals' );

module.exports = {
    target: "node",
    entry: {
        app: [ "./wayback-restore/index.js" ]
    },
    output: {
        path: path.resolve( __dirname, "./dist" ),
        filename: "wayback-restore.js"
    },
    //externals: [ nodeExternals() ]
};
