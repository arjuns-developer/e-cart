import fetchProducts from "../../utilis/fetchProducts.js";
import Products from "../../product-listing/js/product.js";

export default class Product extends Products {
    constructor(products) {
        super(products)
        this.handleProductDetail()

        document.getElementById('minus-button')?.addEventListener('click', this.handleQuantity.bind(this, 'minus-button'));
        document.getElementById('plus-button')?.addEventListener('click', this.handleQuantity.bind(this, 'plus-button'));
    }

    getProductData() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('id')
        if (id) {
            const productDetail = this.getProduct(parseInt(id))
            return productDetail

        }
        return null
    }

    displayProduct(data) {
        if (data) {
            const { image, title, price, units, description } = data
            const productImageElement = document.getElementById('product-image')
            if (productImageElement) {
                productImageElement.innerHTML = `<img src=${image}>`;
            }

            const productDetailElement = document.getElementById('product-detail-info')



            if (productDetailElement) {

                productDetailElement.innerHTML =
                    `
                <div class="title">${title}</div>
                <div class="price">₹${price}</div>
                <div class="stock">In Stock</div>
                <div class="description">
                    <span>Features And Details</span>
                    <div class="description-content" id="description-content">
                   
                    </div>
                </div>
                `
            }
            const descriptionContentElement = document.getElementById('description-content')

            description.forEach((item) => {
                let li = document.createElement("li");
                li.innerText = item;
                descriptionContentElement.appendChild(li);
            })
        }

    }

    handleProductDetail() {
        const data = this.getProductData()
        this.displayProduct(data)
    }

    handleQuantity(arg) {
        const idElement = document?.getElementById('quantity-id')
        const quantity = parseInt(idElement?.innerText)
        if (quantity) {
            if (arg === 'minus-button' && quantity > 1) {
                idElement.innerHTML = quantity - 1
            }
            if (arg === 'plus-button') {
                idElement.innerHTML = quantity + 1
            }
        }

    }

    // decreaseQuantity(){

    // }

}

const products = await fetchProducts()

const productObj = new Product(products)
