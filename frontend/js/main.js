// Auto-detect API URL: use localhost if running locally, otherwise use production URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:5000/api' 
  : 'https://movie-streaming-web-86an.onrender.com/api';

/* ---------------- JWT Helpers ---------------- */
function getToken() { return localStorage.getItem('token'); }
function setToken(token) { localStorage.setItem('token', token); }
function removeToken() { localStorage.removeItem('token'); }
function parseJwt(token) {
  try { return JSON.parse(atob(token.split('.')[1])); }
  catch { return null; }
}

/* ---------------- Header / Auth Links ---------------- */
const token = getToken();
if (token) {
  document.getElementById('login-link')?.style.setProperty('display','none');
  document.getElementById('logout-link')?.style.setProperty('display','inline');
  document.getElementById('logout-link')?.addEventListener('click', () => {
    removeToken();
    window.location.href = 'index.html';
  });
  const decoded = parseJwt(token);
  if (decoded?.role === 'admin') {
    document.getElementById('admin-link')?.style.setProperty('display','inline');
  }
}

/* ---------------- Load Movies ---------------- */
async function loadMovies() {
  try {
    const res = await fetch(`${API_URL}/movies`);
    if (!res.ok) throw new Error('Cannot load movies');
    const movies = await res.json();

    // Movie Grid
    const list = document.getElementById('list');
    if (list) {
      list.innerHTML = movies.map(m => `<div class="movie-card">
        <img src="${m.poster}" alt="${m.title}">
        <h3>${m.title}</h3>
        <a href="movie.html?id=${m._id}">Xem</a>
      </div>`).join('');
    }

    // Featured Carousel
    const featured = document.getElementById('featured-movies');
    if (featured) {
      featured.innerHTML = movies.slice(0, 5).map(m => `<div class="movie-card">
        <a href="movie.html?id=${m._id}"><img src="${m.poster}" alt="${m.title}"></a>
      </div>`).join('');
      autoSlideCarousel();
    }

  } catch (err) { console.error(err); }
}
loadMovies();

/* ---------------- Carousel Auto-slide ---------------- */
function autoSlideCarousel() {
  const carousel = document.getElementById('featured-movies');
  if (!carousel) return;
  let scroll = 0;
  const distance = 250;
  setInterval(() => {
    if (scroll >= carousel.scrollWidth - carousel.clientWidth) scroll = 0;
    else scroll += distance;
    carousel.scrollTo({ left: scroll, behavior: 'smooth' });
  }, 3000);
}

/* ---------------- Login / Register ---------------- */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      // Kiểm tra Content-Type trước khi parse JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Server trả về HTML thay vì JSON:", text.substring(0, 200));
        alert("Lỗi: Server trả về dữ liệu không đúng định dạng. Kiểm tra console để xem chi tiết.");
        return;
      }
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.msg || "Đăng nhập thất bại");
        return;
      }
      
      if (!data.token) {
        alert("Không nhận được token từ server");
        console.error("Response data:", data);
        return;
      }
      
      setToken(data.token);
      alert("Đăng nhập thành công!");
      window.location.href = 'index.html';
    } catch (err) { 
      console.error("Login error:", err);
      console.error("API_URL:", API_URL);
      alert("Lỗi kết nối: " + err.message + "\n\nKiểm tra:\n1. Server có đang chạy không?\n2. API URL: " + API_URL);
    }
  });

  document.getElementById('register-link')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const username = prompt("Tên đăng nhập:");
    if (!username) return;
    
    const password = prompt("Mật khẩu (tối thiểu 6 ký tự):");
    if (!password) return;
    
    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      // Kiểm tra Content-Type trước khi parse JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Server trả về HTML thay vì JSON:", text.substring(0, 200));
        alert("Lỗi: Server trả về dữ liệu không đúng định dạng. Kiểm tra console để xem chi tiết.");
        return;
      }
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.msg || "Đăng ký thất bại");
        return;
      }
      
      alert(data.msg || "Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = 'login.html';
    } catch (err) { 
      console.error("Register error:", err);
      console.error("API_URL:", API_URL);
      alert("Lỗi kết nối: " + err.message + "\n\nKiểm tra:\n1. Server có đang chạy không?\n2. API URL: " + API_URL);
    }
  });
}

