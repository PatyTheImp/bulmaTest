const filmsSelect = document.querySelector(".films-select");
const filmsTitle = document.querySelector(".film-title");
const originalTitle = document.querySelector(".original-title");
const filmInfo = document.querySelector(".film-info");

//Acrescenta os filmes no dropdown
async function populateDropdown() {
  try {
    const res = await fetch("https://ghibliapi.herokuapp.com/films");
    const data = await res.json();
    data.forEach((d) => {
      filmsSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${d.id}">${d.title}</option>`
      );
    });
  } catch (error) {
    alert(error.message);
  }
}

populateDropdown();

function renderMovieInfo(data) {
  const html = `
        <h1 class="film-title">${data.title}</h1>

        <div class="original-title-container">
        <h1 class="original-title">${data.original_title}</h1>
        <p class="original-title-rom">${data.original_title_romanised}</p>
        </div>

        <div class="film-media-desc">
        <div class="media-container">
        <video
        class="film-video"
          src="./media/Video of Black Cat.mp4"
          type="video/mp4"
          autoplay
          muted
          loop
        ></video>
        <img class="film-img" src="./media/totoro.png" alt="totoro" />
        
      </div>
        <p class="film-desc"><b>Description: </b>${data.description}</p>
        </div>

        <div class="film-extra-info">
        <p><b>Director: </b>${data.director}</p>
        <p><b>Producer: </b>${data.producer}</p>
        <p><b>Release Year: </b>${data.release_date}</p>
        <p><b>Running Time: </b>${data.running_time} min</p>
        <p><b>Score: </b>${data.rt_score}/100</p>
        </div>

        <div class="film-lists">
        <div class="list-container">
        <p><b>People:</b></p>
        <ul class="people-list">
        </ul>
        </div>

        <div class="list-container">
        <p><b>Species:</b></p>
        <ul class="species-list">
        </ul>
        </div>

        <div class="list-container">
        <p><b>Locations:</b></p>
        <ul class="locations-list">
        </ul>
        </div>

        <div class="list-container">
        <p><b>Vehicles:</b></p>
        <ul class="vehicles-list">
        </ul>
        </div>
        <div></div>
        </div>
    `;

  filmInfo.innerHTML = "";
  filmInfo.insertAdjacentHTML("beforeend", html);
}

async function listInfo(URL, className) {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    const { name } = data;
    const listEl = document.querySelector(`.${className}`);
    let listItem;

    if (!name) listItem = "Nothing found";
    else listItem = name;

    listEl.insertAdjacentHTML("beforeend", `<li>${listItem}</li>`);
  } catch (error) {
    alert(error.message);
  }
}

//Quando se muda a opção no dropdown, mostra a informação do filme seleccionado
filmsSelect.addEventListener("change", async function () {
  const id = filmsSelect.value;

  //Se nenhum filme for seleccionado, esconde a informação de filmes
  if (id == 0) {
    filmInfo.classList.add("is-hidden");
  } else {
    try {
      const res = await fetch(`https://ghibliapi.herokuapp.com/films/${id}`);
      const data = await res.json();
      const { people, species, locations, vehicles } = data;

      renderMovieInfo(data);

      people.forEach((url) => listInfo(url, "people-list"));
      species.forEach((url) => listInfo(url, "species-list"));
      locations.forEach((url) => listInfo(url, "locations-list"));
      vehicles.forEach((url) => listInfo(url, "vehicles-list"));

      filmInfo.classList.remove("is-hidden");
    } catch (error) {
      alert(error.message);
    }
  }
});
