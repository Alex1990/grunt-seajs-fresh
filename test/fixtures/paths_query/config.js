seajs.config({

    base: 'src',

    paths: {
        gallery: 'src/libs'
    },

    /*fresh start*/
    alias: {
        'foo': 'gallery/foo.js',
        'bar': 'bar.js'
    }
    /*fresh end*/
});
