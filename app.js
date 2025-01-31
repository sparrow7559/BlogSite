const firebaseConfig = {
  apiKey: "AIzaSyD2ODtWQkpfbuxkVHaSfDutCi1UKjlBUFw",
  authDomain: "blogsite-2dda1.firebaseapp.com",
  projectId: "blogsite-2dda1",
  storageBucket: "blogsite-2dda1.firebasestorage.app",
  messagingSenderId: "574664357903",
  appId: "1:574664357903:web:e2648a13d79999380d0b7a",
  measurementId: "G-BQQGWMH3F3"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load the appropriate functionality based on the page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

//   if (path === "/workshop-blog/index.html" || path === "/workshop-blog/") {
//     loadHomePage();
//   } else if (path === "/workshop-blog/create.html") {
//     loadCreatePage();
//   } else if (path === "/workshop-blog/show.html") {
//     loadShowPage();
//   }
// });

  if (path === "/BlogSite/index.html" || path === "/BlogSite/") {
    loadHomePage();
  } else if (path === "/BlogSite/create.html") {
    loadCreatePage();
  } else if (path === "/BlogSite/show.html") {
    loadShowPage();
  }
});

// Home Page Functionality
function loadHomePage() {
  const blogList = document.getElementById("blog-list");
  const searchInput = document.getElementById("search-input");

  // Fetch and display blogs
  const loadBlogs = async (query = "") => {
    const blogs = await db.collection("blogs").get();
    blogList.innerHTML = ""; // Clear the current list

    blogs.forEach((doc) => {
      const blog = doc.data();
      if (blog.title.toLowerCase().includes(query.toLowerCase())) {
        // const blogPreview = document.createElement("div");
        // blogPreview.className = "blog-preview";

        // blogPreview.innerHTML = `
        //   <a href="/show.html?id=${doc.id}">
        //     <h2>${blog.title}</h2>
        //     <p>Written by ${blog.author}</p>
        //   </a>
        // `;

        // const blogTitle = document.createElement("h2");
        // blogTitle.textContent = blog.title;

        // const blogAuthor = document.createElement("p");
        // blogAuthor.textContent = `Written by ${blog.author}`;

        // blogPreview.appendChild(blogTitle);
        // blogPreview.appendChild(blogAuthor);

        // blogList.appendChild(blogPreview);
        const blogLink = document.createElement("a");
        // blogLink.href = `/workshop-blog/show.html?id=${doc.id}`;
        blogLink.href = `/show.html?id=${doc.id}`; // Update: Link to the blog's details page
        blogLink.style.textDecoration = "none"; // Update: Remove underline from the link
        blogLink.style.color = "inherit"; // Update: Inherit text color

        // Create the blog preview container
        const blogPreview = document.createElement("div");
        blogPreview.className = "blog-preview";

        // Add the blog title
        const blogTitle = document.createElement("h2");
        blogTitle.textContent = blog.title;

        // Add the blog author
        const blogAuthor = document.createElement("p");
        blogAuthor.textContent = `Written by ${blog.author}`;

        // Append the title and author to the blog preview
        blogPreview.appendChild(blogTitle);
        blogPreview.appendChild(blogAuthor);

        // Update: Append the blog preview to the link
        blogLink.appendChild(blogPreview);

        // Update: Append the link to the blog list
        blogList.appendChild(blogLink);
      }
    });
  };

  // Load all blogs initially
  loadBlogs();

  // Add search functionality
  searchInput.addEventListener("input", (e) => {
    loadBlogs(e.target.value);
  });
}

// Create Page Functionality
function loadCreatePage() {
  const form = document.getElementById("create-blog-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const author = document.getElementById("author").value;

    await db.collection("blogs").add({
      title,
      body,
      author,
    });

    window.location.href = "/BlogSite/index.html";
  });
}

// Show Page Functionality
function loadShowPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    window.location.href = "/BlogSite/index.html"; // Redirect if no ID is provided
    return;
  }

  const blogDetails = document.getElementById("blog-details");
  const editFormContainer = document.getElementById("edit-form-container");

  // Fetch and display the blog
  const loadBlog = async () => {
    const doc = await db.collection("blogs").doc(id).get();
    if (!doc.exists) {
      blogDetails.innerHTML = `
        <h2>Sorry</h2>
        <p>This blog cannot be found.</p>
        <a href="/">Back to the homepage...</a>
      `;
      return;
    }

    const blog = doc.data();
    // blogDetails.innerHTML = `
    //   <article>
    //     <h2>${blog.title}</h2>
    //     <p>Written by ${blog.author}</p>
    //     <div>${blog.body}</div>
    //     <button id="edit-btn">Edit</button>
    //     <button id="delete-btn">Delete</button>
    //   </article>
    // `;
    blogDetails.innerHTML = `
      <article>
        <h2 id="blog-title"></h2>
        <p id="blog-author"></p>
        <div id="blog-body"></div>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      </article>
    `;

    // Update: Display the title, author, and body as plain text
    const blogTitle = document.getElementById("blog-title");
    const blogAuthor = document.getElementById("blog-author");
    const blogBody = document.getElementById("blog-body");

    blogTitle.textContent = blog.title; // Display title as plain text
    blogAuthor.textContent = `Written by ${blog.author}`; // Display author as plain text
    blogBody.textContent = blog.body; // Display body as plain text

    // Show edit form when "Edit" button is clicked
    document.getElementById("edit-btn").addEventListener("click", () => {
      editFormContainer.style.display = "block";
      document.getElementById("edit-title").value = blog.title;
      document.getElementById("edit-body").value = blog.body;
      // document.getElementById("edit-author").value = blog.author;
    });

    // Handle edit form submission
    document.getElementById("edit-blog-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("edit-title").value;
      const body = document.getElementById("edit-body").value;
      // const author = document.getElementById("edit-author").value;

      await db.collection("blogs").doc(id).update({
        title,
        body,
        // author,
      });

      window.location.reload(); // Refresh the page to show updated content
    });

    // Handle delete button click
    document.getElementById("delete-btn").addEventListener("click", async () => {
      await db.collection("blogs").doc(id).delete();
      window.location.href = "/BlogSite/index.html";
    });
  };

  loadBlog();
}
