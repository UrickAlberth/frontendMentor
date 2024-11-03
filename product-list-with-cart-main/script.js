// Função para buscar dados do arquivo JSON
// Função para carregar dados e gerar elementos
let products;
let btnADDs = [];
async function loadProducts() {
    try {
        const response = await fetch('./data.json');
        products = await response.json();

        const productList = document.getElementById('product-list');
        let productId = -1;
        // Itera sobre os produtos e cria o HTML dinâmico
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            const productDivBtimg = document.createElement('div');
            productDivBtimg.classList.add('productBtImg');


            // Criando elementos de imagem com fontes responsivas
            const picture = document.createElement('picture');
            const sourceDesktop = document.createElement('source');
            sourceDesktop.media = '(min-width: 1024px)';
            sourceDesktop.srcset = product.image.desktop;

            const sourceTablet = document.createElement('source');
            sourceTablet.media = '(min-width: 768px)';
            sourceTablet.srcset = product.image.tablet;

            const sourceMobile = document.createElement('source');
            sourceMobile.media = '(max-width: 767px)';
            sourceMobile.srcset = product.image.mobile;

            const img = document.createElement('img');
            img.src = product.image.thumbnail;
            img.alt = product.name;

            // Adicionando fontes de imagem
            picture.append(sourceDesktop, sourceTablet, sourceMobile, img);
            productDiv.appendChild(picture);

            //botão de adicionar o produto
            const buttonAdd = document.createElement('button');

            const icon = document.createElement('img');
            icon.src = 'assets/images/icon-add-to-cart.svg';
            icon.alt = 'Add to Cart Icon';

            productId++;
            buttonAdd.id = "id" + productId;
            buttonAdd.appendChild(icon);
            buttonAdd.appendChild(document.createTextNode("Add to Cart"));
            buttonAdd.onclick = ((id) => {
                return () => addToCart(id);
            })(productId);
            const btf = ((id) => { return () => addToCart(id); })(productId);
            const novoElemento = buttonAdd.cloneNode(true);
            btnADDs.push([novoElemento, btf])
            productDiv.appendChild(buttonAdd);

            // Categoria do produto
            const category = document.createElement('p');
            category.classList.add('category');
            category.textContent = product.category;
            productDivBtimg.appendChild(category);

            // Nome do produto
            const name = document.createElement('h3');
            name.textContent = product.name;
            productDivBtimg.appendChild(name);


            // Preço do produto
            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = product.price.toFixed(2);
            productDivBtimg.appendChild(price);
            productDiv.appendChild(productDivBtimg);

            // Adiciona o produto na lista
            productList.appendChild(productDiv);


        });
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', loadProducts);


// Array para armazenar itens do carrinho
let cart = [];

// Função para adicionar um item ao carrinho

function addToCart(productId) {
    // Verifica se o produto já está no carrinho
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
        // Aumenta a quantidade

    } else {
        // Busca os produtos novamente para encontrar o produto pelo ID

        cart.push({
            ...products[productId],
            id: productId,
            quantity: 1
        });
        show_area_finalizar()
        updateCart();
        alterarButtonAdd(productId)

    }
    updateCart();
    alterarButtonAdd(productId)
}

function increment(id) {
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1; // aumenta a quantidade
    }
    alterarButtonAdd(id)
    updateCart();
}
function decrement(id) {
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity -= 1; // diminui a quantidade
        if (existingProduct.quantity <= 0) {
            removeFromCart(id)
        } else {
            alterarButtonAdd(id)
        }
    }

    updateCart();
}

function alterarButtonAdd(id) {
    const button = document.querySelector('#id' + id);

    button.classList.add('bt_select');
    button.innerHTML = `
    <span onclick="decrement(${id})"><img src="assets/images/icon-decrement-quantity.svg"/></span>
    ${cart.find(produt => produt.id === id).quantity}
    <span onclick="increment(${id})"><img src="assets/images/icon-increment-quantity.svg"/></span>
    `;
    button.onclick = null;
    button.replaceWith(button.cloneNode(true));


}

function realterarButton(id) {


    const button = document.querySelector('#id' + id);
    button.classList.remove('bt_select');
    button.innerHTML = `
    <img src="assets/images/icon-add-to-cart.svg" alt="Add to Cart Icon">Add to Cart
    `;
    const addToCartF = () => addToCart(id);
    setTimeout(() => {
        button.addEventListener('click', addToCartF);
    }, 500);


}

function show_area_finalizar() {
    const area = document.querySelector('#area_finalizar');
    const empty = document.querySelector('#empty');
    area.style.display = cart.length > 0 ? 'block' : 'none';
    empty.style.display = cart.length == 0 ? 'flex' : 'none';
}

// Função para atualizar o carrinho
function updateCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('#cart-count');
    const cartCount2 = document.querySelector('#cart-count2');
    const cartTotal = document.querySelector('.cart-total p'); //criar o elemento p no card
    cartItemsContainer.innerHTML = ''; // Limpa o conteúdo do carrinho

    let total = 0;
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <p class="cart-item-title">${item.name}</p>
                <p class="cart-item-price"><span class="destaque">${item.quantity}x</span> @$${item.price.toFixed(2)} $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
            <img src="assets/images/icon-remove-item.svg">
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);

        total += parseFloat(item.price) * parseFloat(item.quantity);
    });
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount2.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotal.innerHTML = `Order Total: <span class="total-price">$${total.toFixed(2)}</span>`;

    // Exibe ou oculta o carrinho se tiver ou não itens
    //document.querySelector('.cart').style.display = cart.length > 0 ? 'block' : 'none';
}

// Função para remover item do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    show_area_finalizar()
    realterarButton(productId)
}

// Abre o carrinho quando clica no ícone
document.querySelector('.cart-icon').addEventListener('click', () => {
    const cart = document.querySelector('.cart');
    cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
});

function finalizeOrder() {
    const confirmedItemsContainer = document.querySelector('.confirmed-items');
    let total = 0;
    confirmedItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const confirmedItem = document.createElement('div');
        confirmedItem.classList.add('confirmed-item');
        confirmedItem.innerHTML = `
            
                <img src="${item.image.thumbnail}">
            <div class="confirmed-item-info">
                <p class="confirmed-item-title">${item.name}</p>
                <p class="confirmed-item-price"><span class="destaque">${item.quantity}x</span> @$${item.price.toFixed(2)}</p>
            </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            
           
        `;
        confirmedItemsContainer.appendChild(confirmedItem);
        total += parseFloat(item.price) * parseFloat(item.quantity);

    });

    const totalItem = document.createElement('div');
    totalItem.classList.add('confirmed-item');
    totalItem.innerHTML = `
            <div class="confirmed-item-info">
                <p class="confirmed-item">Order Total <span class="total-price">$${total.toFixed(2)}</span></p>                
            </div>
           
        `;
    confirmedItemsContainer.appendChild(totalItem);
    document.getElementById('order_confirmed').classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function startNewOrder() {
    cart.forEach(item => {
        removeFromCart(item.id)
    });
    document.getElementById('order_confirmed').classList.add('hidden');
    document.getElementById('modal-overlay').classList.add('hidden');
}

