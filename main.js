const user = JSON.parse(localStorage.getItem('user'))
const cartNumber = document.querySelector('.cart-number')
updateCartButton()

function updateCartButton(){
    cartNumber.textContent = user.current_order.length
}

const addToCartButton = document.querySelector('.add-to-cart')
if(addToCartButton){
    addToCartButton.onclick = function(){
        const priceStr = document.querySelector('.product-cart__price').textContent.trim().slice(0, -2)
        user.current_order.push({
            id: Number (document.querySelector('.product-cart__id').textContent),
            name: document.querySelector('.title').textContent,
            price: parseInt(priceStr.replaceAll(' ','')),
            qty: 1
        })
        updateCartButton()
        localStorage.setItem('user', JSON.stringify(user))
    }
}


const products = document.querySelector('.cart__items.products')
if (products){
    updateCart()
}

function updateCart(){
    products.innerHTML = ''
    const productTemplate = document.querySelector('template')
    for(const item of user.current_order){
        const clone = productTemplate.content.cloneNode(true);
        const productName = clone.querySelector(".product__name");
        const productPrice = clone.querySelector('.product__price')
        const productQty = clone.querySelector('.product__num input')
        const productId = clone.querySelector('.product__id')
        productName.textContent = item.name
        productPrice.textContent = item.price
        productQty.value = item.qty
        productId.textContent = item.id
        const removeButton = clone.querySelector(".remove-btn")
        removeButton.onclick = onRemoveButtonClick
        products.append(clone)
    }
}

function onRemoveButtonClick(event){
    const container = event.currentTarget.parentElement.parentElement.parentElement
    const current_order = []
    const id = Number (container.querySelector('.product__id').textContent)
    for(const item of user.current_order){
        if (item.id !== id){
            current_order.push(item)   
        }
    }
    user.current_order = current_order
    localStorage.setItem('user', JSON.stringify(user))
    updateCartButton()
    updateTotalPrice()
    updateCartInfo()
    container.remove()
}

const productNumber = document.querySelector('.product__num')
if (productNumber) {
    productNumber.onchange = function(){
        productNumber.style.width = ((productNumber.value.length + 1) * 8) + 'px'
    }
}

const clearCartButton = document.querySelector('.clear-cart')
if (clearCartButton){
    clearCartButton.onclick = function(){
        user.current_order = []
        localStorage.setItem('user', JSON.stringify(user))
        updateCart()
        updateCartInfo()
        updateCartButton()
    }
}

const totalPrice = document.querySelector('.cart__info-title')
if (totalPrice){
    updateTotalPrice()
}

function updateTotalPrice(){
    let sum = 0
    for(const item of user.current_order){
        sum += item.price
    }
    totalPrice.textContent = sum + ' ₽'
}

const cartInfo = document.querySelector('.cart__info')
if (cartInfo){
    updateCartInfo()
}

function updateCartInfo(){
    if (user.current_order.length === 0){
        cartInfo.classList.add('hidden')
    } else {
        cartInfo.classList.remove('hidden')
    }
}