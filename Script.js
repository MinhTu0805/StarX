<input type="text" id="search" placeholder="Search for scripts...">
<button onclick="searchScripts()">Search</button>

<script>
    function searchScripts() {
        var query = document.getElementById('search').value.toLowerCase();
        var scripts = document.querySelectorAll('.script');
        scripts.forEach(script => {
            var scriptName = script.querySelector('h3').textContent.toLowerCase();
            if (scriptName.includes(query)) {
                script.style.display = 'block';
            } else {
                script.style.display = 'none';
            }
        });
    }
</script>
