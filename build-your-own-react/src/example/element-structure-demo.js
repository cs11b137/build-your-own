export const element = {
  type: "div",
  props: {
    id: "container",
    children: [
      {
        type: "p",
        props: {
          class: "my-p",
          children: [
            {
              type: "TEXT ELEMENT",
              props: {
                nodeValue: "some text for p",
              },
            },
          ],
        },
      },
      {
        type: "span",
        props: {
          class: "my-span",
          onclick: function () {
            alert("click!");
          },
          children: [
            {
              type: "TEXT ELEMENT",
              props: {
                nodeValue: "some text for span",
              },
            },
          ],
        },
      },
    ],
  },
};
