const xmlToJsonApi = "https://api.rss2json.com/v1/api.json?rss_url=";

async function fetchNews(dataLinks){
  try {
    let dataArray = [];
    // const promises = dataLinks.map(async e =>  await (await fetch(`${xmlToJsonApi}${e}`)).json())
    // Promise.all(promises).then(res => {
    //   console.log(res);
    //   addToDom(res);
    // });
    for(let i = 0; i<dataLinks.length; i++){
      const respo = await fetch(`${xmlToJsonApi}${dataLinks[i]}`);
      const data = await respo.json();
      dataArray.push(data);
    }
    addToDom(dataArray);
  } catch {
    return null;
  }
}

const accordionParentId = "accor"
const accordionContainer = document.getElementById("newsFeed-outer");
const accordionMainDiv = document.createElement("div");
accordionMainDiv.setAttribute("class", "accordion");
accordionMainDiv.setAttribute("id", accordionParentId);

function addToDom(array){
  accordionContainer.appendChild(accordionMainDiv);
  array.forEach((element,index) => {
    createAccordionItems(element, index)
    accordionContainer.appendChild(accordionMainDiv);
  });
}


function createAccordionItems(element, index){
  const accordionItemDiv = document.createElement("div");
  accordionItemDiv.setAttribute("class", "accordion-item");

  if(index == 0){
    accordionItemDiv.innerHTML = `
    <div class="accordion-header" id="header${index}">
      <button class="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#body${index}" aria-expanded="false" aria-controls="#body${index}">
        ${element.feed.title}
      </button>
    </div>
    <div class="accordion-collapse collapse show" id="body${index}" aria-labelledby="#header${index}" data-bs-parent="#${accordionParentId}">
      <div class="accordion-body"></div>
    </div>
  `;
  accordionMainDiv.appendChild(accordionItemDiv);
  }else{
    accordionItemDiv.innerHTML = `
    <div class="accordion-header" id="header${index}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#body${index}" aria-expanded="false" aria-controls="#body${index}">
        ${element.feed.title}
      </button>
    </div>
    <div class="accordion-collapse collapse" id="body${index}" aria-labelledby="#header${index}" data-bs-parent="#${accordionParentId}">
      <div class="accordion-body"></div>
    </div>
  `;
  accordionMainDiv.appendChild(accordionItemDiv);
  }
  
  //  console.log(accordionMainDiv);
  createAccordionBody(element, index);
}


function createAccordionBody(element, index){
  const accordionBody = document.getElementsByClassName("accordion-body")[index];
  // console.log(element);
  const carouselMainDiv = document.createElement("a");
  carouselMainDiv.setAttribute("id", `carousel${index}`);
  carouselMainDiv.setAttribute("class", "carousel slide d-block");
  carouselMainDiv.setAttribute("data-bs-ride", "carousel");
  carouselMainDiv.setAttribute("href", element.feed.link)
  carouselMainDiv.setAttribute("target", "_blank");
  
  accordionBody.appendChild(carouselMainDiv)

  const carouselInner = (element) => {
    const carouselInnerDiv = document.createElement("div");
    carouselInnerDiv.setAttribute("class", "carousel-inner");

    element.items.forEach((allItems,ind) => {
      if(ind === 0){
        const carouselItemDiv = document.createElement("div");
        carouselItemDiv.setAttribute("class", `carousel-item active`);

        carouselItemDiv.innerHTML += `<img src="${allItems.enclosure.link}" class="d-block w-100" alt="image"/>
          <h3 class="carousel-head">${allItems.title}</h3>
          <h3 class="carousel-name">${allItems.author}</h3>
          <div class="dot"></div>
          <h3 class="date">${allItems.pubDate}</h3>
          <p class="descrip">${allItems.description}</p>
        `;

        carouselInnerDiv.appendChild(carouselItemDiv);
      }else{
        const carouselItemDiv = document.createElement("div");
        carouselItemDiv.setAttribute("class", `carousel-item`);
        carouselItemDiv.innerHTML += `<img src="${allItems.enclosure.link}"  class="d-block w-100" alt="image"/>
          <h3 class="carousel-head">${allItems.title}</h3>
          <h3 class="carousel-name">${allItems.author}</h3>
          <div class="dot"></div>
          <h3 class="date">${allItems.pubDate}</h3>
          <p class="descrip">${allItems.description}</p>
        `;
        carouselInnerDiv.appendChild(carouselItemDiv);
      }
      carouselMainDiv.appendChild(carouselInnerDiv)
    })
  }

  carouselInner(element);

  carouselMainDiv.innerHTML += `
    <button class="carousel-control-prev" type="button" data-bs-target="#carousel${index}" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next"  type="button" data-bs-target="#carousel${index}" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  `;
}
export { fetchNews };