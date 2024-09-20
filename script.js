// Dữ liệu mẫu cho scripts và executors
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

// Gọi hàm hiển thị khi trang được tải
window.onload = function() {
    displayScripts();
    displayExecutors();
}
