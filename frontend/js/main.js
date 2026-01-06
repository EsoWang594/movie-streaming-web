const API_URL = 'https://your-backend.onrender.com/api'; // đổi URL khi deploy

/* ---------------- JWT Helpers ---------------- */
function getToken() {
  return localStorage.getItem('token');
}
function setToken(token) {
  localStorage.setItem('token', token);
}
function removeToken() {
  localStorage.removeItem('token');
}
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

/* ---------------- Header / Auth Links ---------------- */
const token = getToken();
if (token) {
  document.getElementById('login-link')?.style.display = 'none';
  document.getElementById('logout-link')?.style.display = 'inline';
  document.getElementById('logout-link')?.addEventListener('click', () => {
    removeToken();
    window.location.href = 'index.html';
  });

  const decoded = parseJwt(token);
  if (decoded?.role === 'admin') {
    document.getElementById('admin-link')?.style.display = 'inline';
  }
}

/* ---------------- Index Page: Load Movies & Carousel ---------------- */
async function loadMovies() {
  try {
    const res = await fetch(`${API_URL}/movies`);
    if (!res.ok) throw new Error('Cannot load movies');
    const movies = await res.json();

    // Movie grid
    const list = document.getElementById('list');
    if (list) {
      let html = '';
      movies.forEach(m => {
        html += `<div class="movie-card">
          <img src="${m.poster}" alt="${m.title}">
          <h3>${m.title}</h3>
          <a href="movie.html?id=${m._id}">Xem</a>
        </div>`;
      });
      list.innerHTML = html;
    }

    // Featured carousel
    const featured = document.getElementById('featured-movies');
    if (featured) {
      let html = '';
      movies.slice(0, 5).forEach(m => {
        html += `<div class="movie-card">
          <a href="movie.html?id=${m._id}">
            <img src="${m.poster}" alt="${m.title}">
          </a>
        </div>`;
      });
      featured.innerHTML = html;
    }

  } catch (err) {
    console.error(err);
  }
}
loadMovies();

/* ---------------- Login / Register ---------------- */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.msg || "Login failed");
      setToken(data.token);
      alert("Đăng nhập thành công");
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
    }
  });

  const registerLink = document.getElementById('register-link');
  registerLink?.addEventListener('click', async () => {
    const username = prompt("Tên đăng nhập:");
    const password = prompt("Mật khẩu:");
    if (!username || !password) return;
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      alert(data.msg || "Đăng ký thành công");
    } catch (err) {
      console.error(err);
    }
  });
}

/* ---------------- Movie Page ---------------- */
async function loadMovie() {
  const movieId = new URLSearchParams(window.location.search).get('id');
  if (!movieId) return;

  try {
    const res = await fetch(`${API_URL}/movies/${movieId}`);
    if (!res.ok) throw new Error("Cannot load movie");
    const movie = await res.json();

    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-desc').textContent = movie.description;
    document.getElementById('movie-video').src = movie.videoUrl;

    // Load comments
    const cRes = await fetch(`${API_URL}/comments/${movieId}`);
    const comments = await cRes.json();
    const commentList = document.getElementById('comment-list');
    if (commentList) {
      commentList.innerHTML = comments.map(c => {
        const username = c.user?.username || "Ẩn danh";
        return `<p><b>${username}</b>: ${c.content} (${c.rating || 0})</p>`;
      }).join('');
    }

    // Post comment
    const commentForm = document.getElementById('comment-form');
    commentForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const content = document.getElementById('comment-content').value;
      const rating = parseInt(document.getElementById('comment-rating').value);
      const token = getToken();
      if (!token) return alert("Bạn phải đăng nhập để bình luận");
      try {
        const res = await fetch(`${API_URL}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ movie: movieId, content, rating })
        });
        if (!res.ok) throw new Error("Comment failed");
        const c = await res.json();
        const username = c.user?.username || "Bạn";
        commentList.innerHTML += `<p><b>${username}</b>: ${c.content} (${c.rating || 0})</p>`;
        document.getElementById('comment-content').value = '';
        document.getElementById('comment-rating').value = '';
      } catch (err) { console.error(err); }
    });

  } catch (err) {
    console.error(err);
  }
}
loadMovie();

/* ---------------- Admin Page ---------------- */
async function loadAdminMovies() {
  const token = getToken();
  if (!token) return;
  const decoded = parseJwt(token);
  if (!decoded || decoded.role !== 'admin') return alert("Bạn không phải admin");

  try {
    const res = await fetch(`${API_URL}/movies`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error("Cannot load movies");
    const movies = await res.json();

    const list = document.getElementById('admin-movie-list');
    if (list) {
      list.innerHTML = movies.map(m =>
        `<p>${m.title} <button onclick="deleteMovie('${m._id}')">Xóa</button></p>`
      ).join('');
    }

  } catch (err) {
    console.error(err);
  }
}
loadAdminMovies();

async function deleteMovie(id) {
  const token = getToken();
  if (!token) return alert("Bạn phải đăng nhập");
  if (!confirm("Xóa phim này?")) return;

  try {
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Xóa thất bại");
    loadAdminMovies();
  } catch (err) { console.error(err); }
}

/* Add movie (admin) */
const addForm = document.getElementById('add-movie-form');
addForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const token = getToken();
  if (!token) return alert("Bạn phải đăng nhập admin");
  const decoded = parseJwt(token);
  if (!decoded || decoded.role !== 'admin') return alert("Bạn không phải admin");

  const body = {
    title: document.getElementById('title').value,
    poster: document.getElementById('poster').value,
    videoUrl: document.getElementById('videoUrl').value,
    description: document.getElementById('description').value,
    genre: document.getElementById('genre').value,
    year: parseInt(document.getElementById('year').value)
  };

  try {
    const res = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("Thêm phim thất bại");
    loadAdminMovies();
    addForm.reset();
  } catch (err) { console.error(err); }
});
