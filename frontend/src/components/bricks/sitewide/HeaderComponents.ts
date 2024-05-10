let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;

let components = {};

for (let prefix of prefixes) {
    components[`${prefix}Header`] = import(`../../../pages/${prefix}/Header.vue`);
}

export default components;