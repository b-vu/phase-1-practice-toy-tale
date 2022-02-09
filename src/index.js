let addToy = false;
const toyCollection = document.querySelector("#toy-collection");
const form = document.querySelector(".add-toy-form");
let toyID;

const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");
addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newToyObj = {
    id: toyID++,
    name: e.target.querySelectorAll("input")[0].value,
    image: e.target.querySelectorAll("input")[1].value,
    likes: 0
  }
  handleFormSubmission(newToyObj);
});

const getToys = () => {
  fetch("http://localhost:3000/toys")
  .then(res => {
    if(res.ok){
      return res.json();
    }
    else{
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  })
  .then(data => {
    toyID = ++data.length;
    data.forEach(toy => renderToy(toy));
  })
  .catch(err => console.log(err));
}

const renderToy = toy => {
  const div = document.createElement("div");
  div.className = "card";

  const name = document.createElement("h2");
  name.textContent = toy.name;
  div.append(name);

  const img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";
  div.append(img);

  const likes = document.createElement("p");
  likes.textContent = `${toy.likes} likes`;
  div.append(likes);

  const likesBttn = document.createElement("button");
  likesBttn.textContent = "Like";
  likesBttn.className = "like-btn";
  likesBttn.id = toy.id;

  likesBttn.addEventListener("click", () => {
    toy.likes++;
    likes.textContent = `${toy.likes} likes`;
    handleIncreaseLikes(toy);
  });

  div.append(likesBttn);

  toyCollection.append(div);
}

const handleFormSubmission = obj => {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(obj)
  })
  .then(res => {
    if(res.ok){
      return res.json();
    }
    else{
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  })
  .then(data => {
    console.log(data);
    renderToy(obj);
  })
  .catch(err => console.log(err));
}

const handleIncreaseLikes = toy => {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: toy.likes
    })
  })
  .then(res => {
    if(res.ok){
      return res.json();
    }
    else{
      throw new Error(`${res.status}: ${res.statusText}`);
    }
  })
  .then(data => console.log(data))
  .catch(err => console.log(err));
}

getToys();