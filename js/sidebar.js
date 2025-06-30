// sidebar.js

import { prods, prodLabels, tooltipLabels, defaultprods, prodBundles, attachSidebarToggleHandler } from './utils.js';

export function initializeSidebar(activeProds, updateCallback) {
    // Clear existing activeProds
    activeProds.clear();

    // Check for existing session state
    const savedToggles = sessionStorage.getItem('activeProds');

    if (savedToggles) {
        // Restore previously selected products in this session
        const parsed = JSON.parse(savedToggles);
        parsed.forEach(prod => activeProds.add(prod));
    } else {
        // First load of session: show default products
        defaultprods.forEach(prod => activeProds.add(prod));
        sessionStorage.setItem('activeProds', JSON.stringify([...activeProds]));
    }

    // Initialize Jump To Product dropdown
    initializejumpToProductBundleMenu(activeProds, updateCallback);

    // Get containers
    const allToggleContainer = document.getElementById('all-toggle');
    const productTogglesContainer = document.getElementById('product-toggles');
    allToggleContainer.innerHTML = '';
    productTogglesContainer.innerHTML = '';

    // Add Toggle All option at the top
    const toggleAllWrapper = document.createElement('div');
    toggleAllWrapper.className = 'toggle-container all-toggle-container';

    const toggleAllLabel = document.createElement('label');
    toggleAllLabel.className = 'toggle-label all-toggle-label';
    toggleAllLabel.textContent = 'All';
    toggleAllLabel.style.fontWeight = 'bold';

    const toggleAllSwitch = document.createElement('label');
    toggleAllSwitch.className = 'switch';

    const toggleAllInput = document.createElement('input');
    toggleAllInput.type = 'checkbox';
    toggleAllInput.checked = activeProds.size === prods.length;
    toggleAllInput.id = 'toggle-all-products';

    const toggleAllSlider = document.createElement('span');
    toggleAllSlider.className = 'slider';

    toggleAllSwitch.appendChild(toggleAllInput);
    toggleAllSwitch.appendChild(toggleAllSlider);

    toggleAllWrapper.appendChild(toggleAllSwitch);
    toggleAllWrapper.appendChild(toggleAllLabel);

    allToggleContainer.appendChild(toggleAllWrapper);

    // --- Add Reset Order Button ---
    const resetOrderBtn = document.createElement('button');
    resetOrderBtn.textContent = 'Reset Order';
    resetOrderBtn.className = 'reset-order-btn';
    resetOrderBtn.type = 'button';
    resetOrderBtn.title = 'Reset product order to default';

    resetOrderBtn.addEventListener('click', () => {
        sessionStorage.removeItem('prodsOrder');
        // Re-initialize the sidebar in default order
        initializeSidebar(activeProds, updateCallback);
        // Immediately update the images to match the new order
        updateCallback();
    });

    allToggleContainer.appendChild(resetOrderBtn);
    // --- End Reset Order Button ---

    // Create individual product toggles
    const productInputs = [];
    let order = prods;
    const savedOrder = sessionStorage.getItem('prodsOrder');
    if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        // Only use products that still exist in prods
        order = parsedOrder.filter(p => prods.includes(p));
        // Add any new products not in saved order
        order = order.concat(prods.filter(p => !order.includes(p)));
    }

    order.forEach((prod) => {
        const i = prods.indexOf(prod);
        const wrapper = document.createElement('div');
        wrapper.className = 'toggle-container product-toggle-container';

        // Drag handle
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.title = 'Drag to reorder';
        dragHandle.innerHTML = '&#9776;'; // Unicode "hamburger" icon

        // Toggle label with tooltip on hover
        const label = document.createElement('label');
        label.className = 'toggle-label product-toggle-label tooltip';
        label.textContent = prodLabels[i];

        // Tooltip text (shown on label hover)
        const tooltipText = document.createElement('span');
        tooltipText.className = 'tooltiptext';
        tooltipText.textContent = tooltipLabels[i];
        label.appendChild(tooltipText);

        label.addEventListener('mouseenter', function (e) {
            label.classList.add('show-tooltip');
        });
        label.addEventListener('mousemove', function (e) {
            const tooltip = label.querySelector('.tooltiptext');
            if (tooltip) {
                // Offset so the tooltip doesn't cover the cursor
                tooltip.style.left = (e.clientX + 22) + 'px';
                tooltip.style.top = (e.clientY + 22) + 'px';
            }
        });
        label.addEventListener('mouseleave', function (e) {
            label.classList.remove('show-tooltip');
        });
        label.addEventListener('click', function (e) {
            // Only respond to left click (main button)
            if (e.button === 0) {
                jumpToProductBundleAnchor(prod);
            }
        });

        const switchLabel = document.createElement('label');
        switchLabel.className = 'switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = activeProds.has(prod);
        input.name = prod;
        productInputs.push(input);

        const slider = document.createElement('span');
        slider.className = 'slider';

        switchLabel.appendChild(input);
        switchLabel.appendChild(slider);

        // Order: handle | switch | label
        wrapper.appendChild(dragHandle);
        wrapper.appendChild(switchLabel);
        wrapper.appendChild(label);

        productTogglesContainer.appendChild(wrapper);

        // Individual product toggle
        input.addEventListener('change', () => {
            if (input.checked) {
                activeProds.add(prod);
                updateCallback();
                setTimeout(() => {
                    const el = document.getElementById(prod);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                activeProds.delete(prod);
                updateCallback();
            }
            sessionStorage.setItem('activeProds', JSON.stringify([...activeProds]));
            toggleAllInput.checked = activeProds.size === prods.length;

            updateBundleDropdown(activeProds, prodBundles); 
        });

    });

    // Toggle All functionality
    toggleAllInput.addEventListener('change', () => {
        const newState = toggleAllInput.checked;
        productInputs.forEach(input => {
            input.checked = newState;
            if (newState) {
                activeProds.add(input.name);
            } else {
                activeProds.delete(input.name);
            }
        });
        sessionStorage.setItem('activeProds', JSON.stringify([...activeProds]));
        updateCallback();

        updateBundleDropdown(activeProds, prodBundles); 
    });

    // Help modal logic
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const helpModalClose = document.getElementById('helpModalClose');

    if (helpBtn && helpModal && helpModalClose) {
        helpBtn.addEventListener('click', () => {
            helpModal.style.display = 'flex';
        });
        helpModalClose.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.style.display = 'none';
        });
    }

    // Sortable only for product toggles
    Sortable.create(productTogglesContainer, {
        handle: '.drag-handle', 
        animation: 150,
        draggable: '.toggle-container',
        onEnd: () => {
            const containers = Array.from(productTogglesContainer.querySelectorAll('.toggle-container'));
            const newOrder = containers.map(c => c.querySelector('input[type="checkbox"]').name);
            sessionStorage.setItem('prodsOrder', JSON.stringify(newOrder));
            updateCallback();
        }
    });

    // Attach sidebar toggle handler
    attachSidebarToggleHandler();
}

