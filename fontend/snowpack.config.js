/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  plugins: ['@snowpack/plugin-postcss'],
  mount: {
    src: '/src',
    public: '/',
  },
};
