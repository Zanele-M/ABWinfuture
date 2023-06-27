function replaceHeading(oldHeadingId, oldImageAlt, newHeadingText, newImage) {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();
  
  // Call the replace function with a 50% probability
  if (randomNumber < 0.5) {
    const heading = document.evaluate('//h1[@id="heading1"]', document, null,
    XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    console.log(heading);

    if (heading) {
      heading.textContent = newHeadingText;
    }

    //change the picture of the page
    const xpath = `//img[@alt="${oldImageAlt}"]`;

    const imageElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    console.log(imageElement);
    
    // Replace the image source URL
    if (imageElement) {
      imageElement.src = newImage;
    }
   }
}
