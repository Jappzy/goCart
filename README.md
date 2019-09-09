# GoCart

I acknowledge the tech stack at goPuff does not include Angular, however it will always have a warm place in my heart and enable me to create web apps like this in speedy fashion. This project is built with Angular and the Material Design UI library. The only 'helper' library that I used is RxJs. I love observables and prefer ES6+ high order functions over lodash/underscore/jquery/etc...

## Getting the Cart & Caching

When the site is loaded I check local storage for a saved cart.

If it exists it is stored in a BehaviorSubject and subscribed to throughout the app.

If no cart exists in local storage I hit the initial cart endpoint to get the sample cart.
Then I need to get the product details for the items. This is accomplished by getting just the id's for the products and then hitting the product details endpoint with the ids in a query string.
Next I join the product details with the initial product objects, making sure to concatenate the original product after the details so info like the quantity don't get reset.
These are stored in a simple JSON string in local storage for easy retrieval upon re-visiting the page.


## Products Search and Add to Cart

I added a products page with an input field to search through all products and add them to cart.

I had to change the initial quantity from 0 to 1 to fit the quantity selector and add in a check if that product is already in the cart.

Also added a debouncer to limit the amount of requests
