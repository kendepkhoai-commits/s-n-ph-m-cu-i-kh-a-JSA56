const accountName = document.querySelector("#account-name");
const logoutButton = document.querySelector("#logout-button");

let isAuthenticated = false;
try {
	isAuthenticated = sessionStorage.getItem("waterAidAuthenticated") === "1";
} catch {
	// If session storage is blocked, treat the visit as unauthenticated.
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