import { reactive } from "./src/reactive";
import { watchEffect } from "./src/effect";
import { ref } from "./src/ref";
import { computed } from "./src/computed";

window.reactive = reactive;
window.watchEffect = watchEffect;
window.ref = ref;
window.computed = computed;
