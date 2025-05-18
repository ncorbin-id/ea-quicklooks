// sidebar.js

import { prods, defaultprods } from './utils.js';

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
    initializeJumpToProductMenu();
    
    // Initialize product toggles
    const container = document.getElementById('product-toggles');
    container.innerHTML = ''; // Clear any existing toggles

    // Add Toggle All option at the top
    const toggleAllWrapper = document.createElement('div');
    toggleAllWrapper.className = 'toggle-container';

    const toggleAllLabel = document.createElement('label');
    toggleAllLabel.className = 'toggle-label';
    toggleAllLabel.textContent = 'All';
    toggleAllLabel.style.fontWeight = 'bold'; // Make it stand out

    const toggleAllSwitch = document.createElement('label');
    toggleAllSwitch.className = 'switch';

    const toggleAllInput = document.createElement('input');
    toggleAllInput.type = 'checkbox';
    toggleAllInput.checked = activeProds.size === prods.length; // Checked if all prods are active
    toggleAllInput.id = 'toggle-all-products';

    const toggleAllSlider = document.createElement('span');
    toggleAllSlider.className = 'slider';

    toggleAllSwitch.appendChild(toggleAllInput);
    toggleAllSwitch.appendChild(toggleAllSlider);

    toggleAllWrapper.appendChild(toggleAllSwitch);
    toggleAllWrapper.appendChild(toggleAllLabel);

    container.appendChild(toggleAllWrapper);

    //-- Remove if broken Toggle All functionality
    toggleAllInput.addEventListener('change', () => {
        const newState = toggleAllInput.checked;
        
        // Update all product toggles
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
        
        // Show/hide no products message
        showNoProductsMessageIfNeeded(activeProds);
    });
    
    // Add a separator with proper CSS class
    const separator = document.createElement('hr');
    separator.className = 'toggle-divider';
    container.appendChild(separator);

    // Create individual product toggles
    const productInputs = [];
    prods.forEach(prod => {
        const wrapper = document.createElement('div');
        wrapper.className = 'toggle-container';

        const label = document.createElement('label');
        label.className = 'toggle-label';
        label.textContent = prod;

        const switchLabel = document.createElement('label');
        switchLabel.className = 'switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = activeProds.has(prod);
        input.name = prod;
        productInputs.push(input); // Store reference to input for toggle all function

        const slider = document.createElement('span');
        slider.className = 'slider';

        switchLabel.appendChild(input);
        switchLabel.appendChild(slider);

        wrapper.appendChild(switchLabel);
        wrapper.appendChild(label);

        container.appendChild(wrapper);

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
            // save toggles to sessionStorage
            sessionStorage.setItem('activeProds', JSON.stringify([...activeProds]));
            // Update toggle all checkbox state
            toggleAllInput.checked = activeProds.size === prods.length;
            //updateCallback();
        });
    });

    // Toggle All functionality
    toggleAllInput.addEventListener('change', () => {
        const newState = toggleAllInput.checked;
        
        // Update all product toggles
        productInputs.forEach(input => {
            input.checked = newState;
            if (newState) {
                activeProds.add(input.name);
            } else {
                activeProds.delete(input.name);
            }
        });
        
        updateCallback();
    });

    // Sidebar toggle button logic
    let sidebarState = 'open';

    function toggleNav() {
        const sidebar = document.getElementById('sidebarControlsContainer');
        const toggleBtn = document.getElementById('toggleBtn');
        const root = document.documentElement;

        if (sidebarState === 'closed') {
            sidebar.classList.add('open');
            root.style.setProperty('--sidebar-width', '200px');
            toggleBtn.innerHTML = '«';
            sidebarState = 'open';
        } else {
            sidebar.classList.remove('open');
            root.style.setProperty('--sidebar-width', '40px');
            toggleBtn.innerHTML = '»';
            sidebarState = 'closed';
        }
    }

    document.getElementById('toggleBtn').addEventListener('click', toggleNav);
}

// Function to initialize the Jump To Product dropdown menu
function initializeJumpToProductMenu() {
    const selectProd = document.getElementById('jumpToProduct');
    if (!selectProd) return;
    
    // Clear existing options except the first one
    while (selectProd.options.length > 1) {
        selectProd.remove(1);
    }
    
    // Add product dropdown options
    prods.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod;
        option.textContent = prod;
        selectProd.appendChild(option);
    });

    // Add event listener to scroll to selected product
    selectProd.addEventListener('change', (e) => {
        const selected = e.target.value;
        if (selected) {
            const anchorEl = document.getElementById(selected);
            if (anchorEl) {
                anchorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Reset dropdown to default option after selection
            setTimeout(() => {
                selectProd.selectedIndex = 0;
            }, 500);
        }
    });
}