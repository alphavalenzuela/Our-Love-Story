// Love Story JS Functionality

document.addEventListener('DOMContentLoaded', function() {
  // Create floating hearts background
  createFloatingHearts();
  
  // Setup message form
  setupMessageForm();
  
  // Setup bucket list form
  setupBucketListForm();
  
  // Load saved messages and bucket list items from localStorage
  loadSavedData();
});

// Create floating hearts in the background
function createFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  const heartCount = 20;
  
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    
    // Randomize size
    const size = Math.random() * 20 + 10; // 10-30px
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    
    // Randomize position
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 100}vh`;
    
    // Randomize animation delay and duration
    const animationDelay = Math.random() * 5;
    const animationDuration = Math.random() * 10 + 10; // 10-20s
    heart.style.animationDelay = `${animationDelay}s`;
    heart.style.animationDuration = `${animationDuration}s`;
    
    // Randomize opacity
    heart.style.opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
    
    // Apply heart shape
    heart.innerHTML = '❤️';
    
    container.appendChild(heart);
  }
  
  // Add CSS for floating hearts
  const style = document.createElement('style');
  style.textContent = `
    .floating-heart {
      position: fixed;
      font-size: 20px;
      color: var(--primary);
      pointer-events: none;
      animation: float linear infinite;
      z-index: -1;
    }
    
    @keyframes float {
      0% {
        transform: translateY(0) rotate(0deg);
      }
      25% {
        transform: translateY(-20vh) rotate(90deg);
      }
      50% {
        transform: translateY(-40vh) rotate(180deg);
      }
      75% {
        transform: translateY(-60vh) rotate(270deg);
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}

// Handle message form submission
function setupMessageForm() {
  const messageInput = document.getElementById('new-message-input');
  const addMessageBtn = document.getElementById('add-message-btn');
  const messagesContainer = document.querySelector('.messages-container');
  
  addMessageBtn.addEventListener('click', function() {
    const messageText = messageInput.value.trim();
    
    if (messageText) {
      // Create new message element
      const newMessage = createMessageElement(messageText);
      
      // Add to DOM before the form
      const newMessageForm = document.querySelector('.new-message');
      messagesContainer.insertBefore(newMessage, newMessageForm);
      
      // Save to localStorage
      saveMessage(messageText);
      
      // Clear input
      messageInput.value = '';
    }
  });
  
  // Allow Enter key to submit
  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessageBtn.click();
    }
  });
}

// Create a new message element
function createMessageElement(text) {
  const messageCard = document.createElement('div');
  messageCard.classList.add('message-card');
  
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  
  const messageText = document.createElement('p');
  messageText.textContent = text;
  
  const messageDate = document.createElement('div');
  messageDate.classList.add('message-date');
  
  // Format current date
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  messageDate.textContent = `- ${dateString}`;
  
  // Assemble the elements
  messageContent.appendChild(messageText);
  messageCard.appendChild(messageContent);
  messageCard.appendChild(messageDate);
  
  return messageCard;
}

// Handle bucket list form submission
function setupBucketListForm() {
  const newItemInput = document.getElementById('new-bucket-input');
  const categorySelect = document.getElementById('bucket-category');
  const addItemBtn = document.getElementById('add-bucket-btn');
  
  addItemBtn.addEventListener('click', function() {
    const itemText = newItemInput.value.trim();
    const category = categorySelect.value;
    
    if (itemText) {
      addBucketListItem(itemText, category);
      
      // Save to localStorage
      saveBucketItem(itemText, category);
      
      // Clear input
      newItemInput.value = '';
    }
  });
  
  // Allow Enter key to submit
  newItemInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItemBtn.click();
    }
  });
  
  // Handle checkbox changes
  document.querySelectorAll('.bucket-list-items input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      saveBucketListState();
    });
  });
}

// Add a new bucket list item to the DOM
function addBucketListItem(text, category) {
  const list = document.getElementById(`${category}-list`);
  const itemId = `${category}-${Date.now()}`;
  
  const listItem = document.createElement('li');
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = itemId;
  checkbox.addEventListener('change', saveBucketListState);
  
  const label = document.createElement('label');
  label.htmlFor = itemId;
  label.textContent = text;
  
  listItem.appendChild(checkbox);
  listItem.appendChild(label);
  list.appendChild(listItem);
}

// Save and load data from localStorage
function saveMessage(text) {
  let messages = JSON.parse(localStorage.getItem('loveMessages') || '[]');
  messages.push({
    text: text,
    date: new Date().toISOString()
  });
  localStorage.setItem('loveMessages', JSON.stringify(messages));
}

function saveBucketItem(text, category) {
  let items = JSON.parse(localStorage.getItem('bucketList') || '{}');
  
  if (!items[category]) {
    items[category] = [];
  }
  
  items[category].push({
    text: text,
    checked: false,
    id: `${category}-${Date.now()}`
  });
  
  localStorage.setItem('bucketList', JSON.stringify(items));
}

function saveBucketListState() {
  let items = JSON.parse(localStorage.getItem('bucketList') || '{}');
  
  // Update checked state for each item
  document.querySelectorAll('.bucket-list-items input[type="checkbox"]').forEach(checkbox => {
    const id = checkbox.id;
    const category = id.split('-')[0];
    
    if (items[category]) {
      const item = items[category].find(item => item.id === id);
      if (item) {
        item.checked = checkbox.checked;
      }
    }
  });
  
  localStorage.setItem('bucketList', JSON.stringify(items));
}

function loadSavedData() {
  // Load messages
  let messages = JSON.parse(localStorage.getItem('loveMessages') || '[]');
  const messagesContainer = document.querySelector('.messages-container');
  const newMessageForm = document.querySelector('.new-message');
  
  // Remove placeholder messages
  document.querySelectorAll('.message-card').forEach(card => card.remove());
  
  // Add saved messages
  messages.forEach(message => {
    const messageElement = createMessageElement(message.text);
    messagesContainer.insertBefore(messageElement, newMessageForm);
  });
  
  // Load bucket list items
  let bucketItems = JSON.parse(localStorage.getItem('bucketList') || '{}');
  
  // Clear default items
  document.querySelectorAll('.bucket-list-items li').forEach(item => item.remove());
  
  // Add saved items
  for (const [category, items] of Object.entries(bucketItems)) {
    items.forEach(item => {
      addBucketListItem(item.text, category);
      
      // Set checked state
      if (item.checked) {
        const checkbox = document.getElementById(item.id);
        if (checkbox) checkbox.checked = true;
      }
    });
  }
}

// Add scroll progress indicator
window.addEventListener('scroll', function() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollProgress = (scrollTop / scrollHeight) * 100;
  
  // Create or update scroll progress bar
  let progressBar = document.getElementById('scroll-progress');
  
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.backgroundColor = 'var(--accent)';
    progressBar.style.zIndex = '1000';
    document.body.appendChild(progressBar);
  }
  
  progressBar.style.width = `${scrollProgress}%`;
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70, // Offset for navigation bar
        behavior: 'smooth'
      });
    }
  });
});