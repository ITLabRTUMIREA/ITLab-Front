module.exports = {
  devServer: {
    disableHostCheck: true
  },
  productionSourceMap: false,
  configureWebpack: (config) => {
    optimization: {
      splitChunks: {
        chunks: 'all';
      }
    }
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config.plugin('html').tap((args) => {
        args[0].template = './public/index_dev.html';
        return args;
      });
    }
  }
};
