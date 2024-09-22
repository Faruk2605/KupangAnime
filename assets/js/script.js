window.addEventListener("load", async () => {
  let currentPage = 1;
  const url = "https://api.jikan.moe/v4/anime";

  // Function for fetch API base on page
  async function fetchData(page) {
    const response = await fetch(`${url}?page=${page}`);
    const result = await response.json();
    return result;
  }

  // Function for displaying animes data and pagination informations
  async function renderPage(page) {
    const result = await fetchData(page);
    const datas = result.data; // Data anime from API
    const pagination = result.pagination; // pagination information

    // clear list before display new data
    const container = document.querySelector(".main .container-grid");
    container.innerHTML = "";

    // Display  anime data
    datas?.forEach((data) => {
      console.log(data);
      const genres = data.genres.map((genre) => {
        return genre.name;
      });

      const studios = data.studios.map((studio) => {
        return studio.name;
      });

      const markup = `
        <div class="card">
          <div class="img-wrapper">
            <img src="${data.images.jpg["image_url"]}" alt="${data.title}" />
          </div>
          <div class="text-wrapper">
            <h4 class="title">${data.title}</h4>
            <h4 class="jav-title">${data["title_japanese"]}</h4>
            <p class="episode"><i class="ph ph-queue"></i> ${data.episodes} Episode</p>
            <p class="genre"><i class="ph ph-film-slate"></i> ${genres}</p>
            <p class="studio"><i class="ph ph-building"></i> ${studios}</p>
            <p class="rating"><i class="ph ph-sparkle"></i> ${data.score}</p>
            <p class="year"><i class="ph ph-calendar-dots"></i> ${data.year}</p>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", markup);
    });

    // Update  pagination informations
    document.querySelector(
      ".pagination .pagination-wrapper #pagination"
    ).innerHTML = `
        Page ${pagination.current_page} of ${pagination.last_visible_page}
      `;

    // Customize status button prev and next
    document.querySelector(".pagination .pagination-wrapper #prev").disabled =
      pagination.current_page === 1;
    document.querySelector(".pagination .pagination-wrapper #next").disabled =
      !pagination.has_next_page;
  }

  // Function for move to next pages
  async function nextPage() {
    currentPage++;
    await renderPage(currentPage);
  }

  // Function for move to previous pages
  async function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      await renderPage(currentPage);
    }
  }

  // Initialization the first page
  await renderPage(currentPage);

  // Event listener for natigation buttons
  document
    .querySelector(".pagination .pagination-wrapper #next")
    .addEventListener("click", nextPage);
  document
    .querySelector(".pagination .pagination-wrapper #prev")
    .addEventListener("click", prevPage);
});
