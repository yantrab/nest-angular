module.exports = cfg => {
    const options = cfg.optimization.minimizer[cfg.optimization.minimizer.length - 1].options.terserOptions;
    if (options) {
        options.keep_classnames = true;
        // options.mangle = false;
        // options.keep_fnames = true;
        console.log('start build with options.keep_classnames = true;');
    } else {
        console.log('problem with set keep_classnames');
    }
    return cfg;
};
