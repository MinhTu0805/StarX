// Dữ liệu mẫu cho scripts và 
const scripts = [
    { name: 'Auto Farm Script', description: 'Automatically farm resources in your favorite games.', downloadLink: '#' },
    { name: 'Speed Hack', description: 'Increase your movement speed drastically.', downloadLink: '#' },
    { name: 'Fly Hack', description: 'Gain the ability to fly in any game.', downloadLink: '#' }
];

const executors = [
    { name: 'Synapse X', description: 'One of the best Lua executors for Roblox.', downloadLink: '#' },
    { name: 'Krnl', description: 'Free Roblox executor with powerful features.', downloadLink: '#' },
    { name: 'Oxygen U', description: 'Executor with frequent updates and a large community.', downloadLink: '#' }
];

// Hiển thị danh sách scripts
function displayScripts() {
    const scriptList = document.getElementById('scriptList');
    scriptList.innerHTML = ''; // Clear previous content
    scripts.forEach(script => {
        const scriptDiv = document.createElement('div');
        scriptDiv.className = 'script';
        scriptDiv.innerHTML = `
            <h3>${script.name}</h3>
            <p>${script.description}</p>
            <button onclick="window.location.href='${script.downloadLink}'">Download</button>
        `;
        scriptList.appendChild(scriptDiv);
    });
}

// Hiển thị danh sách executors
function displayExecutors() {
    const executorList = document.getElementById('executorList');
    executorList.innerHTML = ''; // Clear previous content
    executors.forEach(executor => {
        const executorDiv = document.createElement('div');
        executorDiv.className = 'executor';
        executorDiv.innerHTML = `
            <h3>${executor.name}</h3>
            <p>${executor.description}</p>
            <button onclick="window.location.href='${executor.downloadLink}'">Download</button>
        `;
        executorList.appendChild(executorDiv);
    });
}

// Tìm kiếm script
function searchScripts() {
    const query = document.getElementById('searchScripts').value.toLowerCase();
    const filteredScripts = scripts.filter(script => script.name.toLowerCase().includes(query));
    const scriptList = document.getElementById('scriptList');
    scriptList.innerHTML = ''; // Clear previous content
    filteredScripts.forEach(script => {
        const scriptDiv = document.createElement('div');
        scriptDiv.className = 'script';
        scriptDiv.innerHTML = `
            <h3>${script.name}</h3>
            <p>${script.description}</p>
            <button onclick="window.location.href='${script.downloadLink}'">Download</button>
        `;
        scriptList.appendChild(scriptDiv);
    });
}

// Tìm kiếm executor
function searchExecutors() {
    const query = document.getElementById('searchExecutors').value.toLowerCase();
    const filteredExecutors = executors.filter(executor => executor.name.toLowerCase().includes(query));
    const executorList = document.getElementById('executorList');
    executorList.innerHTML = ''; // Clear previous content
    filteredExecutors.forEach(executor => {
        const executorDiv = document.createElement('div');
        executorDiv.className = 'executor';
        executorDiv.innerHTML = `
            <h3>${executor.name}</h3>
            <p>${executor.description}</p>
            <button onclick="window.location.href='${executor.downloadLink}'">Download</button>
        `;
        executorList.appendChild(executorDiv);
    });
}

// Dữ liệu về các ngôn ngữ với cờ tương ứng
const languages = [
    { code: 'en', name: 'English', flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg' },
    { code: 'vi', name: 'Tiếng Việt', flag: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg' },
    { code: 'fr', name: 'Français', flag: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg' },
    // Thêm các ngôn ngữ khác...
];

// Thay đổi giao diện (sáng/tối/galaxy)
function changeTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

// Thay đổi font chữ
function changeFont(font) {
    document.body.style.fontFamily = font;
}

// Tạo danh sách ngôn ngữ với cờ
function displayLanguages() {
    const languageContainer = document.getElementById('languageList');
    languageContainer.innerHTML = '';
    languages.forEach(lang => {
        const langDiv = document.createElement('div');
        langDiv.className = 'language-select';
        langDiv.innerHTML = `
            <img src="${lang.flag}" alt="${lang.name} Flag" width="30">
            <span>${lang.name}</span>
        `;
        langDiv.addEventListener('click', () => setLanguage(lang.code));
        languageContainer.appendChild(langDiv);
    });
}

// Thay đổi ngôn ngữ
function setLanguage(langCode) {
    alert(`Language changed to: ${langCode}`); // Bạn có thể thay thế bằng hệ thống đa ngôn ngữ thực tế
}

// Gọi khi trang tải
window.onload = function() {
    displayLanguages();
    displayScripts();
    displayExecutors();
}
