
    let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;
    
    let components = {};
    
    for (let prefix of prefixes) {
        components[`${prefix}About`] = import(`./${prefix}/About.vue`);
    }
    
    export default components;
    