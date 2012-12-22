/**
 * Catalog and shopping cart for a mobile web app using Sencha Touch 2.
 * 
 * @author Aitor Rodriguez-Alsina (aitorrod)
 * @filename senchacart.js
 * @version 1.0
 * @date 20121222
 * @license GNU GPL v3.0
 */
// Actions for adapting the ui when the window is resized
window.onresize=function(){
	if(!CartView.isOpened){
		CartView.close();
	}
	SenchaCart.content.height=(Ext.getBody().getSize().height-110)+'px';
}

// SenchaCart object
var SenchaCart = {
	catalog: {},
	cart: {	nProducts:0, products:[] },
	content: {},
	productDetailView: {},
	cartview: {},
	screenSize: {},
	// Initialize
	init: function(catalog){
		this.screenSize = Ext.getBody().getSize();
		if(catalog){
			this.catalog = catalog;
		}
		Ext.application({
			launch: function () {
				Ext.create('Ext.Container', {
					fullscreen: true,
					layout: 'vbox',
					items: [
						SenchaCart.getToolbar(),
						SenchaCart.getContent(),
						CartView.init()
					],
					listeners: {
						painted: {
							element: 'element',
							fn: function(e) {
								CartView.close();
							}
						}
					}
			   });
			}
		});
	},
	// Get the main toolbar
	getToolbar: function(){
		return {
			xtype: 'toolbar',
			docked: 'top',
			ui: 'dark',
			cls: 'main-toolbar',
			title: 'SenchaCart example',
			items: [{
				text: 'Back',
				ui: 'back',
				handler: function () {
					var activeItem = SenchaCart.content.getActiveItem();
					var activeIndex = SenchaCart.content.items.indexOf(activeItem);
					if(activeIndex===0){
						if(CartView.isOpened){
							CartView.close();
						}else{
							history.go(-1);
						}
					} else if(activeIndex===1){
						SenchaCart.content.setActiveItem(0);
					}
				}
			}]
		};
	},
	// Get the content view
	getContent: function(){
		this.content = Ext.create('Ext.Container', {
			layout: 'card',
			height: (this.screenSize.height-110)+'px',
			items: [
				{	// Tab panel view width both product lists
					id: 'product-tabs',
					xtype: 'tabpanel',
					layout: {
						type: 'card',
						animation: {
							type: 'slide',
							direction: 'left'
						}
					},
					tabBar: {
						ui: 'light',
						layout: {
							pack: 'center'
						},
						style: 'font-size:.8em; overflow: visible'
					},
					items : [
						this.getProducts( {showFeatured: true} ),
						this.getProducts( {showFeatured: false} )
					]
				},
				this.getProductDetailView()
			]
		});
		return this.content;
	},
	// Get the product list. 
	// Options:
	// - featured:bool If true, show featured products 
	getProducts: function(options){
		var _items = [];
		var _title = "";
		for (var i=0; i<this.catalog.length; i++){
			var product = this.catalog[i];
			if(options.showFeatured){
				if(product.featured){
					_title = "Featured products";
					_items.push(this.getProductRow(product));
				}
			}else{
				_title = "Browse all";
				_items.push(this.getProductRow(product));
			}
		}
		return { title: _title, xtype: 'container', layout: 'vbox', items: _items, scrollable: true };
	},
	// Get the product detail view
	getProductDetailView: function(){
		this.productDetailView = Ext.create('Ext.Container', {
			id: 'product-detail',
			layout: 'vbox',
			width:'100%',
			style: 'background-color:#fff; text-align: center'
		});
		return this.productDetailView;
	},
	// Get a product row
	getProductRow: function(product){
		var id = product.id;
		return {
			xtype: 'container',
			layout: 'hbox',
			items: [
				{	// Product image and info
					xtype: 'container',
					layout: 'hbox',
					items: [
						{ html: '<img src="products/small/'+product.img+'" width="124px" height="124px" style="margin:2px" />' },
						{
							xtype: 'container',
							items: [
								{ xtype: 'label', html: product.name, style: 'width:'+(SenchaCart.screenSize.width-128-60)+'px'},
								{ xtype: 'label', html: product.desc, style: 'font-size:.8em; color:#888; width:'+(SenchaCart.screenSize.width-128-60)+'px'}
							],
							style: 'margin-top:.6em'
						}
					],
					listeners: {
						tap: {
							element: 'element',
							fn: function(e) {
								SenchaCart.showProductDetails(id);
							}
						}
					}
				},
				{	// Product price and add-to-cart button
					xtype: 'container',
					layout: 'vbox',						
					items: [ 
						{ xtype: 'label', html: product.val+' €', style: 'margin-top:.6em; color: #900; font-weight:bold; font-size:1.1em;'},
						this.getAddToCartButton(id)
					],
					right:'.3em'
				}
			],
			style: 'background-color:#fff; margin-bottom:2px;'
		};
	},
	// Show a product selected by id
	showProductDetails: function(id){
		var product = this.getProductById(id);
		if(product){				
			SenchaCart.productDetailView.setItems([
				{ xtype: 'label', html: product.name, style: 'margin-top:.6em; font-size:1.2em'},
				{ html: '<img src="products/big/'+product.img+'" width="224px" height="265px" border="0" />',},
				{ xtype: 'label', html: product.desc, style:'color:#888; margin-bottom:.6em'},
				{ 
					xtype: 'container',
					layout: {
						type: 'hbox',
						pack: 'center',
						align: 'center'
					},
					items: [
						{ xtype: 'label', html: product.val+' €', style:'margin-right:.6em; color:#900; font-weight:bold; font-size:1.1em;'},
						this.getAddToCartButton(product.id)
					]
				}
			]);				
			this.content.setActiveItem(1);
		}else{
			alert('Product not found.'+nItems);
		}
	},
	// Get a product from the catalog by id
	getProductById: function(id){
		var nItems=this.catalog.length;
		for (var i=0; i<nItems; i++){
			var product = this.catalog[i];
			if (product.id === id){
				return product;
			}
		}
		return null;
	},
	// Get the add-to-cart button
	getAddToCartButton: function(id){
		return {
			xtype: 'container',
			height:50,
			items: [{
				xtype: 'button',
				html: '<img src="sencha-touch/resources/themes/images/default/pictos/shop1.png" width="30px" height="30px" border="0" />',
				handler: function(e){
					SenchaCart.addToCart(SenchaCart.getProductById(id));
				}
			}],
			layout: { type: 'vbox', pack: 'center', align: 'center' },
			style: 'font-size:.5em'
		}
	},
	// Add a product to the cart
	addToCart: function(_product){
		// Check if the product has been previously added
		var exists = false;
		var nItems = this.cart.products.length;
		for(var i=0; i<nItems; i++){
			var cartItem = this.cart.products[i].product;
			if(cartItem.id === _product.id){
				exists = true;
				break;
			}
		}
		// Update cart data
		if (exists) {
			SenchaCart.cart.products[i].quantity++;
			CartView.updateProduct(SenchaCart.cart.products[i]);
		} else {
			var _productView = CartView.getProductView(_product);
			SenchaCart.cart.products.push({product:_product, productView:_productView, quantity:1});
			CartView.content.getComponent(1).getComponent(0).insert(this.cart.products.length-1,_productView);
		}
		this.cart.nProducts++;
		// Update cart view
		CartView.update();
	}
};

