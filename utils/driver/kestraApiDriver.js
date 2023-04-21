import { defineDriver } from "unstorage";

export default defineDriver((options) => {
  return {
    name: "kestraApiDriver",
    options,
    async hasItem(key, _opts) {console.log(`hasItem: ${key}`)},

    async getItem(key, _opts) {
      console.log(`getItem: ${key}`)
      const endSuffixLength = key.endsWith("$") ? 4 : 3
      const plugin = 'io.kestra.plugin.' + key.substring(7, key.length - endSuffixLength);
      console.log(`getItem - plugin: ${plugin}`)
      const response = await fetch(`http://localhost:8080/v1/plugins/${plugin}/doc`)
      const jsonData = await response.json();
      return jsonData.body
    },

    async setItem(key, value, _opts) {console.log(`setItem: ${key}:${value}`)},

    async removeItem(key, _opts) {console.log(`removeItem: ${key}`)},

    async getKeys(base, _opts) {
      const response = await fetch("http://localhost:8080/v1/plugins")
      const jsonData = await response.json();
      const keys = jsonData.filter(item => item.type === 'PLUGIN').map(item => item.name + ".md")
      console.log(`getKeys response: ${keys}`)
      return keys
    },

    async clear(base, _opts) {console.log(`clear: ${base}`)},

    async dispose() {},

    async watch(callback) {},
  };
});