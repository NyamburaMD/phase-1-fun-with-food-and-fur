// Fetch all animal data from the localhost API
async function fetchAnimalData() {
    const response = await fetch('http://localhost:3000/animals');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data); // data in the console
    return data;
}

// Fetch a specific animal by ID
async function fetchAnimalById(id) {
    const response = await fetch(`http://localhost:3000/animals/${id}`);

    // Check if response is OK
    if (!response.ok) {
        console.error(`Error fetching animal with ID ${id}: ${response.status} ${response.statusText}`);
        throw new Error(`Animal not found: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

// Fetch the first three animals
async function fetchFirstThreeAnimals() {
    const response = await fetch('http://localhost:3000/animals?_limit=3');
    const data = await response.json();
    return data;
}

// Handle the form submission event
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quiz-form');
    form.addEventListener('submit', handleSubmit);

    // Initialize animal list with delete buttons
    displayAnimals();

    // Handle the add animal form submission
    const addAnimalForm = document.getElementById('add-animal-form');
    addAnimalForm.addEventListener('submit', handleAddAnimal);
});

async function handleSubmit(event) {
    event.preventDefault(); // Prevent normal form submission

    // Capture user input
    const food = document.getElementById('food').value;
    const color = document.getElementById('color').value;
    const drink = document.getElementById('drink').value;
    const tvShow = document.getElementById('tv-show').value;
    const timeOfDay = document.getElementById('time-of-day').value;
    const pastime = document.getElementById('pastime').value;

    // Fetch all animal data from localhost API
    const animalData = await fetchAnimalData();

    // Determine the result based on user input and the animal data
    const result = determineAnimal(animalData, { food, color, drink, tvShow, timeOfDay, pastime });

    // Display the result text first
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Looks like you're a ${result}!`;

    // Fetch and display an animal image based on the result
    await fetchAnimalImage(result);
}

// Determine animal based on user input and fetched animal data
function determineAnimal(animalData, inputs) {
    // Custom logic for determining the animal
    if (inputs.food === 'pizza' && inputs.color === 'blue') {
        return 'Penguin';  
    }
    // Randomly pick an animal from the API data
    return animalData[Math.floor(Math.random() * animalData.length)].name;
}

// Fetch a related animal image
const animalImages = {
    Penguin: "https://www.cabq.gov/artsculture/biopark/news/10-cool-facts-about-penguins/@@images/1a36b305-412d-405e-a38b-0947ce6709ba.jpeg",
    Koala: "https://animalfactguide.com/wp-content/uploads/2022/03/koala_iStock-140396797-scaled.jpg",
    Dog: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?fm=jpg&q=60&w=3000",
};
async function fetchAnimalImage(animal) {
    const imageUrl = animalImages[animal] || 'https://via.placeholder.com/300'; // Fallback to a placeholder if the animal is not found
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML += `<br><img src="${imageUrl}" alt="${animal}" style="max-width: 300px; height: auto;">`;
}

// Display animals with delete buttons
async function displayAnimals() {
    const animals = await fetchAnimalData();
    const animalListDiv = document.getElementById('animal-list');
    animalListDiv.innerHTML = ''; // Clear any existing content

    animals.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.innerHTML = `
            <p>${animal.name} (${animal.type})</p>
            <button data-id="${animal.id}" class="delete-button">Delete</button>
        `;
        animalListDiv.appendChild(animalDiv);
    });

    // Add event listeners to all delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteAnimal);
    });
}

// Handle deleting an animal
async function handleDeleteAnimal(event) {
    const animalId = event.target.getAttribute('data-id');

    try {
        const response = await fetch(`http://localhost:3000/animals/${animalId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete animal with ID ${animalId}`);
        }

        console.log(`Animal with ID ${animalId} deleted`);
        alert('Animal deleted successfully!');

        // Update the animal list
        displayAnimals();
    } catch (error) {
        console.error(error);
        alert('Error deleting the animal. Please try again.');
    }
}

// Handle adding a new animal
async function handleAddAnimal(event) {
    event.preventDefault(); // Prevent normal form submission

    // Capture user input
    const name = document.getElementById('new-animal-name').value;
    const type = document.getElementById('new-animal-type').value;

    // Create a new animal object
    const newAnimal = { name, type };

    // Send a POST request to add the new animal
    try {
        const response = await fetch('http://localhost:3000/animals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAnimal)
        });

        if (!response.ok) {
            throw new Error('Failed to add new animal');
        }

        const data = await response.json();
        console.log('Animal added:', data);

        alert(`${data.name} added successfully!`);

        // Clear the form
        document.getElementById('add-animal-form').reset();

        // Update the animal list
        displayAnimals();
    } catch (error) {
        console.error(error);
        alert('Error adding the animal. Please try again.');
    }
}
