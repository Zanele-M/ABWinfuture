import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

interface Configuration extends webpack.Configuration {
  devServer?: WebpackDevServer.Configuration;
}

const config: Configuration = {
  // ...other webpack configuration...
  devServer: {
    allowedHosts: 'all',
    // ...other devServer configuration...
  },
};

export default config;
