let currentDogId = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('Hemsidan är redo!');
  setupAddDogForm();
  setupDogListToggle();  // Setup för knappen för att visa listan
  setupEditButton();
  setupDeleteButton();
});

// Setup för "Alla Hundraser"-knappen
function setupDogListToggle() {
  const toggleButton = document.getElementById('toggle-dog-list');
  const dogsList = document.getElementById('dogs');

  // Se till att listan är gömd från början
  dogsList.classList.add('hidden'); 

  toggleButton.addEventListener('click', () => {
    // Kolla om listan är gömd eller inte
    if (dogsList.classList.contains('hidden')) {
      fetchDogs(); // Hämta hundraser när användaren klickar
      dogsList.classList.remove('hidden'); // Visa listan
    } else {
      dogsList.classList.add('hidden'); // Dölj listan om den är synlig
    }
  });
}

// Hämta hundraser från backend API
function fetchDogs() {
  fetch('http://localhost:3000/api/dogs')  // Din backend URL
    .then(response => {
      if (!response.ok) {
        throw new Error('Något gick fel vid hämtning av hundraser');
      }
      return response.json();
    })
    .then(data => {
      displayDogs(data); // Visa hundraserna i listan
    })
    .catch(error => console.error('Fel vid hämtning av hundraser:', error));
}

// Visa hundraserna på sidan
function displayDogs(dogs) {
  const dogsList = document.getElementById('dogs');
  dogsList.innerHTML = ''; // Rensa tidigare data

  dogs.forEach(dog => {
    const li = document.createElement('li');
    li.textContent = dog.name;
    li.addEventListener('click', () => selectDog(dog));  // Klicka på hundrasen
    dogsList.appendChild(li); // Lägg till hundrasen i listan
  });
}

// Funktion för att välja hundras
function selectDog(dog) {
  const selectedDogSection = document.getElementById('selected-dog');
  const dogBreed = document.getElementById('dog-breed'); // Här visas rasen
  const dogImageElement = document.getElementById('dog-image'); // Bild-elementet
  const dogTemperament = document.getElementById('dog-temperament');
  const dogLifespan = document.getElementById('dog-lifespan');
  const dogsList = document.getElementById('dogs'); // Listan på hundarna

  currentDogId = dog._id;

  // Kontrollera att data finns för ras och livslängd
  dogBreed.textContent = dog.name || 'Okänd ras';
  dogLifespan.textContent = dog.life_span || 'Okänd livslängd';
  dogTemperament.textContent = dog.temperament || 'Okänt temperament';

  // Visa bilden
  dogImageElement.src = dog.image || 'https://via.placeholder.com/150?text=No+Image'; 
  dogImageElement.alt = dog.name || 'Ingen bild tillgänglig';

  selectedDogSection.classList.remove('hidden');
  dogsList.classList.add('hidden'); // Döljer listan när en hund är vald
}

// Setup för formuläret "Lägg till hund"
function setupAddDogForm() {
  const addDogForm = document.getElementById('add-dog-form');
  addDogForm.addEventListener('submit', event => {
    event.preventDefault();

    const newDog = {
      name: document.getElementById('new-dog-name').value,
      temperament: document.getElementById('new-dog-temperament').value,
      life_span: document.getElementById('new-dog-lifespan').value,
      image: document.getElementById('new-dog-image').value
    };

    // Skicka ny hund till backend
    fetch('http://localhost:3000/api/dogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDog),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Kunde inte lägga till hund');
        }
        return response.json();
      })
      .then(addedDog => {
        console.log('Hund tillagd:', addedDog);
        fetchDogs();
        addDogForm.reset(); 
      })
      .catch(error => console.error('Fel vid tillägg av hund:', error));
  });
}

// Setup för "Edit"-knappen
function setupEditButton() {
  const editButton = document.getElementById('edit-dog');
  
  editButton.addEventListener('click', () => {
    const dogBreed = document.getElementById('dog-breed');
    const dogTemperament = document.getElementById('dog-temperament');
    const dogLifespan = document.getElementById('dog-lifespan');
    
    if (editButton.textContent === 'Edit') {
      dogBreed.innerHTML = `<input type="text" id="edit-breed" value="${dogBreed.textContent}">`;
      dogTemperament.innerHTML = `<input type="text" id="edit-temperament" value="${dogTemperament.textContent}">`;
      dogLifespan.innerHTML = `<input type="text" id="edit-lifespan" value="${dogLifespan.textContent}">`;

      editButton.textContent = 'Save';
    } else {
      const updatedBreed = document.getElementById('edit-breed').value;
      const updatedTemperament = document.getElementById('edit-temperament').value;
      const updatedLifespan = document.getElementById('edit-lifespan').value;

      dogBreed.textContent = updatedBreed;
      dogTemperament.textContent = updatedTemperament;
      dogLifespan.textContent = updatedLifespan;

      saveUpdatedDog(currentDogId, updatedBreed, updatedTemperament, updatedLifespan);
      editButton.textContent = 'Edit';
    }
  });
}

// Funktion för att skicka PUT-begäran
function saveUpdatedDog(id, breed, temperament, lifespan) {
  const updatedDogData = {
    name: breed,
    temperament: temperament,
    life_span: lifespan
  };

  fetch(`/api/dogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedDogData)
  })
  .then(response => response.json())
  .then(updatedDog => {
    console.log('Hund uppdaterad:', updatedDog);
  })
  .catch(error => {
    console.error('Fel vid uppdatering:', error);
  });
}

// Setup för "Delete"-knappen
function setupDeleteButton() {
  const deleteButton = document.getElementById('delete-dog');
  
  deleteButton.addEventListener('click', () => {
    if (!currentDogId) {
      console.error('Ingen hund vald för borttagning');
      return;
    }
    
    const confirmDelete = confirm('Är du säker på att du vill ta bort denna hundras?');
    if (!confirmDelete) return;

    fetch(`/api/dogs/${currentDogId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Hund borttagen:', data);
        alert('Hundras borttagen!');
        fetchDogs();
      })
      .catch(error => console.error('Fel vid borttagning av hundras:', error));
  });
}