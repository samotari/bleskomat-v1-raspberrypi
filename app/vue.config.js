module.exports = {
  publicPath: './',
  outputDir: './renderer/dist',
  pages: {
    index: {
      // entry for the page
      entry: 'renderer/src/main.js',
      // the source template
      template: 'renderer/public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Beslkomat',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  },
}
