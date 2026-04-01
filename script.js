//PROMPT : "Comment charger mon dataset JSON externe via un url et pas en local?"
//RÉPONSE GEMINI : "Utilisation de fetch avec async/await et un bloc try/catch pour sécuriser le chargement."

const myUrl = "https://makerslab.em-lyon.com/dww/data/products.json";

const getData = async(doStuffs) => {
    try {
        const response = await fetch(myUrl);
        if(!response.ok) throw new Error("Erreur réseau");
        const data = await response.json();
        doStuffs(data);
    } catch(error) {
        console.error("Erreur : " + error);
    }
}

getData((data) => {
    const grid = document.querySelector("#products-grid");
    const popoversContainer = document.querySelector("#popovers-container");

    // PROMPT : "Mon JSON est structuré par marques puis par modèles. Comment créer une carte pour chaque chaussure automatiquement ?"
    // RÉPONSE GEMINI : "Mise en place d'une double boucle forEach pour parcourir les marques, puis les items de chaque marque, en générant un uniqueId pour chaque produit." 
    
    data.brands.forEach((brand) => {
        data.items[brand].forEach((model, index) => {
            const uniqueId = `${brand}-${index}`;

            // Génération des tailles
            let sizesHtml = "";
            model.availability.forEach(s => {
                const isAvail = s.quantity > 0;
                sizesHtml += `<div class="${isAvail ? 'size-btn' : 'size-btn disabled'}">${s.size}</div>`;
            });

            // Carte produit
            grid.innerHTML += `
                <button class="product-card" popovertarget="pop-${uniqueId}">
                    <div class="product-image"><img src="${model.image}" alt="${model.name}"></div>
                    <div class="product-info">
                        <p class="brand">${brand.toUpperCase()} / ${model.gender}</p>
                        <h3 class="model">${model.name}</h3>
                        <p class="price">€ ${model.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                </button>`;

            // Modale Popover
            popoversContainer.innerHTML += `
                <div id="pop-${uniqueId}" popover class="modal-content">
                    <div class="modal-header">
                        <div class="info-container">
                            <i data-lucide="info"></i>
                            <div class="description-box">
                                <strong>DESCRIPTION</strong><br>${model.description}
                            </div>
                        </div>
                        <button class="close-btn" popovertarget="pop-${uniqueId}" popovertargetaction="hide">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="size-selector">${sizesHtml}</div>
                    <div class="modal-product-view">
                        <img src="${model.image}" class="blurred-img">
                        <i data-lucide="heart" class="heart-icon"></i>
                    </div>
                    <button class="add-btn">ADD TO CART</button>
                </div>`;
        });
    });

    //PROMPT : "Pourquoi mes icônes Lucide ne s'affichent pas quand je les injecte en JS?"
    //RÉPONSE GEMINI : "Appel de lucide.createIcons() impérativement après l'injection du HTML dans le DOM."
    lucide.createIcons();
});