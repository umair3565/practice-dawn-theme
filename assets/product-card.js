function handleProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    if (!productCards.length) return;

    productCards.forEach((card) => {
        const variantBoxes = card.querySelectorAll('.variant-box');
        const priceElement = card.querySelector('.variant-price');
        const comparePrice = card.querySelector('.compare-price');
        const mainImage = card.querySelector('.product-card-img');

        if (!variantBoxes.length) return;

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

            // show variant image on hover
            box.addEventListener('mouseenter', () => {
                if (box.dataset.variantImage) {
                    mainImage.src = box.dataset.variantImage;
                }
            });

            // restore selected variant image when no mouse leave
            box.addEventListener('mouseleave', () => {
                const selectedBox = card.querySelector('.variant-box.selected');
                if (selectedBox && selectedBox.dataset.variantImage) {
                    mainImage.src = selectedBox.dataset.variantImage;
                }
            });

            // select variant image when clilcked
            box.addEventListener('click', () => {
                variantBoxes.forEach((b) => b.classList.remove('selected'));
                box.classList.add('selected');
                selectedVariantId = box.dataset.variantId;

                // Update price
                if (box.dataset.variantPrice && priceElement) {
                    priceElement.textContent = box.dataset.variantPrice;
                }
                if (box.dataset.variantComparePrice && comparePrice) {
                    comparePrice.textContent = box.dataset.variantComparePrice;
                }

                // Update main image
                if (box.dataset.variantImage) {
                    mainImage.src = box.dataset.variantImage;
                }
            });
        });

        // Add to Cart 
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
