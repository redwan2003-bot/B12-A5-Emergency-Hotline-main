"JavaScript DOM & Events: FAQ"

### Difference Between `getElementById`, `getElementsByClassName`, and `querySelector` / `querySelectorAll`

- **getElementById** selects a single element by its unique ID and returns a direct reference to that element.
- **getElementsByClassName** returns a live HTMLCollection of all elements with a given class name, which updates automatically if the DOM changes.
- **querySelector** returns the first element matching any CSS selector, and **querySelectorAll** returns a static NodeList of all matching elements (does not update automatically).
- The main difference is selector flexibility and whether the result is *live* (updates with DOM) or *static* (does not update).

### How to Create and Insert a New Element into the DOM

1. Use `document.createElement("tagname")` to create a new element.
2. Optionally, add classes, attributes, or text using, for example, `.classList.add()` or `.textContent`.
3. Insert the new element into the DOM with `parent.appendChild(newElement)` or use `parent.insertBefore()` for placement.

```js
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello, World!';
document.body.appendChild(newDiv);
```

### What is Event Bubbling and How Does it Work?

- **Event Bubbling** is the process where an event triggered on a child element propagates upward to its ancestors in the DOM tree.
- When a user interacts with a child element (like clicking a button), event handlers on parent elements are also executed, unless prevented.
- For example: Clicking on a `<p>` inside a `<div>` inside a `<form>` triggers each level's event handler from innermost to outermost.

### What is Event Delegation in JavaScript? Why is it Useful?

- **Event Delegation** involves attaching a single event listener to a parent element to handle events from multiple child elements.
- This approach improves efficiency—especially for dynamic or large lists—reducing memory usage and simplifying code.
- The parent listens for events and uses properties like `event.target` to determine which child triggered the event.

### Difference Between `preventDefault()` and `stopPropagation()` Methods

- **preventDefault()** stops the browser’s default action for an event, such as preventing form submission or link navigation.
- **stopPropagation()** stops the event from bubbling up to ancestor elements, preventing their event handlers from running.
- While `preventDefault()` deals with native browser behaviors, `stopPropagation()` strictly controls how events travel in the DOM event chain.

