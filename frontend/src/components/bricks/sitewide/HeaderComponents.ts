
let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;
    
let components = {};

for (let prefix of prefixes) {
    console.log('header components')
    components[`${prefix}Header`] = import(`../../../pages/${prefix}/Header.vue`);
    console.log(components[`${prefix}Header`]);
}

export default components;