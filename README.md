# SenchaCart 1.0

Catalog and shopping cart for mobile web applications using Sencha Touch 2. Watch an example at:

http://aitorrod.com/senchacart

## Features

- Basic presentation of a product catalog
- Basic shopping cart management
- Flexible interface adapted for mobile devices (tested on Android)
- Simple implementation

## How to use

Simply create a product catalog and place a call to initialize SenchaCart into the tag body of your HTML code. The product catalog is a JavaScript array that must be provided as a parameter of the call.

Example:

```
...
<body>
	<script>
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
				featured: true
			},
			{
				id:3, 
				name:'Headphones', 
				img: 'headphone.jpg', 
				val: 59.00, 
				desc: 'Feel your music! With a comfortable, over-the-ear design, you may never want to take them off.',
				featured: false
			}
		];
		SenchaCart.init(product_catalog);
	</script>
</body>
</html>
```

## To do

- Solve issues with the cart amount
- Define module options for enable customization
- Search and find a store to pick up the order
- Shipping form
- Basic payment option management
- Present the summary before send the order to payment gateway
- Clean shopping cart

## Contact

This repository was created by Aitor Rodriguez-Alsina (aitorrod):

Web: http://aitorrod.com

Twitter: [@aitorrod](https://twitter.com/aitorrod)