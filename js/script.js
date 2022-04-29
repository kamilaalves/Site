const c = (el)=>document.querySelector(el); 
const cs = (el)=>document.querySelectorAll(el);

let cart = [];

function updateCart() {
    c('.menu-2 span').innerHTML = cart.length;
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; 
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        cart.map((itemCart, index)=>{
            let modelItem = modelos.find((itemBD)=>itemBD.id == itemCart.id);
            subtotal += modelItem.preco[itemCart.size] * itemCart.qt;
            let cartItem = c('.models .cart--item').cloneNode(true);
            let modelSizeNome;
            switch(itemCart.size) {
                case 0:
                    modelSizeNome = 'P';
                    break;
                case 1:
                    modelSizeNome = 'M';
                    break;
                case 2:
                    modelSizeNome = 'G';
            }
            cartItem.querySelector('img').src = modelItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${modelItem.nome} (${modelSizeNome})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = itemCart.qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(itemCart.qt > 1) {
                    itemCart.qt--
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                itemCart.qt++;
                updateCart();
            });
            c('.cart').append(cartItem);
        });
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

function closeModal(){
    c('.modelsWindowArea').style.opacity = 0;
    setTimeout(()=> {
        c('.modelsWindowArea').style.display = 'none';
    }, 500);
}

function main() {
    let modalQt = 0;
    let key = 0;

    modelos.map((item, index)=>{
        let modelsItem = c('.models .models-item').cloneNode(true);
        modelsItem.setAttribute('data-key', index);
        modelsItem.querySelector('.models-item--img img').src= item.img;
        modelsItem.querySelector('.models-item--preco').innerHTML = `R$ ${item.preco[0].toFixed(2)}`;
        modelsItem.querySelector('.models-item--nome').innerHTML = item.nome;
        modelsItem.querySelector('.models-item--desc').innerHTML = item.descricao;
        modelsItem.querySelector('a').addEventListener('click', (e)=>{
            e.preventDefault(); 
            key = e.target.closest('.models-item').getAttribute('data-key'); 
            modalQt = 1;
            c('.modelsBig img').src = modelos[key].img;
            c('.modelsInfo h1').innerHTML = modelos[key].nome;
            c('.modelsInfo--desc').innerHTML = modelos[key].descricao;
            c('.modelsInfo--size.selected').classList.remove('selected');
            cs('.modelsInfo--size').forEach((size, sizeIndex)=>{
                if(sizeIndex == 2) {
                    size.classList.add('selected');
                    c('.modelsInfo--atualPreco').innerHTML = `R$ ${modelos[key].preco[sizeIndex].toFixed(2)}`;
                }
                
                size.querySelector('span').innerHTML = modelos[key].sizes[sizeIndex];
            });
            c('.modelsInfo--qt').innerHTML = modalQt;
            c('.modelsWindowArea').style.opacity = 0; 
            c('.modelsWindowArea').style.display = 'flex';
            setTimeout(()=> {
                c('.modelsWindowArea').style.opacity = 1; 
            }, 200);
        });
        c('.models-area').append(modelsItem);
    });
        
    cs('.modelsInfo--cancelButton, .modelsInfo--cancelMobileButton').forEach((item)=>{
        item.addEventListener('click', closeModal);
    });

    c('.modelsInfo--qtmenos').addEventListener('click', ()=>{
        if(modalQt > 1) {
            modalQt--;
            c('.modelsInfo--qt').innerHTML = modalQt;
        }
    });

    c('.modelsInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        c('.modelsInfo--qt').innerHTML = modalQt;
    });

    cs('.modelsInfo--size').forEach((size, sizeIndex)=>{
        size.addEventListener('click', (e)=> {
            c('.modelsInfo--size.selected').classList.remove('selected');
            size.classList.add('selected');
            c('.modelsInfo--atualPreco').innerHTML = `R$ ${modelos[key].preco[sizeIndex].toFixed(2)}`;
        });
    });

    c('.modelsInfo--addButton').addEventListener('click', ()=>{
        
        let size = parseInt(c('.modelsInfo--size.selected').getAttribute('data-key'));
        let identifier = modelos[key].id+'@'+size;
        let locaId = cart.findIndex((item)=>item.identifier == identifier);
        if(locaId > -1){
            cart[locaId].qt += modalQt;
        } else {
            cart.push({
                identifier,
                id:modelos[key].id,
                size,
                qt:modalQt
            });
        }
        updateCart();
        closeModal();
    });

    c('.menu-2').addEventListener('click', ()=>{
        if(cart.length > 0){
            c('aside').style.left = '0';
        }
    });

    c('.menu-closer').addEventListener('click', ()=>{
        c('aside').style.left='100vw';
    });
}

export { main };