// --- New reusable function for jumping to product anchor ---
function jumpToProductBundleAnchor(productId) {
    const anchorEl = document.getElementById(productId);
    if (anchorEl) {
        anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to initialize the Jump To Product dropdown menu
function initializejumpToProductBundleMenu(activeProds, updateCallback) {
    const selectProd = document.getElementById('jumpToProductBundle');
    if (!selectProd) return;

    // Clear existing options except the first one
    while (selectProd.options.length > 1) {
        selectProd.remove(1);
    }

    // Add product bundle options (keys from prodBundles)
    Object.keys(prodBundles).forEach(bundleKey => {
        const option = document.createElement('option');
        option.value = bundleKey;
        option.textContent = bundleKey;
        selectProd.appendChild(option);
    });

    // Remove any previous event listeners by replacing the element
    const selectClone = selectProd.cloneNode(true);
    selectProd.parentNode.replaceChild(selectClone, selectProd);

    // Add event listener to toggle bundle products
    selectClone.addEventListener('change', (e) => {
        const selectedBundle = e.target.value;
        if (selectedBundle && prodBundles[selectedBundle]) {
            activeProds.clear();
            prodBundles[selectedBundle].forEach(prod => activeProds.add(prod));
            sessionStorage.setItem('activeProds', JSON.stringify([...activeProds]));
            sessionStorage.setItem('selectedBundle', selectedBundle); 
            initializeSidebar(activeProds, updateCallback);
            updateCallback();
        }
    });

    // After populating the dropdown options in initializejumpToProductBundleMenu
    const storedBundle = sessionStorage.getItem('selectedBundle');
    if (storedBundle && prodBundles[storedBundle]) {
        selectClone.value = storedBundle;
    } else {
        selectClone.value = ""; // fallback to default
    }
}

// --- New function to update bundle dropdown based on activeProds ---
function updateBundleDropdown(activeProds, prodBundles) {
    const selectProd = document.getElementById('jumpToProductBundle');
    if (!selectProd) return;
    let matched = false;
    for (const [bundleName, bundleProds] of Object.entries(prodBundles)) {
        if (
            activeProds.size === bundleProds.length &&
            bundleProds.every(p => activeProds.has(p))
        ) {
            selectProd.value = bundleName;
            sessionStorage.setItem('selectedBundle', bundleName);
            matched = true;
            break;
        }
    }
    if (!matched) {
        selectProd.value = "";
        sessionStorage.removeItem('selectedBundle');
    }
}