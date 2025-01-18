document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.querySelector('.item__container');
    const availableItemsContainer = document.getElementById('available-items');
    const totalElement = document.querySelector('.total__amount');
    const downloadPngButton = document.getElementById('download-png');
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
    let sidebarOpen = false;

    fetch('objets.json')
        .then(response => response.json())
        .then(data => {
            data.items.forEach(item => {
                const availableItemElement = document.createElement('div');
                availableItemElement.classList.add('item');
                availableItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <span>${item.name}</span>
                    <button class="add-item" data-id="${item.id}">Add</button>
                `;
                availableItemsContainer.appendChild(availableItemElement);
            });

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
                <div class="item__image__container">
                    <div class="item__image"><img src="${item.image}" alt="${item.name}"></div>
                    <div class="item__amount">${item.quantity}</div>
                </div>
                <div class="item__name">${item.name}</div>
                <div class="item__price">${item.price * item.quantity} <img src="./zhanahoriapreciobyNalexnu.png" alt="carrot"></div>
                <button class="edit-quantity" data-id="${item.id}">✎</button>
            `;
            itemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        totalElement.innerHTML = `${total} <img src="./zhanahoriapreciobyNalexnu.png">`;

        document.querySelectorAll('.edit-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                currentItem = inventory.find(item => item.id == id);
                itemNameElement.textContent = currentItem.name;
                quantityInput.value = currentItem.quantity;
                modal.style.display = 'flex';
            });
        });
    }

    downloadPngButton.addEventListener('click', () => {
        html2canvas(document.querySelector('.inventory')).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'inventory.png';
            link.click();
        });
    });

    toggleSidebarButton.addEventListener('click', () => {
        sidebarOpen = !sidebarOpen;
        sidebar.style.left = sidebarOpen ? '0px' : '-270px';
    });
});
