const app = Vue.createApp({

    data() {
        return {
            data: [
                { id: 1, name: "Foo" },
                { id: 2, name: "Bar" },
                { id: 3, name: "Baz" },
                { id: 4, name: "Foobar" }
            ],

            orders: null,
            showOrders: false,
            
            search: "",
            filterText: "",
            cart: [],
            isCartVisible: false,
            cartSum: 0,

            // data used to log in
            showErrorMessage: false,
            showAuthentication: false,
            showTakenMessage: false,
            admin: false,
            adminData: null,

            user: null,
            registerForm: {
                username: '',
                email: '',
                password: '',
            },
            loginForm: {
                username: '',
                password: '',
            },
            apiUrl: 'https://ivm108.informatik.htw-dresden.de/ewa/g17/EWA_Beleg/', // BackendURL
            stripe: null,
        };
    },

    computed: {
        filteredData() {
            return this.data.filter(p => {
                return p.name.toLowerCase().indexOf(this.search.toLowerCase()) != -1;
            });
        },
    },

    mounted() {
        this.fetchData();
    },

    methods: {
        async fetchData() {

            console.log("Now fetching data..");

            fetch('verbindungDatenbank.php')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched: ', data);
                    this.data = data.products;
                    console.log("Vue data:", this.data);
                })
                .catch(error => {
                    console.log("Couldnt fetch data from DB, trying data.json instead");

                    const url = 'data.json';
                    // const url = 'https://ivm108.informatik.htw-dresden.de/ewa/demos/vl_demo1/data.json';
                    const options = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    };


                    fetch(url, options)
                        .then(response => response.json())
                        .then(data => {
                            console.log('Fetched: ', data);
                            this.data = data.products;
                            console.log("Vue data:", this.data);
                        })
                        .catch(error => {
                            console.error('Error fetching data', error);
                        });

                })

        },
        addToCart(product, quantityToAdd) {
            const cartProduct = this.cart.find(p => p.id === product.id);


            if (cartProduct) {
                cartProduct.cartQuantity += quantityToAdd;
            } else {
                this.cart.push({ ...product, cartQuantity: 1, selected: 1 });
            }
            console.log(this.cart);
            this.calculateCartSum();

            // Verringere die Menge im Lagerbestand um 1 (Dummy-Logik)
            //product.quantity -= quantityToAdd;
        },
        removeFromCart(cartProduct) {
            const index = this.cart.findIndex(p => p.id === cartProduct.id);

            if (index !== -1) {
                // Remove the product from the cart if found
                this.cart.splice(index, 1);

                // Optionally, you might want to increase the quantity in the inventory (dummy logic)
                //const product = this.data.find(product => product.id === cartProduct.id);
                //if (product) {
                //  product.quantity += cartProduct.cartQuantity;
                //}

                console.log(`Product with ID ${cartProduct.id} removed from the cart.`);
                this.calculateCartSum();
            } else {
                console.warn(`Product with ID ${cartProduct.id} not found in the cart.`);
            }
        },
        calculateCartSum() {
            this.cartSum = 0;
            this.cart.forEach((cartProduct) => {
                this.cartSum = this.cartSum + (cartProduct.selected * cartProduct.preis);
            });
            this.cartSum = this.cartSum.toFixed(2);
            
        },
        toggleCart() {
            this.isCartVisible = !this.isCartVisible;
        },
        checkout() {
            const carttxt = JSON.stringify({ products: this.cart });
            
            fetch('stripe_redirect.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: carttxt,
            })
                .then(response => response.json())
                .then(session => {
                    // Leite den Benutzer zur Stripe-Checkout-Seite weiter
                    this.stripe.redirectToCheckout({ sessionId: session.id });
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        },
        getAvailableQuantities(cartProduct) {
            const maxQuantity = Math.min(cartProduct.quantity, 100);

            // Erstelle eine Liste von 1 bis zur begrenzten Menge (maxQuantity)
            return Array.from({ length: maxQuantity }, (_, index) => index + 1);
        },
        toggleOrders() {
            console.log("Fetching Orders..");

            fetch('getOrders.php')
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched: ', data);
                    this.orders = data.orders;
                    console.log("Orders:", this.orders);
                })
                .catch(error => {
                    console.error('Error during getOrders', error);
                })

                this.showOrders = !this.showOrders;

        },



        // login methods
        async register() {
            console.log("Registriere..");
            try {
                const response = await fetch(`${this.apiUrl}register.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.registerForm),
                });

                const data = await response.json();

                if (data.token) {
                    console.log("Register Received:  " + data.token);
                    localStorage.setItem('token', data.token);
                    this.setUserFromToken();
                }
                else {
                    console.log(data.message);
                    this.showTakenMessage = true;
                    setTimeout(() => {
                        this.showTakenrMessage = false;
                      }, 5000);
                }

                this.registerForm = {
                    username: '',
                    email: '',
                    password: '',
                };
            } catch (error) {
                console.error('Error during registration:', error);
            }
        },
        async login() {
            console.log("Login..");
            try {
                const response = await fetch(`${this.apiUrl}login.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.loginForm),
                });

                const data = await response.json();
                console.log(data);
                if (data.token) {
                    console.log("Login Received:  " + data.token);
                    localStorage.setItem('token', data.token);
                    this.setUserFromToken();
                    if(data.orders) {
                        console.log("Admindata loaded");
                        this.adminData = data.orders;
                    }
                }
                else {
                    console.log(data.message);
                    this.showErrorMessage = true;
                    setTimeout(() => {
                        this.showErrorMessage = false;
                      }, 5000);
                }

                this.loginForm = {
                    email: '',
                    password: '',
                };
            } catch (error) {
                console.error('Error during login:', error);
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.user = null;
            this.adminData = null;
        },
        setUserFromToken() {
            const token = localStorage.getItem('token');
            console.log("Encryp. token: ");
            console.log(token);
            if (token) {
                const decodedToken = this.parseJwt(token);
                this.user = decodedToken;
                console.log(decodedToken);
            }
        },
        parseJwt(token) {
            console.log(token);
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            console.log(jsonPayload);
            return JSON.parse(jsonPayload);
        },

        toggleAuthentication() {
            this.showAuthentication = !this.showAuthentication;
        },

    },
    created() {
        this.setUserFromToken();
        this.stripe = Stripe('pk_test_51OMTatGS0rXKJa7OAhwefY6qhtwDrNz1G0jSzXceu1D1gH2m6Q3c5hEG5gEG0X4f3is9AKdTLZ0TVLA3K1y7co9Z00ta1vSe3a');
    },
});


app.mount("#app");