
let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;
    
let components = {};

for (let prefix of prefixes) {
    components[`${prefix}Footer`] = import(`../../../pages/${prefix}/Footer.vue`);
}

export default components;