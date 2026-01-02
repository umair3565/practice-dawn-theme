// Cart drawer functions
function handleCartDrawer() {

    const cartLinks = document.querySelectorAll('.cart-link')
    const cartDrawerOverlay = document.querySelector('.cart-drawer-overlay')

    window.openCartDrawer = async function () {
        const cartDrawerOverlay = document.querySelector('.cart-drawer-overlay');

        cartDrawer.classList.add('open');
        cartDrawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Fetch the latest cart drawer HTML to update items
        try {
            const res = await fetch(`?section_id=${CartDrawerSectionId}`);
            const htmlText = await res.text();
            const parser = new DOMParser();
            const newCart = parser.parseFromString(htmlText, 'text/html').getElementById('cartDrawer');
            cartDrawer.innerHTML = newCart.innerHTML;

            // Re-initialize cart functionality
            handleSwiper();
            initialShippingBar();
        } catch (err) {
            console.error('Error updating cart drawer:', err);
        }
    }

    function closeCartDrawer() {
        cartDrawer.classList.remove('open')
        cartDrawerOverlay.classList.remove('active')
        document.body.style.overflow = 'auto'
    }

    cartLinks.forEach(link => link.addEventListener('click', window.openCartDrawer))
    cartDrawerOverlay.addEventListener('click', closeCartDrawer)

    cartDrawer.addEventListener('click', (e) => {
        if (e.target.closest('#CartDrawerClose')) {
            closeCartDrawer()
        }
    })

}

async function updateCartCount() {
    const cartBadges = document.querySelectorAll('.cart-badge');
    if (!cartBadges.length) return;

    try {
        const res = await fetch('/cart.js');
        if (!res.ok) throw new Error('Failed to fetch cart data');

        const cart = await res.json();

        cartBadges.forEach(badge => {
            badge.textContent = cart.item_count;
        });
    } catch (err) {
        console.error('Error updating cart count:', err);
    }
}