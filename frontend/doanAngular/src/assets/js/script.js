document.getElementById("sidebarToggle").onclick = function() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
}

document.getElementById("closeSidebar").onclick = function() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("searchInput").onfocus = function() {
    this.placeholder = '';
}

document.getElementById("searchInput").onblur = function() {
    this.placeholder = '\uf002 Search...';
}

document.getElementById("overlay").onclick = function() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("categoryToggle").onclick = function() {
    var categoryList = document.getElementById("categoryList");
    categoryList.style.display = categoryList.style.display === "block" ? "none" : "block";
}