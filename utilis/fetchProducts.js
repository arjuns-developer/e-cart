/**
     * @property {Function} Fetches all products from the API and displays the products
     * @returns {void}
   */
async function fetchProducts() {
    try {
        const response = await fetch('https://main--stupendous-boba-ab2aa6.netlify.app/db.json')
        const data = await response.json()
        const products = await data.products
        return products
    } catch (error) {
        console.log(error, 'error');
    }

}

export default fetchProducts