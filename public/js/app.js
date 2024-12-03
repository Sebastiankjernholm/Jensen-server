let currentDogId = null; 

document.addEventListener('DOMContentLoaded', () => {
  console.log('Hemsidan är redo!');
  fetchDogs();
  setupAddDogForm();
  setupDogListToggle();
  setupEditButton();
});

// Hämta hundraser från backend API
function fetchDogs() {
  fetch('/api/dogs')
    .then(response => {
      if (!response.ok) {
        throw new Error('Något gick fel vid hämtning av hundraser');
      }
      return response.json();
    })
    .then(data => 
      displayDogs(data))
    
    .catch(error => console.error('Fel vid hämtning av hundraser:', error));
}

// Visa hundraserna på sidan
function displayDogs(dogs) {
  const dogsList = document.getElementById('dogs');
  dogsList.innerHTML = '';

  dogs.forEach(dog => {
    const li = document.createElement('li');
    li.textContent = dog.name;
    li.addEventListener('click', () => selectDog(dog));
  });
}

function selectDog(dog) {
  const selectedDogSection = document.getElementById('selected-dog');
  const dogBreed = document.getElementById('dog-breed'); // Här visas rasen
  const dogImageElement = document.getElementById('dog-image'); // Bild-elementet
  const dogTemperament = document.getElementById('dog-temperament');
  const dogLifespan = document.getElementById('dog-lifespan');
  const dogsList = document.getElementById('dogs'); // Listan på hundarna

  currentDogId = dog._id;

  // Kontrollera att data finns för ras och livslängd
  if (dog.name) {
    dogBreed.textContent = dog.name;
  } else {
    dogBreed.textContent = 'Okänd ras'; 
  }

  if (dog.life_span) {
    dogLifespan.textContent = dog.life_span;
  } else {
    dogLifespan.textContent = 'Okänd livslängd';
  }

  dogTemperament.textContent = dog.temperament || 'Okänt temperament';

    // Visa bilden
    if (dog.image) {
      dogImageElement.src = dog.image; 
      dogImageElement.alt = dog.name;
    } else {
      dogImageElement.src = 'https://via.placeholder.com/150?text=No+Image'; 
      dogImageElement.alt = 'Ingen bild tillgänglig';
    }
  
   
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

// Funktion för att toggla hundraslistan
function setupDogListToggle() {
  const toggleButton = document.getElementById('toggle-dog-list');
  const dogsList = document.getElementById('dogs');

  toggleButton.addEventListener('click', () => {
    dogsList.classList.toggle('hidden');
  });
}

// Setup för "Edit"-knappen
function setupEditButton() {
  const editButton = document.getElementById('edit-dog');
  
  editButton.addEventListener('click', () => {
    const dogBreed = document.getElementById('dog-breed');
    const dogTemperament = document.getElementById('dog-temperament');
    const dogLifespan = document.getElementById('dog-lifespan');
    
    // Om knappen har texten "Edit" så gör fälten redigerbara
    if (editButton.textContent === 'Edit') {
      // Skapa inputfält för varje värde
      dogBreed.innerHTML = `<input type="text" id="edit-breed" value="${dogBreed.textContent}">`;
      dogTemperament.innerHTML = `<input type="text" id="edit-temperament" value="${dogTemperament.textContent}">`;
      dogLifespan.innerHTML = `<input type="text" id="edit-lifespan" value="${dogLifespan.textContent}">`;

      // Ändra text på knappen till "Save"
      editButton.textContent = 'Save';
    } else {
      // När knappen är i "Save"-läge, spara ändringarna
      const updatedBreed = document.getElementById('edit-breed').value;
      const updatedTemperament = document.getElementById('edit-temperament').value;
      const updatedLifespan = document.getElementById('edit-lifespan').value;

      // Uppdatera texten på fälten med de nya värdena
      dogBreed.textContent = updatedBreed;
      dogTemperament.textContent = updatedTemperament;
      dogLifespan.textContent = updatedLifespan;


      // Skicka PUT-begäran med id och de nya värdena
      saveUpdatedDog(currentDogId, updatedBreed, updatedTemperament, updatedLifespan);

      // Byt tillbaka knappen till "Edit"
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

  console.log('Skickar PUT-förfrågan med data:', updatedDogData);

  fetch(`/api/dogs/${id}`, { 
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedDogData)
  })
  .then(response => {
    if (!response.ok) {
      // Om svaret inte är okej, logga felmeddelande
      console.error('Fel vid PUT-förfrågan:', response);
      return Promise.reject('Det gick inte att uppdatera hunden');
    }
    return response.json();
  })
  .then(updatedDog => {
    console.log('Hund uppdaterad:', updatedDog);
    // Uppdatera UI:t här om nödvändigt
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
    
    // Bekräftelse från användaren
    const confirmDelete = confirm('Är du säker på att du vill ta bort denna hundras?');
    if (!confirmDelete) return;

    // Skicka DELETE-förfrågan till backend
    fetch(`/api/dogs/${currentDogId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Kunde inte ta bort hundras');
        }
        return response.json();
      })
      .then(data => {
        console.log('Hund borttagen:', data);
        alert('Hundras borttagen!');
        fetchDogs();
      })
      .catch(error => console.error('Fel vid borttagning av hundras:', error));
  });
}

// Lägg till eventlistener för Delete-knappen
document.addEventListener('DOMContentLoaded', () => {
  setupDeleteButton();
});