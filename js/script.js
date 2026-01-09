const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const filterButtons = document.querySelectorAll('.filter-btn');

let todos = [];
let currentFilter = 'all';

todoForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    addTodo();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        currentFilter = btn.getAttribute('data-filter');
        renderTodos();
    });
});

todoList.addEventListener('click', function(e) {
    const target = e.target;
    const listItem = target.closest('.todo-item');
    
    if (!listItem) return;
    const id = parseInt(listItem.getAttribute('data-id'));

    if (target.closest('.delete-btn')) {
        deleteTodo(id);
    }

    if (target.type === 'checkbox') {
        toggleComplete(id);
    }
});


function addTodo() {
    const taskValue = taskInput.value.trim();
    const dateValue = dateInput.value;

    if (taskValue === '' || dateValue === '') {
        showError('Mohon isi nama tugas dan tanggal tenggat waktu.');
        return;
    }

    hideError();

    const newTodo = {
        id: Date.now(), 
        text: taskValue,
        date: dateValue,
        completed: false
    };

    todos.push(newTodo);
    renderTodos();

    taskInput.value = '';
    dateInput.value = '';
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'pending') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true; // untuk 'all'
    });

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', todo.id);

        li.innerHTML = `
            <input type="checkbox" 
                ${todo.completed ? 'checked' : ''} 
                aria-label="Mark as complete">
            
            <div class="todo-content">
                <span class="todo-task">${escapeHtml(todo.text)}</span>
                <span class="todo-date">Due: ${formatDate(todo.date)}</span>
            </div>
            
            <button class="delete-btn" aria-label="Delete task">
                &times; </button>
        `;

        todoList.appendChild(li);
    });
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}