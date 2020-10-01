/* Responsive Navigationsleiste, Code übernommen und abgeändert von https://www.w3schools.com/howto/howto_js_topnav_responsive.asp (Auch in den .html Dokumenten)*/
function NavResponsiv() {
    var x = document.getElementById("navigation");
    if (x.className === "navigation") {
        x.className += " responsive";
    } else {
        x.className = "navigation";
    }
}
/* Navigationsleiste Ende */


/* Modal Popup Box Anfang */
window.onload = function() {
        var popup = document.querySelector(".popup");
        var trigger = document.querySelector(".trigger");
        var closeButton = document.querySelector(".close-button");

        function togglePopup() {
            popup.classList.toggle("show-modal");
        }

        function windowOnClick(event) { if (event.target === popup) { togglePopup(); } }

        trigger.addEventListener("click", togglePopup);
        closeButton.addEventListener("click", togglePopup);
        window.addEventListener("click", windowOnClick);
    }
    /* Modal Popup Box Ende */


/* CRUD Funktionalität Anfang */
document.addEventListener('DOMContentLoaded', function() {

        const orteContainer = document.querySelector('#orte-container')
        const orteURL = "http://localhost:3000/orte"
        const beitragForm = document.querySelector('#beitrag-Form')
        let alleOrte = []

        fetch(`${orteURL}`)
            .then(response => response.json())
            .then(beitragData => beitragData.forEach(function(orte) {
                alleOrte = beitragData
                orteContainer.innerHTML += `
          <div id=orte-${orte.id}>
            <h2>${orte.titel}</h2>
            <img src="${orte.bild}" width="640" height="360">
            <p>${orte.inhalt}</p>
            <button data-id="${orte.id}" id="edit-${orte.id}" data-action="edit">📝 Bearbeiten</button>
            <button data-id="${orte.id}" id="delete-${orte.id}" data-action="delete">🚮 Löschen</button>
          </div>
          <div id=edit-orte-${orte.id}>
            </div>`
            })) // Dieser Teil des Skripts (fetch) holt sich die Informationen über die Beiträge aus der orte.json Datei

        beitragForm.addEventListener('submit', (e) => {
                event.preventDefault();


                const titelInput = beitragForm.querySelector('#titel').value
                const bildInput = beitragForm.querySelector('#bild').value
                const inhaltInput = beitragForm.querySelector('#inhalt').value

                fetch(`${orteURL}`, {
                        method: 'POST',
                        body: JSON.stringify({
                            titel: titelInput,
                            bild: bildInput,
                            inhalt: inhaltInput
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => response.json())
                    .then(orte => {
                        alleOrte.push(orte)
                        orteContainer.innerHTML += `
                          <div id=orte-${orte.id}>
                            <h2>${orte.titel}</h2>
                            <img src="${orte.bild}" width="640" height="360">
                            <p>${orte.inhalt}</p>
                            <button data-id=${orte.id} id="edit-${orte.id}" data-action="edit">📝 Bearbeiten</button>
                            <button data-id=${orte.id} id="delete-${orte.id}" data-action="delete">🚮 Löschen</button>
                          </div>
                          <div id=edit-orte-${orte.id}>
                          </div>`
                    })
            }) // Eventlistener, der für das Hinzufügen eines Beitrags zuständig ist.

        orteContainer.addEventListener('click', (e) => {
                if (e.target.dataset.action === 'edit') {

                    const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
                    editButton.disabled = true

                    const beitragData = alleOrte.find((Orte) => {
                        return orte.id == e.target.dataset.id
                    })

                    const editForm = orteContainer.querySelector(`#edit-orte-${e.target.dataset.id}`)
                    editForm.innerHTML = `
                    <form class='form' id='edit-orte' action='all_places.html' method='post'>
                      <form id="beitrag-form">
                        <input required id="edit-titel" placeholder="${beitragData.titel}">
                        <input required id="edit-bild" placeholder="${beitragData.bild}">
                        <input required id="edit-inhalt" placeholder="${beitragData.inhalt}">
                        <input type="submit" value="Beitrag Bearbeiten">
                    </form>`

                    editForm.addEventListener("submit", (e) => {
                            event.preventDefault()

                            const titelInput = document.querySelector("#edit-titel").value
                            const bildInput = document.querySelector("#edit-bild").value
                            const inhaltInput = document.querySelector("#edit-inhalt").value
                            const bearbeiteterOrt = document.querySelector(`#orte-${beitragData.id}`)

                            fetch(`${orteURL}/${beitragData.id}`, {
                                    method: 'PATCH',
                                    body: JSON.stringify({
                                        titel: titelInput,
                                        bild: bildInput,
                                        inhalt: inhaltInput,
                                    }),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(response => response.json())
                                .then(orte => {
                                    bearbeiteterOrt.innerHTML = `
                        <div id=orte-${orte.id}>
                          <h2>${orte.titel}</h2>
                          <img src="${orte.Bild}" width="640" height="360">
                          <p>${orte.inhalt}</p>
                          <button data-id=${orte.id} id="edit-${orte.id}" data-action="edit">📝 Bearbeiten</button>
                          <button data-id=${orte.id} id="delete-${orte.id}" data-action="delete">🚮 Löschen</button>
                        </div>
                        <div id=edit-orte-${orte.id}>
                        </div>`
                                    editForm.innerHTML = ""

                                    //editForm.remove();
                                    //document.querySelector("#edit-titel").value = '';
                                    //document.querySelector("#edit-bild").value = '';
                                    //document.querySelector("#edit-inhalt").value = '';
                                    //document.querySelector(`#orte-${beitragData.id}`).value = '';


                                })
                        }) //Eventlistener, der für das Bearbeiten zuständig ist

                } else if (e.target.dataset.action === 'delete') {
                    document.querySelector(`#orte-${e.target.dataset.id}`).remove()
                    fetch(`${orteURL}/${e.target.dataset.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => response.json())
                }

            }) //Eventlistener, der für das Löschen zuständig ist
    })
    /* CRUD Funktionalität Ende */