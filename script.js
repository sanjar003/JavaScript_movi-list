let movies = [];
const headers = {
  "Content-Type": "application/json",
  UserId: "Nurislam",
};
const movieList = document.getElementById("movie-list");

const modal = document.getElementById("add-modal");
const backdrop = document.getElementById("backdrop");
const openModal = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("cancel");

const toggleModal = () => {
  modal.classList.toggle("visible");
  backdrop.classList.toggle("visible");
};
openModal.addEventListener("click", toggleModal);
closeModalBtn.addEventListener("click", toggleModal);
backdrop.addEventListener("click", toggleModal);

const movieTitleInput = document.getElementById("title");
const movieImageUrlInput = document.getElementById("image-url");
const movieRatingInput = document.getElementById("rating");
const addMovieBtn = document.getElementById("add-movie");

const newMovie = {};

let newArr;

const renderMovie = (movieArr) => {
  movieList.innerHTML = null;

  movieArr.map((el) => {
    console.log(el._id);

    const cardItem = document.createElement("li");
    cardItem.classList.add("movie-element");
    const title = document.createElement("h2");
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("movie-element__info");
    const rating = document.createElement("p");
    const deleteButton = document.createElement("button");
    const imgContainer = document.createElement("div");
    const EditBtn = document.createElement("button");
    EditBtn.addEventListener("click", () => openEditModal(el));
    EditBtn.innerHTML = "Edit";
    EditBtn.classList = "editBtn";
    imgContainer.classList.add("movie-element__image");
    const image = document.createElement("img");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn--danger");
    deleteButton.addEventListener("click", () => deleteTodos(el._id));
    title.innerText = el.title;
    rating.innerText = `${el.rating}/5 stars`;
    image.setAttribute("src", el.imageUrl);
    image.setAttribute("alt", el.title);
    imgContainer.append(image);
    deleteButton.innerText = "Delete";
    infoContainer.append(title, rating, deleteButton, EditBtn);
    cardItem.append(imgContainer, infoContainer);
    movieList.appendChild(cardItem);
  });
};
renderMovie(movies);
const modal2 = document.getElementById("modal");

const toggleModal2 = () => {
  console.log("in visible2");
  modal2.classList.toggle("visible");
};

const getTodos = async () => {
  try {
    const res = await fetch(
      "http://ec2-3-77-238-74.eu-central-1.compute.amazonaws.com:5500/api/v1/movies",
      { headers }
    );

    const data = await res.json();
    renderMovie(data.data);
  } catch (error) {
    console.error(error);
  }
};
getTodos();
const postTodos = async (todos) => {
  try {
    await fetch(
      "http://ec2-3-77-238-74.eu-central-1.compute.amazonaws.com:5500/api/v1/movies",
      {
        method: "POST",
        headers,
        body: JSON.stringify(todos),
      }
    );
    getTodos();
  } catch (error) {
    console.error(error);
  }
};
const deleteTodos = async (id) => {
  try {
    await fetch(
      `http://ec2-3-77-238-74.eu-central-1.compute.amazonaws.com:5500/api/v1/movies/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );
    getTodos();
  } catch (error) {
    console.error(error);
  }
};
addMovieBtn.addEventListener("click", () => {
  newMovie.title = movieTitleInput.value;
  newMovie.imageUrl = movieImageUrlInput.value;
  newMovie.rating = +movieRatingInput.value;
  movies.push(newMovie);
  renderMovie(movies);
  toggleModal();
  postTodos(newMovie);
  movieTitleInput.value = "";
  movieImageUrlInput.value = "";
  movieRatingInput.value = "";
});

const editMovie = async (id, newTitle, newImageUrl, newRating) => {
  try {
    const updatedMovie = {
      title: String(newTitle),
      imageUrl: newImageUrl,
      rating: +newRating,
    };

    const response = await fetch(
      `http://ec2-3-77-238-74.eu-central-1.compute.amazonaws.com:5500/api/v1/movies/${id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedMovie),
      }
    );
    if (response.ok) {
      getTodos();
      toggleModal2();
      modal2.classList.remove("visible");
    } else {
      console.error("Failed to edit movie");
    }
  } catch (error) {
    console.error(error);
  }
};

const openEditModal = (movie) => {
  const inputTitle = document.getElementById("new-title");
  const inputImageUrl = document.getElementById("new-image-url");
  const inputRating = document.getElementById("new-rating");
  const editButton = document.getElementById("edit");
  const closeButton = document.getElementById("close");

  inputTitle.value = movie.title;
  inputImageUrl.value = movie.imageUrl;
  inputRating.value = movie.rating;

  closeButton.addEventListener("click", toggleModal2);

  editButton.addEventListener("click", () => {
    const newTitle = inputTitle.value;
    const newImageUrl = inputImageUrl.value;
    const newRating = +inputRating.value;
    editMovie(movie._id, newTitle, newImageUrl, newRating);
  });
  toggleModal2();
};