/* ---------------- Movie Page ---------------- */
async function loadMovie() {
  const movieId = new URLSearchParams(window.location.search).get('id');
  if (!movieId) return;
  
  // Load comments function
  const loadComments = async () => {
    try {
      const cRes = await fetch(`${API_URL}/comments/${movieId}`);
      if (!cRes.ok) throw new Error("Cannot load comments");
      const comments = await cRes.json();
      const commentList = document.getElementById('comment-list');
      if (commentList) {
        if (comments.length === 0) {
          commentList.innerHTML = '<p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>';
        } else {
          commentList.innerHTML = comments.map(c => {
            const username = c.user?.username || "Ẩn danh";
            const rating = c.rating ? `${c.rating}/5` : '';
            return `<div class="comment-item">
              <p><b>${username}</b> ${rating ? `<span class="rating">⭐ ${rating}</span>` : ''}</p>
              <p>${c.content}</p>
              <small>${new Date(c.createdAt).toLocaleString('vi-VN')}</small>
            </div>`;
          }).join('');
        }
      }
    } catch (err) {
      console.error("Error loading comments:", err);
      const commentList = document.getElementById('comment-list');
      if (commentList) {
        commentList.innerHTML = '<p>Không thể tải bình luận</p>';
      }
    }
  };
  
  try {
    const res = await fetch(`${API_URL}/movies/${movieId}`);
    if (!res.ok) throw new Error("Cannot load movie");
    const movie = await res.json();

    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-desc').textContent = movie.description;
    
    // Hàm chuyển đổi YouTube URL sang embed format
    const convertYouTubeUrl = (url) => {
      if (!url) return null;
      
      // Kiểm tra xem có phải YouTube URL không
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(youtubeRegex);
      
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      
      return null;
    };
    
    // Kiểm tra và hiển thị video
    const videoUrl = movie.videoUrl;
    const videoElement = document.getElementById('movie-video');
    const iframeElement = document.getElementById('movie-iframe');
    
    const embedUrl = convertYouTubeUrl(videoUrl);
    
    if (embedUrl) {
      // Nếu là YouTube URL, dùng iframe
      iframeElement.src = embedUrl;
      iframeElement.style.display = 'block';
      videoElement.style.display = 'none';
    } else {
      // Nếu là video thường, dùng video tag
      videoElement.src = videoUrl;
      videoElement.style.display = 'block';
      iframeElement.style.display = 'none';
    }

    // Load comments
    await loadComments();

    // Post comment
    const commentForm = document.getElementById('comment-form');
    commentForm?.addEventListener('submit', async e => {
      e.preventDefault();
      const content = document.getElementById('comment-content').value.trim();
      const rating = parseInt(document.getElementById('comment-rating').value);
      const token = getToken();
      
      if (!token) {
        alert("Bạn phải đăng nhập để bình luận");
        window.location.href = 'login.html';
        return;
      }
      
      if (!content) {
        alert("Vui lòng nhập nội dung bình luận");
        return;
      }
      
      if (isNaN(rating) || rating < 1 || rating > 5) {
        alert("Điểm đánh giá phải từ 1 đến 5");
        return;
      }
      
      try {
        const res = await fetch(`${API_URL}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ movie: movieId, content, rating })
        });
        
        // Kiểm tra Content-Type trước khi parse JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Server trả về HTML thay vì JSON:", text.substring(0, 200));
          alert("Lỗi: Server trả về dữ liệu không đúng định dạng");
          return;
        }
        
        const data = await res.json();
        
        if (!res.ok) {
          alert(data.msg || "Gửi bình luận thất bại");
          return;
        }
        
        // Reload lại danh sách comment
        await loadComments();
        
        // Reset form
        document.getElementById('comment-content').value = '';
        document.getElementById('comment-rating').value = '';
        alert("Gửi bình luận thành công!");
      } catch (err) { 
        console.error("Comment error:", err);
        alert("Lỗi: " + err.message);
      }
    });

  } catch (err) { console.error(err); }
}
loadMovie();

/* ---------------- Admin Page ---------------- */
async function loadAdminMovies() {
  const token = getToken();
  if (!token) return;
  const decoded = parseJwt(token);
  if (!decoded || decoded.role !== 'admin') return alert("Bạn không phải admin");

  try {
    const res = await fetch(`${API_URL}/movies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Cannot load movies");
    const movies = await res.json();

    const list = document.getElementById('admin-movie-list');
    if (list) {
      if (movies.length === 0) {
        list.innerHTML = '<p>Chưa có phim nào</p>';
        return;
      }
      list.innerHTML = movies.map(m => {
        const hasVideo = m.videoUrl ? '✅' : '❌';
        const videoPreview = m.videoUrl ? 
          (m.videoUrl.length > 50 ? m.videoUrl.substring(0, 50) + '...' : m.videoUrl) : 
          'Chưa có video URL';
        return `<div class="admin-movie-item">
          <div>
            <strong>${m.title}</strong> ${hasVideo}
            <br><small>Video: ${videoPreview}</small>
          </div>
          <div>
            <button onclick="editMovieVideo('${m._id}', '${m.title}')">Sửa Video</button>
            <button onclick="deleteMovie('${m._id}')">Xóa</button>
          </div>
        </div>`;
      }).join('');
    }

  } catch (err) { console.error(err); }
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

async function editMovieVideo(id, title) {
  const token = getToken();
  if (!token) return alert("Bạn phải đăng nhập");
  
  const currentUrl = prompt(`Nhập URL video mới cho phim "${title}":`);
  if (!currentUrl || !currentUrl.trim()) return;
  
  try {
    // Lấy thông tin phim hiện tại
    const getRes = await fetch(`${API_URL}/movies/${id}`);
    if (!getRes.ok) throw new Error("Không thể lấy thông tin phim");
    const movie = await getRes.json();
    
    // Cập nhật videoUrl
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...movie,
        videoUrl: currentUrl.trim()
      })
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.msg || "Cập nhật thất bại");
    }
    
    alert("Cập nhật video URL thành công!");
    loadAdminMovies();
  } catch (err) {
    console.error(err);
    alert("Lỗi: " + err.message);
  }
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