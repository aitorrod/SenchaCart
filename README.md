# SenchaCart 1.0

Catalog and shopping cart for mobile web applications using Sencha Touch 2.

## Features

- Basic presentation of a product catalog
- Basic shopping cart management
- Flexible interface adapted for mobile devices (tested on Android)
- Simple implementation

## How to use

Simply place a call to initialize SenchaCart into the tag <body> of your HTML code. The product catalog must be provided as a parameter of the call.

Example:

...
<body>
	<script>SenchaCart.init(product_catalog);</script>
</body>
</html>

, where product_catalog is a JavaScript array of products.

Example:

var product_catalog = [
	{
		id:1, 
		name:'Apple iPad 2', 
		img: 'ipad.jpg', 
		val: 499.00,  
		desc: 'Advanced design. Thin. Light. Fully loaded. Technology so advanced, you\'ll forget its even there.',
		featured: true
	},
	{
		id:2, 
		name:'Android Phone', 
		img: 'android-phone.jpg', 
		val: 99.00, 
		desc: 'Flip out with this compact smartphone, offering a full touchscreen that rotates to reveal a full QWERTY keyboard.',
		featured: false
	},
	...
];

## To do

- Define module options for enable customization
- Search and find a store to pick up the order
- Shipping form
- Basic payment option management
- Present the summary before send the order to payment gateway
- Clean shopping cart

## Contact

This repository was created by Aitor Rodriguez-Alsina (aitorrod):
Web: http://aitorrod.com
Twitter: @aitorrod