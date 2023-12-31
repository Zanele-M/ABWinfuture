import { addImpressionClickListener } from "./eventHandlers";

/**
 * Replace headline content by control identifier within paths.
 *
 * @param {string} controlIdentifier - The control identifier for the content to be replaced.
 * @param {string} assignedIdentifier - The replacement content.
 * @param {string[]} paths - The paths in which to look for elements to replace content.
 *
 * Iterates over the provided paths, finding elements where the control identifier is found, 
 * and replaces the content of these elements with the assigned identifier.
 */
export function replaceHeadlineContent(campaignId: number, controlIdentifier: string, assignedIdentifier: string, assignedId: number, isControl: boolean, paths: string[]): void {
    console.log(`Start replacing headline content for control identifier "${controlIdentifier}" with paths ${paths}`);
    let replaceCount = 0;

    paths.forEach(path => {
        const element = document.querySelector(path) as HTMLElement;
        if (element && element.innerHTML) {
            if (!isControl) {
                console.log(`Element innerHTML before replace: "${element.innerHTML}"`);

                const originalContent = element.innerHTML;

                element.innerHTML = assignedIdentifier;
                if (element.innerHTML !== originalContent) {
                    replaceCount++;
                    console.log(`Replaced content in element at path "${path}"`);
                    console.log(`Element innerHTML after replace: "${element.innerHTML}"`);

                } else {
                    console.log(`No replacement made for element at path "${path}"`);
                }

            }
            // Reapply event handlers
            addImpressionClickListener(campaignId, path, assignedId, isControl);

            // Make element visible again
            element.style.display = '';

        }
    });

    console.log(`Finished replacing headline content for control identifier "${controlIdentifier}". Total replacements: ${replaceCount}`);
}






/**
 * Replace the teaser image with the assigned identifier
 * @param controlIdentifier - The control identifier
 * @param assignedIdentifier - The assigned identifier
 * @param paths - The paths to replace
 */
export function replaceTeaserImage(campaignId: number, controlIdentifier: string, assignedIdentifier: string, assignedId: number, isControl: boolean, paths: string[]): void {
    console.log(`Start replacing teaser image for control identifier "${controlIdentifier}" with paths ${paths}`);
    let replaceCount = 0;

    paths.forEach(path => {
        const element = document.querySelector(path) as HTMLElement;
        if (element instanceof HTMLImageElement) {
            console.log(`Element src before replace: "${element.src}"`);
            const originalSrc = element.src;

            // If isControl is true and element.src includes controlIdentifier, replace it
            if (!isControl && element.src.includes(controlIdentifier)) {
                element.src = assignedIdentifier
                if (element.src !== originalSrc) {
                    replaceCount++;
                    console.log(`Replaced image src at path "${path}"`);
                    console.log(`Element src after replace: "${element.src}"`);

                } else {
                    console.log(`No replacement made for element at path "${path}"`);
                }
            }

            // Make element visible
            element.style.display = '';

            // Reapply event handlers
            addImpressionClickListener(campaignId, path, assignedId, isControl);
        }
    });

    console.log(`Finished replacing teaser image for control identifier "${controlIdentifier}". Total replacements: ${replaceCount}`);
}

/**
 * Replace the content and attributes of custom elements in a class with given values.
 * 
 * @param {number} campaignId - The ID of the campaign.
 * @param {string} controlIdentifier - The identifier of the control element.
 * @param {string} assignedIdentifier - The identifier to replace the control element with.
 * @param {nuwhermber} assignedId - The ID of the assigned element.
 * @param {boolean} isControl - Indicates if the assigned element is the control element.
 * @returns {void}
 */
export function replaceCustomElementContent(campaignId: number, controlIdentifier: string, assignedIdentifier: string, assignedId: number, isControl: boolean): void {

    // Find all occurrences of the control identifier
    const paths = findCustomElementOccurrences(controlIdentifier);

    paths.forEach((path: string) => {
        const element = document.querySelector(path);
        if (!element) return;

        // Replace the entire inner HTML if it includes the control identifier
        if (element.innerHTML.includes(controlIdentifier)) {
            element.innerHTML = element.innerHTML.replace(controlIdentifier, assignedIdentifier);
        }

        // Add event listeners
        addImpressionClickListener(campaignId, path, assignedId, isControl);
    });
}

/**
* Find all occurrences of the control identifier within custom elements in the DOM.
* 
* @param {string} controlIdentifier - The control identifier to find.
* @returns {string[]} An array of CSS selector paths leading to custom elements where the control identifier was found.
*/
function findCustomElementOccurrences(controlIdentifier: string): string[] {
    const elements = document.querySelectorAll('your-custom-selector-here');
    const paths: string[] = [];

    elements.forEach((element: Element) => {
        if (element instanceof HTMLElement) {
            if (element.innerHTML.includes(controlIdentifier)) {
                const path = getElementPath(element);
                if (path) {
                    paths.push(path);
                }
            }
        }
    });

    return paths;
}

/**
* Get the CSS selector path of an element.
* 
* @param {Element} element - The element to get the path for.
* @returns {string | null} The CSS selector path of the element, or null if it couldn't be determined.
*/
function getElementPath(element: HTMLElement): string | null {
    const path: string[] = [];
    let currentElement: HTMLElement | null = element;

    while (currentElement) {
        if (currentElement.id) {
            path.unshift(`#${currentElement.id}`);
            break;
        } else if (currentElement.classList.length > 0) {
            const classNames = Array.from(currentElement.classList);
            path.unshift(...classNames.map(className => `.${className}`));
        } else {
            const tagName = currentElement.tagName.toLowerCase();
            path.unshift(tagName);
        }

        currentElement = currentElement.parentElement;
    }

    return path.length > 0 ? path.join(' > ') : null;
}



/**
* Traverse the DOM tree of an HTML element and find occurrences of a search term in text or attributes.
* Ignores 'alt' attributes in 'img' elements and doesn't return duplicate CSS selector paths.
* Only returns CSS selector paths leading to '<a>' elements where the search term was found.
*
* @param {string} selector - A CSS selector to identify the root HTML element for traversal.
* @param {string} searchTerm - The term to search for within text nodes and attribute values.
* @return {string[]} An array of CSS selector paths leading to '<a>' elements where the search term was found.
*/
export function findOccurrences(selector: string, searchTerm: string): string[] {
    let rootElement = document.querySelector(selector);
    if (!rootElement) {
        console.error(`No element found for selector: ${selector}`);
        return [];
    }

    let paths: string[] = [];

    function traverseDOM(element: Element, path: string) {
        path = path ? `${path} > ${element.nodeName}:nth-child(${getIndex(element)})` : element.nodeName;

        if (element.nodeName === "A") {
            for (let attr of element.attributes) {
                if (attr.value.includes(searchTerm) && !paths.includes(path)) {
                    paths.push(path);
                }
            }

            for (let node of element.childNodes) {
                if (node.nodeType === 3 && node.nodeValue && node.nodeValue.includes(searchTerm) && !paths.includes(path)) {
                    paths.push(path);
                }
            }
        }

        // If the element is an img, check its src attribute
        if (element.nodeName === "IMG" && element instanceof HTMLImageElement && element.src.includes(searchTerm) && !paths.includes(path)) {
            paths.push(path);
        }

        for (let child of element.children) {
            traverseDOM(child, path);
        }
    }

    function getIndex(node: Element): number {
        let index = 1;
        let previousNode = node.previousElementSibling;
        while (previousNode) {
            index++;
            previousNode = previousNode.previousElementSibling;
        }
        return index;
    }

    traverseDOM(rootElement, '');
    return paths || [];
}