// Get the cart view, which is shown in the footer
var CartView = {
	content: {},
	footerOpener: {},
	productCounter: {},
	isOpened: false,
	init: function(){
		this.content = Ext.create('Ext.Panel', {
			id: 'footer',
			layout: 'vbox',
			top: SenchaCart.screenSize.height - 110,
			height: '100%',
			width: '100%',
			ui: 'dark',		
			items: [
				{	// Visible part of the cart
					xtype: 'container',
					layout: { type: 'vbox', pack: 'center', align: 'center' },
					items: [
						{
							html: '<img src="sencha-touch/resources/themes/images/default/pictos/shop1.png" width="60px" height="60px" border="0" />',
							top:'0', 
							left:'0',
							width:'70px'
						},
						{
							xtype: 'container',
							top:'0',
							left:'0',
							width:'100%',
							items: [
								this.getProductCounter(),
								{html:'in the cart', style:'font-size:.9em;'}
							],
							style: 'text-align:center; margin-top:10px;'
						},
						{
							xtype: 'container',
							items: [ this.getOpener() ],
							top:'0',
							right:'0',
							width:'50px'
						}
					],
					style: 'height:70px;'
				},					
				{	// Hidden part of the cart
					id: 'hidden-part',
					xtype: 'container',
					layout: 'card',
					height: SenchaCart.screenSize.height - 110,
					items: [
						{	// First view
							id: 'first-view',
							xtype: 'container',
							layout: 'vbox',
							items: [
								{	// Cart summary
									id: 'cart-summary',
									xtype: 'container',
									layout: {
										type: 'hbox',
										align: 'center',
										pack: 'center'
									},
									items: [
										{html: 'Total:', style: 'margin-right:.5em;'},
										{id: 'cartTotal', html: '', style: 'font-weight:bold'}
									],
									style: 'margin:.3em auto; color:#900'
								},
								{	// Continue button
									xtype: 'button',
									text: 'Continue shopping',
									height: '2em',
									style: 'margin:.3em',
									handler: function(){ CartView.close();}
								},
								{	// Checkout button
									xtype: 'button',
									text: 'Checkout',
									ui: 'action',
									height: '2em',
									style: 'margin:.3em',
									handler: function(){
										CartView.content.getComponent(1).animateActiveItem(1, {type:'slide', direction:'left'});
									}
								}
							]
						},
						{	//Second view
							id: 'second-view',
							xtype: 'container',
							layout: 'vbox',
							items: [
								{	// Cancel button
									xtype: 'button',
									text: 'Cancel',
									ui: 'decline',
									height: '2em',
									style: 'margin:.3em',
									handler: function(){
										CartView.content.getComponent(1).animateActiveItem(0, {type:'slide', direction:'right'});
									}
								},
								{	// Search store button
									xtype: 'button',
									text: 'Search a store',
									ui: 'action',
									height: '2em',
									style: 'margin:.3em',
									handler: function(){
										alert('Go to Search Shop');
									}
								},
								{	// Shipping button
									xtype: 'button',
									text: 'Shipping',
									ui: 'action',
									height: '2em',
									style: 'margin:.3em',
									handler: function(){
										alert('Go to Shipping');
									}
								}
							],
							style: 'background-color:#fff'
						}
					]
				}
			],
			style: 'text-align:center; background-color:#2880bd;'
		});
		return this.content;
	},
	// Get product counter, which is allways visible
	getProductCounter: function(){
		this.productCounter = Ext.create('Ext.Container', {
			html:'0 products', 
			style:'font-weight:bold; margin: .2em 0;'
		});
		return this.productCounter;
	},
	// Get the button to open the cart view
	getOpener: function(){			
		this.footerOpener = Ext.create('Ext.Button', {
			iconCls: 'arrow_right',
			iconMask: true,
			ui: 'action',
			style: 'width:40px; height:40px; top:10px; left:5px;',
			handler: function(){
				if(CartView.isOpened){
					CartView.close();					
				}else{
					CartView.open();
				}
			}
		});
		this.footerOpener.hide();
		return this.footerOpener;
	},		
	// Open cart view
	open: function(){
		this.content.setTop('0');
		this.content.setScrollable(true);
		this.footerOpener.setIconCls('arrow_down');
		this.isOpened = true;
	},
	// Close cart view
	close: function(){
		this.content.setTop((Ext.getBody().getSize().height - 110) + 'px');
		this.content.setScrollable(false);
		this.footerOpener.setIconCls('arrow_right');
		this.isOpened = false;
	},
	// Get product summary
	getProductView: function(product){
		var container =  Ext.create('Ext.Container', {
			layout: 'hbox',
			id: 'cart'+product.id,
			height: '5.5em',
			items: [
				{ html: '<img src="products/small/'+product.img+'" width="65px" height="65px" style="margin:2px" />' },
				{
					xtype: 'container',
					layout: 'vbox',
					items: [									
						{	// Product info
							xtype: 'container',
							layout: { type: 'hbox', align: 'left'},
							items: [{ xtype: 'label', html: product.name }],
							style: 'margin-top:.3em; margin-bottom:.6em'
						},
						{	// Cart data
							xtype: 'container',
							layout: 'hbox',
							height: '3em',
							defaults: {
								xtype: 'container',
								layout: 'vbox',
								height: '1em',
								style: 'text-align:left; margin-right:1em'
							},
							items: [
								{	// Unit price
									items: [
										{html: 'Price', style: 'font-size:.7em;' },
										{html: product.val + ' €', style: 'font-size:.9em; margin-top:.7em; width:3em;' }
									]
								},
								{	// Quantity
									items: [
										{html: 'Quantity', style: 'font-size:.7em;'},
										{
											xtype: 'selectfield',
											name: 'quantity',
											options: [
												{text: '1', value: '1'},
												{text: '2', value: '2'},
												{text: '3', value: '3'},
												{text: '4', value: '4'},
												{text: '5', value: '5'},
												{text: '6', value: '6'},
												{text: '7', value: '7'},
												{text: '8', value: '8'},
												{text: '9', value: '9'},
												{text: '10', value: '10'},
											],
											style: 'width:5em; font-size:.9em',
											listeners: {
												blur: {
													element: 'element',
													fn: function(e) {
														var selectedQuantity = this.getValue();
														var productView = this.getParent().getParent().getParent().getParent();
														var selectedCartProduct = {};
														for(var i=0; i<SenchaCart.cart.products.length; i++){
															var cartProduct = SenchaCart.cart.products[i];
															if(cartProduct.product.id === productView.id){
																selectedCartProduct = cartProduct;
																break;
															}
														}
														if(selectedCartProduct.product){
															if(selectedCartProduct.quantity !== selectedQuantity){
																// Update quantity
																cart.nProducts += selectedQuantity - selectedCartProduct.quantity;
																selectedCartProduct.quantity = selectedQuantity;
																this.update();
																// Update total
																var total = Math.floor(100 * selectedQuantity * selectedCartProduct.product.val)/100;
																this.getParent().getParent().getComponent(2).getComponent(1).setHtml(total + ' €');
															}
														}
														this.update();
													}
												}
											}
										}
									]
								},
								{	//total
									items: [
										{html: 'Total', style: 'font-size:.7em;'},
										{html: product.val + ' €', style: 'font-size:.9em; margin-top:.7em;'}
									]
								}
							]
						}
					],
					style: 'margin-left:.3em;'
				},
				{	//delete button
					xtype: 'button',
					ui: 'decline',
					iconCls: 'delete',
					iconMask: true,
					right: '.3em',
					top: '.6em',
					handler: function(){
						CartView.removeProduct(product);
					}
				}
			],
			style: 'background-color:#fff; margin-top:2px;'
		});
		return container;
	},
	// Update product and total
	updateProduct: function(selectedProduct){
		// Product quantity
		var quantityField = selectedProduct.productView.getComponent(1).getComponent(1).getComponent(1).getComponent(1);
		quantityField.setValue(parseInt(quantityField.getValue())+1);
		// Product amount
		var total = Math.floor(100 * quantityField.getValue() * selectedProduct.product.val) / 100;
		quantityField.getParent().getParent().getComponent(2).getComponent(1).setHtml(total + ' €');
	},
	// Remove a product from the cart
	removeProduct: function(product){
		// Remove product view
		var footerItems = this.content.getComponent(1).getComponent(0).getItems().items;
		var nFooterItems = footerItems.length;
		var productView = {};
		var i=0;
		for (i=0; i<nFooterItems; i++){
			productView = footerItems[i];
			if(productView.id == 'cart'+product.id){
				this.content.getComponent(1).getComponent(0).remove(productView);
				break;
			}
		}
		// Update cart data
		SenchaCart.cart.nProducts -= SenchaCart.cart.products[i].quantity;
		if(SenchaCart.cart.nProducts === 0){
			this.close();
		}
		SenchaCart.cart.products.splice(i,1);
		this.update();
	},
	// Update cart
	update: function(){
		if(SenchaCart.cart.nProducts > 0){
			this.footerOpener.show();
		}else{
			this.footerOpener.hide();
		}
		var nCartProducts=SenchaCart.cart.nProducts;
		this.productCounter.setHtml(nCartProducts+' product'+(nCartProducts===1?'':'s'));
		var cartTotal = 0;
		var nProducts = SenchaCart.cart.products.length;
		for(var i=0; i<nProducts; i++){
			var cartProduct = SenchaCart.cart.products[i];
			cartTotal += cartProduct.quantity * cartProduct.product.val;
		}
		cartTotal = Math.floor(100 * cartTotal) / 100;
		Ext.get('cartTotal').setHtml('<div class="x-inner"><div class="x-innerhtml">'+cartTotal+' €</div></div>');
	}
};