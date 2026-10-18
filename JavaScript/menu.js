const accountName = document.querySelector("#account-name");
const logoutButton = document.querySelector("#logout-button");
const navbarToggle = document.querySelector("#navbar-toggle");
const siteHeader = document.querySelector("#site-header");
const reasonImage = document.querySelector("#reason-image");
const reasonLabel = document.querySelector("#reason-label");
const reasonTitle = document.querySelector("#reason-title");
const reasonDescription = document.querySelector("#reason-description");
const reasonTabs = document.querySelectorAll(".reason-tab");

function updateNavbarTogglePosition() {
	const isHidden = document.body.classList.contains("navbar-hidden");
	const top = isHidden ? 12 : siteHeader.getBoundingClientRect().bottom - 12;
	navbarToggle.style.top = `${Math.max(12, top)}px`;
}

updateNavbarTogglePosition();
window.addEventListener("resize", updateNavbarTogglePosition);
window.addEventListener("scroll", updateNavbarTogglePosition, { passive: true });
siteHeader.addEventListener("transitionend", event => {
	if (event.propertyName === "transform") {
		updateNavbarTogglePosition();
	}
});

navbarToggle.addEventListener("click", () => {
	const isHidden = document.body.classList.toggle("navbar-hidden");
	const label = isHidden ? "Hiện thanh điều hướng" : "Ẩn thanh điều hướng";
	navbarToggle.setAttribute("aria-expanded", String(!isHidden));
	navbarToggle.setAttribute("aria-label", label);
	navbarToggle.title = label;
	navbarToggle.querySelector("span").textContent = isHidden ? "⌄" : "⌃";
	updateNavbarTogglePosition();
});

reasonTabs.forEach(button => {
	button.addEventListener("click", () => {
		reasonTabs.forEach(tab => tab.setAttribute("aria-pressed", String(tab === button)));
		reasonImage.src = button.dataset.image;
		reasonImage.alt = button.dataset.alt;
		reasonLabel.textContent = button.dataset.label;
		reasonTitle.textContent = button.dataset.title;
		reasonDescription.textContent = button.dataset.description;
	});
});

let isAuthenticated = false;
try {
	isAuthenticated = sessionStorage.getItem("waterAidAuthenticated") === "1";
} catch {
	// Nếu trình duyệt chặn sessionStorage, coi lượt truy cập là chưa đăng nhập.
}

let account;
try {
	account = JSON.parse(localStorage.getItem("waterAidAccount"));
} catch {
	account = null;
}

if (!isAuthenticated || !account || typeof account.username !== "string") {
	window.location.replace("login.html");
} else {
	accountName.textContent = account.username;
}

logoutButton.addEventListener("click", () => {
	try {
		sessionStorage.removeItem("waterAidAuthenticated");
	} finally {
		window.location.replace("login.html");
	}
});

