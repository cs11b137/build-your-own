import Vue from "./mini-vue/vue";

window.vm = new Vue({
  el: "#app",
  data: {
    firstName: "zhang",
    lastName: "san",
    obj: {
      a: "1000",
      b: "2000",
    },
    arr: ["a", "b"],
  },
  template:
    '<div class="container"><h1>{{firstName}}</h1><p>{{obj.a}}</p></div>',
  computed: {
    name() {
      return this.firstName + this.lastName;
    },
  },
  watch: {
    firstName() {
      console.log("first name change !");
    },
    lastName() {
      console.log("last name change !");
    },
  },
  methods: {
    printName() {
      console.log(this.name);
    },
  },
});
