// User management
let currentUser = null;
let users = [];

// Load users from localStorage
function loadUsers() {
    try {
        const storedUsers = localStorage.getItem('users');
        users = storedUsers ? JSON.parse(storedUsers) : [];
    } catch (error) {
        console.error('Error loading users:', error);
        users = [];
    }
}

// Save users to localStorage
function saveUsers() {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// Authentication functions
function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('todo-container').style.display = 'block';
        loadTodos();
        showMessage('Welcome back, ' + username + '!', 'success');
        return true;
    }
    showMessage('Invalid username or password', 'error');
    return false;
}

function register(username, password) {
    if (users.some(u => u.username === username)) {
        showMessage('Username already exists', 'error');
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        username,
        password,
        todos: []
    };
    
    users.push(newUser);
    saveUsers();
    showMessage('Registration successful! Please login.', 'success');
    return true;
}

function logout() {
    currentUser = null;
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('todo-container').style.display = 'none';
    showMessage('Logged out successfully', 'success');
}

// Todo management
function addTodo() {
    const input = document.getElementById('todoInput');
    const dateInput = document.getElementById('todoDate');
    const categoryInput = document.getElementById('todoCategory');
    
    const text = input.value.trim();
    const date = dateInput.value;
    const category = categoryInput.value.trim();
    
    if (text && currentUser) {
        const todo = {
            id: Date.now(),
            text,
            date,
            category,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        currentUser.todos.push(todo);
        saveUsers();
        
        input.value = '';
        dateInput.value = '';
        categoryInput.value = '';
        
        renderTodos();
        showMessage('Todo added successfully', 'success');
    }
}

function toggleTodo(id) {
    if (!currentUser) return;
    
    currentUser.todos = currentUser.todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    saveUsers();
    renderTodos();
}

function deleteTodo(id) {
    if (!currentUser) return;
    
    currentUser.todos = currentUser.todos.filter(todo => todo.id !== id);
    saveUsers();
    renderTodos();
    showMessage('Todo deleted', 'success');
}

function renderTodos() {
    if (!currentUser) return;
    
    const todoList = document.getElementById('todoList');
    const filterStatus = document.querySelector('.filter-btn.active').dataset.status;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredTodos = currentUser.todos;
    
    // Apply filters
    if (filterStatus === 'active') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
    } else if (filterStatus === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
    }
    
    // Apply search
    if (searchText) {
        filteredTodos = filteredTodos.filter(todo => 
            todo.text.toLowerCase().includes(searchText) ||
            todo.category.toLowerCase().includes(searchText)
        );
    }
    
    // Sort by date
    filteredTodos.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
    });
    
    todoList.innerHTML = '';
    
    filteredTodos.forEach(todo => {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const dateDisplay = todo.date ? new Date(todo.date).toLocaleDateString() : '';
        
        div.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.text}</span>
            <span class="todo-category">${todo.category}</span>
            <span class="todo-date">${dateDisplay}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        
        todoList.appendChild(div);
    });
    
    updateTodoCount();
}

function updateTodoCount() {
    if (!currentUser) return;
    
    const total = currentUser.todos.length;
    const completed = currentUser.todos.filter(todo => todo.completed).length;
    
    document.getElementById('todo-count').textContent = 
        `${completed}/${total} completed`;
}

function setFilter(button, status) {
    document.querySelectorAll('.filter-btn').forEach(btn => 
        btn.classList.remove('active'));
    button.classList.add('active');
    renderTodos();
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = '';
    }, 3000);
}

// Penguin explosion animation
function explodePenguin(event) {
    const penguin = event.target;
    const rect = penguin.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create explosion particles
    for (let i = 0; i < 20; i++) {
        createParticle(centerX, centerY);
    }

    // Add explosion animation class
    penguin.classList.add('exploding');

    // Remove penguin after animation
    setTimeout(() => {
        penguin.remove();
    }, 500);
}

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    document.body.appendChild(particle);

    // Random position around the penguin
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    // Random direction and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    // Set custom properties for the animation
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    // Add animation
    particle.style.animation = 'particle 0.5s ease-out forwards';

    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, 500);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        login(username, password);
    });
    
    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        if (register(username, password)) {
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerPassword').value = '';
        }
    });
    
    // Todo input Enter key
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', renderTodos);
});
