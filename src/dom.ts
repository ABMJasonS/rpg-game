/**
 * A function mainly to take advantage of some code editors that
 * syntax highlight HTML inside JS templates
 *
 * @example
 * ```ts
 * const button = html`<button id="button-id">button content</button>`
 * ```
 * @param string The string to use
 * @returns The same string inputted
 */
export const html = (string: TemplateStringsArray): string => string.join("");

/**
 * Selects an element from the DOM. Poor man's jQuery.
 * @example
 * ```ts
 * const button = $("#button-id")
 * ```
 * @param selector The CSS selector
 * @returns
 */
export function $<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector(selector);

  if (element instanceof HTMLElement) {
    // @ts-expect-error Cast the type of the element
    return element;
  } else {
    throw new Error("Element not found!");
  }
}
