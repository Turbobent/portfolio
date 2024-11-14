function fetchRepos() {
    const url = "https://api.github.com/users/Turbobent/repos";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const reposList = document.getElementById("reposList");
            reposList.innerHTML = ""; // Clear previous content
  
            data.forEach(repo => {
                const repoItem = document.createElement("div");
                repoItem.classList.add("repo-item");
                repoItem.innerHTML = `
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                `;
                reposList.appendChild(repoItem);
            });
  
            // Update repo count
            document.getElementById("repoCount").textContent = `${data.length} repository(ies)`;
        })
        .catch(error => console.error("Error fetching repos:", error));
  }