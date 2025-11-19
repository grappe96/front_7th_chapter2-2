import { addEvent } from "./eventManager";

export function createElement(vNode) {
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      const childElement = createElement(child);

      if (childElement) {
        fragment.appendChild(childElement);
      }
    });

    return fragment;
  }

  if (typeof vNode !== "object") {
    return vNode;
  }

  if (vNode.type) {
    const $el = document.createElement(vNode.type);

    if (vNode.props) {
      updateAttributes($el, vNode.props);
    }

    if (vNode.children && vNode.children.length > 0) {
      vNode.children.forEach((child) => {
        const childElement = createElement(child);

        if (childElement) {
          $el.appendChild(childElement);
        }
      });
    }

    return $el;
  }
}

function updateAttributes($el, props) {
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, props[key]);
    } else if (key === "className") {
      $el.setAttribute("class", props[key]);
    } else {
      $el.setAttribute(key, props[key]);
    }
  });
}
