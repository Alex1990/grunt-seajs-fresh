seajs.config({

    base: 'src',

    vars: {
        gallery: 'src/libs/'
    },

    /*fresh start*/
    alias: {
        'foo': '{gallery}foo.js',
        'bar': 'bar.js'
    }
    /*fresh end*/
});
