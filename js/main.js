const fetchData = async (title) => {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${title}`);

    if(!response.ok) {
      throw new Error();
    }

    const fetchedData = await response.json();
    return fetchedData;

  } catch (err) {
    console.error(err.message);
  }
};


const fetchLookupData = async (id) => {
  try {

    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);

    if(!response.ok) {
      throw new Error();
    }

    const fetchedData = await response.json();
    return fetchedData;

  } catch (err) {
    console.error(err.message);
  }
};

const root = document.querySelector('.drinks-container');
const lookup = document.querySelector('.lookup-container');


const handleSubmit = () => {

  lookup.innerHTML ="";
  root.innerHTML = "";

  const input = document.getElementById('search-input');

  if (input.value !== "") {

    const response = fetchData(input.value);
    response.then(data => getData(data));
    input.value = "";
    return false;
  }
};


const handleClick = (id) => {

  root.innerHTML = "";
  const response = fetchLookupData(id);
  response.then(data => lookupData(data));
}


const getData = data => {

  data.drinks ? data.drinks?.map(({idDrink, strDrink, strDrinkThumb, strGlass, strCategory, strIBA }) => {

    root.innerHTML += `

        <div class="card" style="width: 18rem;" >
          <img src="${strDrinkThumb}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${strDrink}</h5>
            <p class="card-text">${strGlass}</p>
            <p class="card-text">${strIBA ?? 'New'}</p>
            <p class="card-text">${strCategory}</p>
            <a href="#" onclick="handleClick(${idDrink})" class="btn btn-primary" style="background: hotpink !important; border: 1px solid hotpink !important;">full recipe</a>
          </div>
        </div>
    `;
  }) : root.innerHTML = '<div class="text-center m-5"><h1>No Results <img class="avatar-large" src="https://icon-library.com/images/sad-icon/sad-icon-22.jpg" /></h1></div>';
};


const lookupData = data => {

  data.drinks?.map(({ strDrink, strDrinkThumb, strInstructions, strGlass }) => {

      lookup.innerHTML = `

          <div class="text-center">
              <h2>${strDrink}</h2>
              <p>${strGlass}</p>
          </div>


          <div class="d-flex flex-wrap justify-content-around align-items-center">
              <img src="${strDrinkThumb}" class="img-fluid m-3 rounded" style="max-width: 320px; height:auto;" alt="${strDrink}">

                <div class="d-flex">
                    <div style="max-width: 300px" class="ml-3">
                        <ul class="list-group list-group-flush ingredients">
                          <li class="list-group-item disabled" aria-disabled="true">Ingredients</li>
                        </ul>
                    </div>

                    <div style="max-width: 300px">
                      <ul class="list-group list-group-flush measures">
                        <li class="list-group-item disabled" aria-disabled="true">Measures</li>
                      </ul>
                    </div>
                </div>
          </div>

          <div class="mt-5 text-center">

            <p class="m-5">${strInstructions }</p>

          </div>
      `;

    });


    // To get the ingredients from the Json, except null values

    const ingredients = [];
    for (i = 1; i < 15; i++) {
      data.drinks[0]?.[`strIngredient${i}`] !== null &&
      ingredients.push(data.drinks[0][`strIngredient${i}`]);
    }

    // To get the measures from the Json, except null values

    const measures = [];
    for (i = 1; i < 15; i++) {
      data.drinks[0]?.[`strMeasure${i}`] !== null &&
      measures.push(data.drinks[0][`strMeasure${i}`]);
    }


    const ul1 = document.querySelector('.ingredients');
    const ul2 = document.querySelector('.measures');

    ingredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const text = document.createTextNode(ingredient);
      li.appendChild(text);
      ul1.appendChild(li);
    })

    measures.forEach(measure => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      const text = document.createTextNode(measure);
      li.appendChild(text);
      ul2.appendChild(li);
    })

};
