import { Router } from "./src/router";

const router = new Router({ mode: "history" });
const container = document.getElementById("container");

router.route("/", () => {
  container.innerHTML = "Home page";
});

router.route("/news", () => {
  container.innerHTML = "News page";
});

router.route("/about", () => {
  container.innerHTML = "About page";
});

document.querySelector("#home").addEventListener("click", () => {
  router.replace("/");
});
document.querySelector("#news").addEventListener("click", () => {
  router.replace("/news");
});
document.querySelector("#about").addEventListener("click", () => {
  router.replace("/about");
});
