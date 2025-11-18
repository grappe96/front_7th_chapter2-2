const eventDelegationMap = new WeakMap();

export function setupEventListeners(root) {
  if (root.__isDelegated) {
    return;
  }

  const delegationHandler = (event) => {
    let target = event.target;

    while (target && target !== root) {
      if (eventDelegationMap.has(target)) {
        const elementMap = eventDelegationMap.get(target);
        const handlers = elementMap.get(event.type);

        if (handlers) {
          handlers.forEach((handler) => {
            if (event.cancleBubble) {
              return;
            }
            handler(event);
          });
        }
      }
      target = target.parentNode;
    }
  };

  root.addEventListener("click", delegationHandler);

  root.__isDelegated = true;
}

export function addEvent(element, eventType, handler) {
  if (!eventDelegationMap.has(element)) {
    eventDelegationMap.set(element, new Map());
  }

  const elementMap = eventDelegationMap.get(element);

  if (!elementMap.has(eventType)) {
    elementMap.set(eventType, []);
  }

  elementMap.get(eventType).push(handler);
}

export function removeEvent(element, eventType, handler) {
  if (!eventDelegationMap.has(element)) {
    return;
  }

  const elementMap = eventDelegationMap.get(element);

  if (!elementMap.has(eventType)) {
    return;
  }

  const handlers = elementMap.get(eventType);

  if (handlers.includes(handler)) {
    handlers.splice(handlers.indexOf(handler), 1);
  }

  if (handlers.length === 0) {
    elementMap.delete(eventType);
  }

  if (elementMap.size === 0) {
    eventDelegationMap.delete(element);
  }
}
