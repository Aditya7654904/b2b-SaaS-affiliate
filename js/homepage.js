let toolsDatabase = {};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/featured-tools.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load featured tools JSON");
      return response.json();
    })
    .then((data) => {
      data.forEach((tool) => {
        toolsDatabase[tool.id] = tool;
      });
      renderToolsCards(data);
    })
    .catch((err) => {
      console.error("Error loading featured tools:", err);
    });
});

function renderToolsCards(tools) {
  const container = document.getElementById("featured-tools-grid");
  if (!container) return;

  container.innerHTML = tools
    .map(
      (tool) => `
    <div class="stark-card p-6 flex flex-col justify-between">
      <div class="space-y-4">
        <div class="flex justify-between items-start">
          <span class="font-bold text-xl uppercase brand-font">${tool.title}</span>
          <span class="bg-white text-black font-mono font-bold text-xs px-2 py-1">${tool.rating}</span>
        </div>
        <p class="text-sm text-zinc-300">${tool.description}</p>
      </div>
      <div class="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <a href="post.html?slug=${tool.slug}" class="text-xs font-mono text-zinc-400 hover:text-white underline">View .md Post</a>
        <button onclick="openArticleModal('${tool.id}')" class="stark-button text-xs px-3 py-1.5 uppercase">Live Preview</button>
      </div>
    </div>
  `
    )
    .join("");
}

function openArticleModal(key) {
  const article = toolsDatabase[key] || {
    title: "SaaS Evaluation",
    rating: "★ 4.8 / 5.0",
    price: "Custom",
    category: "General",
    markdown: "# Overview\n\nContent loading..."
  };

  document.getElementById("editTitle").value = article.title;
  document.getElementById("editRating").value = article.rating;
  document.getElementById("editPrice").value = article.price;
  document.getElementById("editCategory").value = article.category;
  document.getElementById("editMarkdown").value = article.markdown;
  
  updateLive();
  document.getElementById("articleModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeArticleModal() {
  document.getElementById("articleModal").classList.add("hidden");
  document.body.style.overflow = "auto";
}

function updateLive() {
  const title = document.getElementById("editTitle").value;
  const rating = document.getElementById("editRating").value;
  const price = document.getElementById("editPrice").value;
  const category = document.getElementById("editCategory").value;
  const markdownText = document.getElementById("editMarkdown").value;

  document.getElementById("articleTitle").innerText = title;
  document.getElementById("articleRating").innerText = rating;
  document.getElementById("articlePrice").innerText = price;
  document.getElementById("modalCategory").innerText = category.toUpperCase();
  document.getElementById("cardCategory").innerText = category.toUpperCase() + " PUBLICATION";

  if (typeof marked !== "undefined") {
    document.getElementById("articleBody").innerHTML = marked.parse(markdownText);
  }
}

function toggleEditor() {
  const editor = document.getElementById("editorContainer");
  const view = document.getElementById("viewContainer");
  if (editor.classList.contains("hidden")) {
    editor.classList.remove("hidden");
    view.classList.remove("lg:col-span-12");
    view.classList.add("lg:col-span-8");
  } else {
    editor.classList.add("hidden");
    view.classList.remove("lg:col-span-8");
    view.classList.add("lg:col-span-12");
  }
}
