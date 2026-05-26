// Show Register

function showRegister() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("registerBox").classList.remove("hidden");
}

// Show Login

function showLogin() {
  document.getElementById("registerBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}

// Register

function register() {

  const username =
    document.getElementById("registerUsername").value;

  const email =
    document.getElementById("registerEmail").value;

  const password =
    document.getElementById("registerPassword").value;

  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }
const emailPattern =
  /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

if (!email.match(emailPattern)) {
  alert("Enter valid email");
  return;
}

if (password.length < 5) {
  alert("Password must be at least 5 characters");
  return;
}
  // Get existing users
  let users =
    JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  const userExists = users.find(
    user => user.email === email
  );

  if (userExists) {
    alert("Email already registered");
    return;
  }

  // Create new user
  const newUser = {
    username,
    email,
    password
  };

  // Add user
  users.push(newUser);

  // Save users
  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  alert("Registration Successful");

  showLogin();
}

// Login

function login() {

  const email =
    document.getElementById("loginEmail").value;

  const password =
    document.getElementById("loginPassword").value;

  // Get users
  let users =
    JSON.parse(localStorage.getItem("users")) || [];

  // Find matching user
  const validUser = users.find(
    user =>
      user.email === email &&
      user.password === password
  );

  if (validUser) {

    alert("Login Successful");

    document.getElementById("authContainer")
      .classList.add("hidden");

    document.getElementById("appContainer")
      .classList.remove("hidden");

    document.getElementById("logoutBtn")
      .classList.remove("hidden");

  } else {

    alert("Invalid Email or Password");
  }
}

// Logout

document.getElementById("logoutBtn").addEventListener("click", () => {

  document.getElementById("appContainer").classList.add("hidden");

  document.getElementById("authContainer").classList.remove("hidden");
});

// Create Post

function createPost() {

  const caption =
    document.getElementById("caption").value;

  const mediaInput =
    document.getElementById("mediaInput");

  const file = mediaInput.files[0];

  if (!file) {
    alert("Select image or video");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {

    const post = {

      caption: caption,

      media: reader.result,

      type: file.type.startsWith("image")
        ? "image"
        : "video",

      likes: 0,

      comments: []
    };

    // Get old posts
    let posts =
      JSON.parse(localStorage.getItem("posts")) || [];

    // Add new post
    posts.unshift(post);

    // Save posts
    localStorage.setItem(
      "posts",
      JSON.stringify(posts)
    );

    // Display posts
    displayPosts();

    // Clear inputs
    document.getElementById("caption").value = "";

    mediaInput.value = "";
  };

  reader.readAsDataURL(file);
}
//display post
function displayPosts() {

  const postsContainer =
    document.getElementById("postsContainer");

  postsContainer.innerHTML = "";

  let posts =
    JSON.parse(localStorage.getItem("posts")) || [];

  posts.forEach((post, index) => {

    const postDiv =
      document.createElement("div");

    postDiv.classList.add("post");

    let mediaElement = "";

    if (post.type === "image") {

      mediaElement =
        `<img src="${post.media}">`;

    } else {

      mediaElement = `
        <video controls>
          <source src="${post.media}">
        </video>
      `;
    }

    postDiv.innerHTML = `

      ${mediaElement}

      <div class="post-content">

        <h3>${post.caption}</h3>

        <div class="actions">

          <button onclick="likePost(${index})">
            ❤️ Like (${post.likes})
          </button>

          <button onclick="deletePost(${index})">
            🗑 Delete
          </button>

        </div>

      </div>
    `;

    postsContainer.appendChild(postDiv);
  });
}

// Like Post

function likePost(index) {

  let posts =
    JSON.parse(localStorage.getItem("posts")) || [];

  posts[index].likes++;

  localStorage.setItem(
    "posts",
    JSON.stringify(posts)
  );

  displayPosts();
}

// Delete Post

function deletePost(index) {

  let posts =
    JSON.parse(localStorage.getItem("posts")) || [];

  posts.splice(index, 1);

  localStorage.setItem(
    "posts",
    JSON.stringify(posts)
  );

  displayPosts();
}

// Add Comment

function addComment(button) {

  const commentInput =
    button.previousElementSibling;

  const commentsDiv =
    button.nextElementSibling;

  const commentText = commentInput.value;

  if (commentText === "") return;

  const comment = document.createElement("div");

  comment.classList.add("comment");

  comment.innerText = commentText;

  commentsDiv.appendChild(comment);

  commentInput.value = "";
}
function forgotPassword() {

  const email = prompt(
    "Enter your registered email"
  );

  if (!email) {
    alert("Please enter email");
    return;
  }

  const emailPattern =
    /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!email.match(emailPattern)) {
    alert("Enter valid email");
    return;
  }

  let users =
    JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    user => user.email === email
  );

  if (user) {

    alert(
      "Your password is: " + user.password
    );

  } else {

    alert("Email not found");
  }
}
displayPosts();
