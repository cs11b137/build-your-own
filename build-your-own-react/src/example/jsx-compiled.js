import React from "./createElement";

export const element = React.createElement(
  "div",
  {
    id: "container",
  },
  React.createElement("input", {
    value: "foo",
    type: "text",
  }),
  React.createElement(
    "a",
    {
      href: "/bar",
    },
    "bar"
  ),
  React.createElement(
    "span",
    {
      onClick: (e) => alert("Hi"),
    },
    "click me"
  )
);
console.log(element);
