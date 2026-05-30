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

  let users =
    JSON.parse(localStorage.getItem("users")) || [];

  const userExists = users.find(
    user => user.email === email
  );

  if (userExists) {
    alert("Email already registered");
    return;
  }

  users.push({
    username,
    email,
    password
  });

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

  let users =
    JSON.parse(localStorage.getItem("users")) || [];

  const validUser = users.find(
    user =>
      user.email === email &&
      user.password === password
  );

  if (validUser) {

    localStorage.setItem(
      "currentUser",
      JSON.stringify(validUser)
    );

    document.getElementById("authContainer")
      .classList.add("hidden");

    document.getElementById("appContainer")
      .classList.remove("hidden");

    document.getElementById("logoutBtn")
      .classList.remove("hidden");

    displayPosts();

    alert("Login Successful");

  } else {

    alert("Invalid Email or Password");
  }
}

// Logout
document.getElementById("logoutBtn")
.addEventListener("click", () => {

  localStorage.removeItem("currentUser");

  document.getElementById("appContainer")
    .classList.add("hidden");

  document.getElementById("authContainer")
    .classList.remove("hidden");

  document.getElementById("logoutBtn")
    .classList.add("hidden");
});

// Create Post
function createPost() {

  const caption =
    document.getElementById("caption").value;

  const mediaInput =
    document.getElementById("mediaInput");

  const file = mediaInput.files[0];

  if (!file) {
    alert("Please select image or video");
    return;
  }

  const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

  const reader = new FileReader();

  reader.onload = function () {

    let posts =
      JSON.parse(localStorage.getItem("posts")) || [];

    const post = {

      username: currentUser.username,

      caption: caption,

      media: reader.result,

      type: file.type.startsWith("image/")
        ? "image"
        : "video",

      likes: 0,

      comments: []
    };

    posts.unshift(post);

    localStorage.setItem(
      "posts",
      JSON.stringify(posts)
    );

    displayPosts();

    document.getElementById("caption").value = "";

    mediaInput.value = "";
  };

  reader.readAsDataURL(file);
}

// Display Posts
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
        `<img src="${post.media}" alt="Post">`;

    } else {

      mediaElement = `
        <video controls>
          <source src="${post.media}">
        </video>
      `;
    }

    let commentsHTML = "";

    post.comments.forEach(comment => {

      commentsHTML += `
        <div class="comment">
          ${comment}
        </div>
      `;
    });

    postDiv.innerHTML = `

      ${mediaElement}

      <div class="post-content">

        <h4>Posted by: ${post.username}</h4>

        <h3>${post.caption}</h3>

        <div class="actions">

          <button onclick="likePost(${index})">
            ❤️ Like (${post.likes})
          </button>

          <button onclick="deletePost(${index})">
            🗑 Delete
          </button>

        </div>

        <div class="comment-box">

          <input
            type="text"
            id="comment-${index}"
            placeholder="Write comment">

          <button onclick="addComment(${index})">
            Comment
          </button>

          <div class="comments">

            ${commentsHTML}

          </div>

        </div>

      </div>
    `;

    postsContainer.appendChild(postDiv);
  });
}

// Like Post
function likePost(index) {

  let likedPosts =
    JSON.parse(localStorage.getItem("likedPosts")) || [];

  if (likedPosts.includes(index)) {

    alert("You already liked this post");
    return;
  }

  let posts =
    JSON.parse(localStorage.getItem("posts")) || [];

  posts[index].likes++;

  localStorage.setItem(
    "posts",
    JSON.stringify(posts)
  );

  likedPosts.push(index);

  localStorage.setItem(
    "likedPosts",
    JSON.stringify(likedPosts)
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
function addComment(index) {

  const input =
    document.getElementById(`comment-${index}`);

  const text = input.value.trim();

  if (!text) return;

  let posts =
    JSON.parse(localStorage.getItem("posts")) || [];

  posts[index].comments.push(text);

  localStorage.setItem(
    "posts",
    JSON.stringify(posts)
  );

  displayPosts();
}

// Forgot Password
function forgotPassword() {

  const email =
    prompt("Enter your registered email");

  if (!email) return;

  let users =
    JSON.parse(localStorage.getItem("users")) || [];

  const user =
    users.find(u => u.email === email);

  if (user) {

    alert(
      "Your password is: " + user.password
    );

  } else {

    alert("Email not found");
  }
}

// Auto Login
window.onload = function () {

  const currentUser =
    localStorage.getItem("currentUser");

  if (currentUser) {

    document.getElementById("authContainer")
      .classList.add("hidden");

    document.getElementById("appContainer")
      .classList.remove("hidden");

    document.getElementById("logoutBtn")
      .classList.remove("hidden");

    displayPosts();
  }
};
