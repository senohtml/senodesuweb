// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }
    
    const userData = JSON.parse(user);
    document.getElementById('userEmail').textContent = userData.email;
    return token;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    const token = checkAuth();
    if (token) {
        loadResources(token);
    }
    
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Section navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            switchSection(section);
        });
    });

    // Add resource button
    document.getElementById('addResourceBtn').addEventListener('click', () => {
        showResourceForm(null);
    });

    // Form submit
    document.getElementById('addResourceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveResource();
    });

    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        hideResourceForm();
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await logout();
    });

    // Confirm dialog buttons
    document.getElementById('confirmYes').addEventListener('click', () => {
        confirmDelete();
    });

    document.getElementById('confirmNo').addEventListener('click', () => {
        hideConfirmDialog();
    });
}

// Switch section
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Load data if needed
    if (sectionName === 'resources') {
        loadResources(localStorage.getItem('adminToken'));
    }
}

// Load resources from API
async function loadResources(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/resources`);
        const data = await response.json();
        
        const tbody = document.querySelector('#resourcesTable tbody');
        tbody.innerHTML = '';
        
        if (data.resources && data.resources.length > 0) {
            data.resources.forEach((resource, index) => {
                const row = createResourceRow(resource, index);
                tbody.appendChild(row);
            });
            
            // Update analytics
            document.getElementById('totalResources').textContent = data.resources.length;
        } else {
            tbody.innerHTML = '<tr><td colspan="4" class="loading">No resources found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading resources:', error);
        const tbody = document.querySelector('#resourcesTable tbody');
        tbody.innerHTML = '<tr><td colspan="4" class="loading">Error loading resources</td></tr>';
    }
}

// Create resource row
function createResourceRow(resource, index) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${resource.title}</td>
        <td>${resource.category || 'N/A'}</td>
        <td>${resource.description.substring(0, 50)}...</td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit" onclick="editResource('${resource.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteResource('${resource.id}')">Delete</button>
            </div>
        </td>
    `;
    return row;
}

// Show resource form
function showResourceForm(resourceId) {
    const form = document.getElementById('resourceForm');
    const formTitle = document.getElementById('formTitle');
    
    if (resourceId) {
        formTitle.textContent = 'Edit Resource';
        // Load resource data and populate form
        // TODO: Implement edit functionality
    } else {
        formTitle.textContent = 'Add New Resource';
        document.getElementById('addResourceForm').reset();
    }
    
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
}

// Hide resource form
function hideResourceForm() {
    document.getElementById('resourceForm').style.display = 'none';
    document.getElementById('addResourceForm').reset();
}

// Save resource
async function saveResource() {
    const token = localStorage.getItem('adminToken');
    const formData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        link: document.getElementById('link').value,
        drive_link: document.getElementById('driveLink').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/resources`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            hideResourceForm();
            loadResources(token);
            showNotification('Resource saved successfully!');
        } else {
            showNotification('Error saving resource', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Connection error', 'error');
    }
}

// Edit resource
async function editResource(resourceId) {
    // TODO: Implement edit functionality
    showResourceForm(resourceId);
}

// Delete resource
let resourceToDelete = null;

function deleteResource(resourceId) {
    resourceToDelete = resourceId;
    showConfirmDialog(`Are you sure you want to delete this resource?`);
}

async function confirmDelete() {
    if (!resourceToDelete) return;

    const token = localStorage.getItem('adminToken');

    try {
        const response = await fetch(`${API_BASE_URL}/resources/${resourceToDelete}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            hideConfirmDialog();
            loadResources(token);
            showNotification('Resource deleted successfully!');
        } else {
            showNotification('Error deleting resource', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Connection error', 'error');
    }
}

// Confirm dialog
function showConfirmDialog(message) {
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmDialog').style.display = 'flex';
}

function hideConfirmDialog() {
    document.getElementById('confirmDialog').style.display = 'none';
    resourceToDelete = null;
}

// Logout
async function logout() {
    try {
        await fetch(`${API_BASE_URL}/auth/signout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }

    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Notification
function showNotification(message, type = 'success') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 4px;
        z-index: 2000;
        animation: slideInDown 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
