fetch('http://localhost:5000/api/movies')
.then(r=>r.json())
.then(data=>{
  const list=document.getElementById('list');
  data.forEach(m=>{
    list.innerHTML+=`<div>
      <img src="${m.poster}" width="120">
      <h3>${m.title}</h3>
      <a href="movie.html?id=${m._id}">Xem</a>
    </div>`;
  })
});
