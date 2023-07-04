// utils/clickEventHandlers.ts

import { sendInteractionEvent } from './APIClient';

/**
 * Handles a click event on a campaign element.
 * 
 * @param {number} assigned_id - ID of the variant of the campaign
 * @param {boolean} is_control - Flag to indicate if the campaign is a control
 * 
 * @returns {Function} - A function that takes an Event object and sends a 'click' interaction event to the backend if the click is not already cached in localStorage. It also caches the click after sending the event to prevent multiple events for the same click.
 */
export function handleClickEvent(campaignId: number, assigned_id: number, is_control: boolean): (event: Event) => void {
  return function (event: Event) {
    const key = `click-campaignId-${campaignId}-assignedId-${assigned_id}`;
    const cachedClick = localStorage.getItem(key);

    // If the click is already cached, do nothing
    if (cachedClick) {
      console.log(`Click for element with assignedId: ${assigned_id} is already recorded.`);
      return;
    }

    console.log('Element clicked!');
    console.log(`Handling click event for element with assignedId: ${assigned_id}, isControl: ${is_control}`);
    const data = {
      assigned_id,
      interaction_type: 'clicks',
      is_control,
    };
    sendInteractionEvent(data, key);

    // Cache the click event after a successful call to the backend
  };
}

/**
 * Adds an impression and click event listener to a campaign element.
 * 
 * @param {number} campaignId - ID of the campaign
 * @param {string} controlIdentifier - CSS selector to identify the campaign element in the DOM
 * @param {number} assignedId - ID of the variant of the campaign
 * @param {boolean} isControl - Flag to indicate if the campaign is a control
 * 
 * An IntersectionObserver is used to detect when the campaign element is visible in the viewport. Once the element becomes visible, an 'impression' interaction event is sent to the backend, and the observer stops observing the element.
 * 
 * A click event listener is also added to the campaign element. When the element is clicked, a 'click' interaction event is sent to the backend, and the click is cached in localStorage.
 */
export function addImpresasionClickListener(campaignId: number, controlIdentifier: string, assignedId: number, isControl: boolean): void {
  console.log(`Searching for element with controlIdentifier: ${controlIdentifier}`);
  const matchingElement = document.querySelector(controlIdentifier);

  if (matchingElement instanceof HTMLElement) {
    console.log('Element found. Adding impression and click event listeners.');

    // Create an intersection observer to track when the element becomes visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // If the element is visible in the viewport, send an impression event
        if (entry.isIntersecting) {
          sendImpressionEvent(campaignId, assignedId, isControl);
          // After sending the event, you can stop observing the element
          observer.unobserve(matchingElement);
        }
      });
    });

    // Start observing the element
    observer.observe(matchingElement);

    // Add click event listener
    matchingElement.addEventListener('click', handleClickEvent(campaignId, assignedId, isControl));
  } else {
    console.log('Element not found or not an HTMLElement.');
  }
}

/**
 * Sends an 'impression' interaction event to the backend.
 * 
 * @param {number} campaignId - ID of the campaign
 * @param {number} assigned_id - ID of the variant of the campaign
 * @param {boolean} isControl - Flag to indicate if the campaign is a control
 */
function sendImpressionEvent(campaignId: number, assigned_id: number, is_control: boolean): void {
  const key = `impression-campaignId-${campaignId}-assignedId-${assigned_id}`;
  const cachedImpression = localStorage.getItem(key);

    // If the impression is already cached, do nothing
    if (cachedImpression) {
        console.log(`Impression for campaignId: ${campaignId} is already recorded.`);
        return;
    }

    console.log(`Sending impression event for campaignId: ${campaignId}, assignedId: ${assigned_id}, isControl: ${is_control}`);
    const data = {
      assigned_id,
      interaction_type: 'views',
      is_control,
    };
    sendInteractionEvent(data, key);
}

