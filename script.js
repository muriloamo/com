document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
    const registerScreen = document.getElementById('register-screen');
    const loginScreen = document.getElementById('login-screen');
    const messageScreen = document.getElementById('message-screen');

    const registerForm = document.getElementById('register-form');
    const regUsernameInput = document.getElementById('reg-username');
    const regPasswordInput = document.getElementById('reg-password');

    const loginForm = document.getElementById('login-form');
    const logUsernameInput = document.getElementById('log-username');
    const logPasswordInput = document.getElementById('log-password');

    const showLoginLink = document.getElementById('show-login');
    const showRegisterLink = document.getElementById('show-register');
    const logoutButton = document.getElementById('logout-button');

    const currentUserSpan = document.getElementById('current-user');
    const messageInput = document.getElementById('message-input');
    const messageForm = document.getElementById('message-form');
    const messagesDiv = document.getElementById('messages');

    let currentUser = null; // Armazena o usuário logado

    // --- Funções de Utilitário ---

    // Função para mostrar uma tela específica
    function showScreen(screenToShow) {
        const screens = [registerScreen, loginScreen, messageScreen];
        screens.forEach(screen => screen.classList.remove('active'));
        screenToShow.classList.add('active');
    }

    // Função para carregar usuários do LocalStorage
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : {};
    }

    // Função para salvar usuários no LocalStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Função para carregar mensagens do LocalStorage
    function getMessages() {
        const messages = localStorage.getItem('messages');
        return messages ? JSON.parse(messages) : [];
    }

    // Função para salvar mensagens no LocalStorage
    function saveMessages(messages) {
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // Função para exibir as mensagens na tela
    function displayMessages() {
        messagesDiv.innerHTML = '';
        const messages = getMessages();
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
            messagesDiv.appendChild(messageElement);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight; // Rola para o final
    }

    // --- Event Listeners ---

    // Cadastro de Usuário
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = regUsernameInput.value.trim();
        const password = regPasswordInput.value.trim();

        if (username === '' || password === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const users = getUsers();
        if (users[username]) {
            alert('Nome de usuário já existe. Escolha outro.');
            return;
        }

        users[username] = password; // Armazena a senha em texto puro (para fins de exemplo)
        saveUsers(users);
        alert('Usuário cadastrado com sucesso!');
        regUsernameInput.value = '';
        regPasswordInput.value = '';
        showScreen(loginScreen); // Redireciona para a tela de login
    });

    // Login de Usuário
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = logUsernameInput.value.trim();
        const password = logPasswordInput.value.trim();

        if (username === '' || password === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const users = getUsers();
        if (users[username] && users[username] === password) {
            currentUser = username;
            currentUserSpan.textContent = currentUser;
            displayMessages(); // Carrega as mensagens ao fazer login
            showScreen(messageScreen);
            logUsernameInput.value = '';
            logPasswordInput.value = '';
        } else {
            alert('Usuário ou senha inválidos.');
        }
    });

    // Enviar Mensagem
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageText = messageInput.value.trim();

        if (messageText === '') {
            alert('A mensagem não pode ser vazia.');
            return;
        }

        const messages = getMessages();
        messages.push({ user: currentUser, text: messageText, timestamp: new Date().toISOString() });
        saveMessages(messages);
        displayMessages();
        messageInput.value = '';
    });

    // Logout
    logoutButton.addEventListener('click', () => {
        currentUser = null;
        showScreen(loginScreen);
    });

    // Navegação entre telas de cadastro e login
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(loginScreen);
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(registerScreen);
    });

    // --- Inicialização ---

    // Verifica se já existe um usuário logado (simples, pode ser melhorado)
    if (currentUser) {
        showScreen(messageScreen);
        currentUserSpan.textContent = currentUser;
        displayMessages();
    } else {
        showScreen(registerScreen); // Inicia na tela de cadastro ou login
    }
});