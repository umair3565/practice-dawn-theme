
function handleProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    if (!productCards.length) return;

    productCards.forEach((card) => {

        const variantBoxes = card.querySelectorAll('.variant-box');
        const priceElement = card.querySelector('.variant-price');
        const comparePrice = card.querySelector('.compare-price');

        if (variantBoxes.length === 0) return;

        let selectedVariantId = variantBoxes[0].dataset.variantId;
        variantBoxes[0].classList.add('selected');

        variantBoxes.forEach((box) => {
            const quantity = parseInt(box.dataset.variantQuantity);

            if (quantity <= 0) {
                box.disabled = true;
                box.style.opacity = '0.6';
                box.style.pointerEvents = 'none';
                return;
            }

            box.addEventListener('click', () => {
                variantBoxes.forEach((b) => b.classList.remove('selected'));
                box.classList.add('selected');
                selectedVariantId = box.dataset.variantId;

                const selectedVariantPrice = box.dataset.variantPrice;
                if (priceElement) priceElement.textContent = selectedVariantPrice;

                const selectedVariantComparePrice = box.dataset.variantComparePrice;
                if (comparePrice) comparePrice.textContent = selectedVariantComparePrice;
            });
        });

        // --- Add to Cart ---
        const addToCartBtns = card.querySelectorAll('.add-to-bag-btn');

        addToCartBtns.forEach((btn) => {
            btn.addEventListener('click', async () => {
                try {
                    const response = await fetch('/cart/add.js', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({
                            id: selectedVariantId,
                            quantity: 1,
                        }),
                    });

                    const data = await response.json();
                    if (response.ok) {
                        if (window.openCartDrawer) window.openCartDrawer();
                        updateCartCount();
                    } else {
                        showToast(`❌ Shopify Error: ${data.message}`);
                    }
                } catch (error) {
                    showToast('❌ Something went wrong, please try again.');
                    console.error(error);
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', handleProductCards);