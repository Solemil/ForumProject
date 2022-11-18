let main = document.querySelector("main");

let loadPosts = () => {
  main.innerHTML = "";
  fetch("http://localhost:3000/posts")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        main.innerHTML += `<article>
				<div class="vote">
				<img src="/static/img/upvote.png"" alt="upvote-button" id="upvote-button-${element.id}">
				<p class="post-vote-number">${element.score}</p>
				<img src="/static/img/downvote.png" alt="downvote-button" id="downvote-button-${element.id}">
				</div>
				<div>
				<h2>${element.title}</h2>
				<p class="post-text" >${element.url}</p>
				</div>
				</article>`;
      });

      data.forEach((element) => {
        let upvoteButton = document.querySelector(
          `#upvote-button-${element.id}`
        );
        upvoteButton.addEventListener("click", (event) => {
          fetch(`http://localhost:3000/${element.id}/upvote`, {
            headers: { "Content-type": "application/json" },
            method: "PUT",
            body: JSON.stringify({ user_id: 1 }),
          }).then(loadPosts);
        });
      });

      data.forEach((element) => {
        let downvoteButton = document.querySelector(
          `#downvote-button-${element.id}`
        );
        downvoteButton.addEventListener("click", (event) => {
          fetch(`http://localhost:3000/${element.id}/downvote`, {
            headers: { "Content-type": "application/json" },
            method: "PUT",
            body: JSON.stringify({ user_id: 1 }),
          })
            .then(loadPosts);
        });
      });
    });
};

let button = document.querySelector(".button");
button.addEventListener("click", () => {
  main.innerHTML = `<h1>Make your post<h1>
	<input type="text" id="title" name="name"
	minlength="4" maxlength="8" size="10">
	<input type="text" id="url" name="name"
	minlength="4" maxlength="8" size="10">
	<button id=submit-form class="btn btn-primary button">Sumbit</button>`;

  document.querySelector("#submit-form").addEventListener("click", () => {
    let title = document.querySelector("#title").value;
    let url = document.querySelector("#url").value;
    fetch("http://localhost:3000/posts", {
      headers: { "Content-type": "application/json" },
      method: "POST",
      body: JSON.stringify({ title: `${title}`, url: `${url}`, owner_Id: 1 }),
    })
			.then(loadPosts);
  });
});

loadPosts();
