document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items');
    const availableItemsContainer = document.getElementById('available-items');
    const totalElement = document.getElementById('total');
    const sellAllButton = document.getElementById('sell-all');
    const downloadPngButton = document.getElementById('download-png');
    const inventoryElement = document.getElementById('inventory');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const itemNameElement = document.getElementById('item-name');
    const quantityInput = document.getElementById('quantity');
    const addToInventoryButton = document.getElementById('add-to-inventory');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');

    let inventory = [];
    let total = 0;
    let currentItem = null;

    fetch('objets.json')
        .then(response => response.json())
        .then(data => {
            data.items.forEach((item, index) => {
                const availableItemElement = document.createElement('div');
                availableItemElement.classList.add('item');
                availableItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <span>${item.name}</span>
                    <button class="add-item" data-id="${item.id}">Add</button>
                `;
                availableItemsContainer.appendChild(availableItemElement);
            });

            if (data.items.length >= 4) {
                availableItemsContainer.style.overflowY = 'auto';
            }

            document.querySelectorAll('.add-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    currentItem = data.items.find(item => item.id == id);
                    itemNameElement.textContent = currentItem.name;
                    quantityInput.value = 1;
                    modal.style.display = 'flex';
                });
            });
        })
        .catch(error => console.error('Error loading inventory:', error));

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    addToInventoryButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        if (!isNaN(quantity) && quantity > 0) {
            addItemToInventory(currentItem, quantity);
            modal.style.display = 'none';
        } else {
            alert('Please enter a valid quantity.');
        }
    });

    function addItemToInventory(item, quantity) {
        let existingItem = inventory.find(i => i.id === item.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            inventory.push({ ...item, quantity: quantity });
        }

        updateInventoryUI();
    }

    function updateInventoryUI() {
        itemsContainer.innerHTML = '';
        total = 0;

        inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <span>x${item.quantity}</span>
                <span id="total">${item.price * item.quantity} <img class="carrot" src="./zhanahoriapreciobyNalexnu.png" alt="carrot x16"></span>
            `;
            itemsContainer.appendChild(itemElement);
            total += item.quantity * item.price;
        });

        totalElement.innerHTML = `${total} <img class="carrot" src="./zhanahoriapreciobyNalexnu.png">`;
    }

    sellAllButton.addEventListener('click', () => {
        totalElement.innerHTML = '0 <img class="carrot" src="./zhanahoriapreciobyNalexnu.png" alt="carrot x16">';
        itemsContainer.innerHTML = '';
        inventory = [];
    });

    const inventoryContainer = document.querySelector('.container');
    const originalBodyStyle = document.body.style.cssText;

    downloadPngButton.addEventListener('click', () => {
        // Hide everything else
        document.body.style.visibility = 'hidden';
        inventoryContainer.style.visibility = 'visible';

        html2canvas(inventoryContainer, { backgroundColor: null }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'inventory.png';
            link.click();

            // Restore original visibility
            document.body.style.cssText = originalBodyStyle;
        });
    });

    toggleSidebarButton.addEventListener('click', () => {
        if (sidebar.style.left === '0px') {
            sidebar.style.left = '-270px';
        } else {
            sidebar.style.left = '0px';
        }
    });
});
