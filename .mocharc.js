const {mergeMochaConfigs} = require('@artlab/build');
const defaultConfig = require('@artlab/build/config/.mocharc.json');

const MONOREPO_CONFIG = {
  parallel: true,
};

module.exports = mergeMochaConfigs(defaultConfig, MONOREPO_CONFIG);
