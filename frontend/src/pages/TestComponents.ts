
let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;

let components = {};

for (let prefix of prefixes) {
    components[`${prefix}Test`] = import('./' + prefix + '/Test.vue');
}

export default components;
