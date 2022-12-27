class Product {
    constructor() {
        this.products = []
    }

    async fetchProducts() {
        try {
            const response = await fetch('https://arjuns-developer.github.io/e-cart-json/db.json')
            const data = await response.json()
            this.products = data.products
            this.displayData()
        } catch (error) {
            console.log(error, 'error');
        }

    }

    displayData() {

        let tab='';
        this.products.forEach(({ title, price, image }) => {

            tab+= ` <div class="product-tile">
        <img class="product-image"
            src=${image} />
        <span>${title}</span>
        <span class="price">₹ ${price}</span>
    </div>`;



            document.getElementById('products-container-id').innerHTML=tab;
        })
    

        
        
   


    }

}

const productObj = new Product()
productObj.fetchProducts()
