const container = document.querySelector('.products')
const cart_items = document.querySelector('.cart-items')
const cart_1 = document.querySelector('.cart-1')
const cart_2 = document.querySelector('.cart-2')
const cart_counter = document.querySelector('.cart h2')
const order_total = document.querySelector('.cart-total-price')
const order_total_2 = document.querySelector('.cart-total-price-2')
const cart_inc_2 = document.querySelector('.cart-inc-2')
const cart_inc_1 = document.querySelector('cart_inc_1')
const confirmedOrder = document.querySelector('.confirmed-something')
const orderButton = document.querySelector('.order-button')
const popUp = document.querySelector('.pop-up')
const clearOrder =  document.querySelector('.clear-order');


//Fetching the data from the JSON file and rendering the data.

const getProducts = async () =>{
    const resource = await fetch('./data.json');
    const data = await resource.json();
    
    return data
}

getProducts().then(datas => {
    datas.forEach(data => {
        container.innerHTML += 
        `
            <div 
            data-main=${data.category}
            data-name=${encodeURIComponent(data.name)}
            data-price=${parseFloat(data.price).toFixed(2)}
            data-thumbnail=${data.image.thumbnail}
            class="product">
                <img class="desktop" src=${data.image.desktop} alt="">
                <img class="tablet" src=${data.image.tablet} alt="">
                <img class="mobile" src=${data.image.mobile} alt="">
                <p class="f-main">${data.category}</p>
                <p class="f-combo">${data.name}</p>
                <p class="f-price">$ ${parseFloat(data.price).toFixed(2)}</p>

                <button class="add-cart-but">
                    <div class="cart-inc-1">
                      <img src="./assets/images/icon-add-to-cart.svg" alt="">
                      Add to cart
                    </div>

                    <div class="cart-inc-2">
                      <img class="dec" src="./assets/images/icon-decrement-quantity.svg" alt="" />
                      <span class="quant">1</span>
                      <img class="inc" src="./assets/images/icon-increment-quantity.svg" alt="" />
                    </div>
                </button>

            </div>
        `
        console.log(data.name)
    })
})

let orderItems = [];

const updateCart = () =>{
    cart_items.innerHTML = '';
    let totalQuantity = 0;
    
    let sumTotalPrice = 0 

    orderItems.forEach(item =>{
        const totalPrice = (item.price * item.quantity).toFixed(2);
        totalQuantity += item.quantity;
      
        item = {...item, totalPrice:totalPrice};
        sumTotalPrice += parseFloat(totalPrice);

        cart_items.innerHTML += `
          <div class="cart-item">
            <div class="order-item">
              <p class="cart-id">${item.name}</p>
              <p><span>${item.quantity}x</span> <span>@ $${item.price}</span> <span>$${totalPrice}</span></p>
            </div>
           <img src="./assets/images/icon-remove-item.svg" alt="">
          </div>
        `
    });
    cart_counter.innerText = `Your Cart (${totalQuantity})`;
    order_total.innerHTML = `$${sumTotalPrice.toFixed(2)}`;
 }



container.addEventListener('click', e=>{
    
     if(e.target.className==='cart-inc-1'){
         //activate and deactivate the cart-1 and cart-2 displays
        cart_1.style.display = 'none';
        cart_2.style.display = 'block';

        const productElement = e.target.closest('.product');
        const itemCategory = productElement.dataset.main;
        const itemName = decodeURIComponent(productElement.dataset.name);
        const itemPrice =  productElement.dataset.price;
        const existingItem = orderItems.find(item => item.name === itemName);
        const thumbnail = productElement.dataset.thumbnail
        const inc2 =  productElement.querySelector('.cart-inc-2');
        const inc1 =  productElement.querySelector('.cart-inc-1');

        inc2.style.display = 'flex';
        inc1.style.display = 'none';

        productElement.querySelector('img').classList.add('select');

        if(existingItem){
            existingItem.quantity += 1;
        }

        else{
            orderItems.push(
                {
                    category: itemCategory,
                    name: itemName,
                    price: itemPrice,
                    quantity:1,
                    thumbnail: thumbnail
                }
            )
        }
        console.log(orderItems); 
        updateCart();

    }


    if(e.target.className === 'inc'){
        const productElement = e.target.closest('.product');
        const itemCategory = productElement.dataset.main;
        const itemName = decodeURIComponent(productElement.dataset.name);
        const itemPrice =  productElement.dataset.price;
        const quantity = productElement.querySelector('span');

        const existingItem = orderItems.find(item => item.name === itemName);

        if(existingItem){
            existingItem.quantity += 1;
            quantity.textContent = existingItem.quantity;

        }
    
        console.log(orderItems); 
        updateCart();
    }

    else if(e.target.className === 'dec'){
        const productElement = e.target.closest('.product');
        const itemCategory = productElement.dataset.main;
        const itemName = decodeURIComponent(productElement.dataset.name);
        const itemPrice =  productElement.dataset.price;
        const quantity = productElement.querySelector('span');

        const existingItem = orderItems.find(item => item.name === itemName);

        if(existingItem && existingItem.quantity !== 1){
            existingItem.quantity -= 1;
            quantity.textContent = existingItem.quantity;
        }
    
        console.log(orderItems); 
        updateCart();
    }
})


cart_items.addEventListener('click', e=>{

    

    let cart_id = e.target.previousElementSibling.children[0].textContent;

    console.log(cart_id);
    
    if(e.target.tagName = 'IMG'){
        const cartItemName = e.target.closest('.cart-item').querySelector('.cart-id').textContent.trim();
        
        // Find the corresponding product div in the main container by matching data-name
        const productElement = container.querySelector(`[data-name="${encodeURIComponent(cartItemName)}"]`);
        

        if (productElement) {
            // Find the .cart-inc-2 element inside that product div and hide it
            const cartInc2 = productElement.querySelector('.cart-inc-2');
            const cartInc1 = productElement.querySelector('.cart-inc-1')
            if (cartInc2) {
                cartInc2.style.display = 'none';
                cartInc1.style.display = 'flex';
                productElement.querySelector('img').classList.remove('select');
            }
        }

        let exisitingItem = orderItems.findIndex(item => cart_id === item.name)
        
        console.log(exisitingItem)
        if(exisitingItem !== -1){
            orderItems.splice(exisitingItem, 1)
            updateCart()
        }
        console.log(orderItems)

    }

})

orderButton.addEventListener('click', e=>{
    popUp.style.display = 'flex';

    let totalQuantity = 0;
    let sumTotalPrice = 0 


    orderItems.forEach(item=>{

        const totalPrice = (item.price * item.quantity).toFixed(2);
        totalQuantity += item.quantity;
      
        item = {...item, totalPrice:totalPrice};
        sumTotalPrice += parseFloat(item.totalPrice);

        confirmedOrder.innerHTML +=
        `
          <div class="confirmed-order-item">
              <div class="item">
                <img src=${item.thumbnail} alt="">
                <div class="item-child">
                  <p>${item.name}</p>
                  <p><span>${item.quantity}x</span> <span>@ $${item.price}</span></p>
                </div>
              </div>
              <p><strong>$${totalPrice}</strong></p>
            </div>
        `
    })

    order_total_2.innerText = `$${sumTotalPrice.toFixed(2)}`;


})


clearOrder.addEventListener('click', e => {
    location.reload()
})

console.log(orderItems);




