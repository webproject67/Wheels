import './sass/style.scss';

const svgModules = require.context('../src/img/svg', true, /\.svg$/);
svgModules.keys().forEach(svgModules);