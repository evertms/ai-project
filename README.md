# School Supply Recognition AI

This project is an educational tool designed to help children aged 6-12 learn basic English vocabulary by recognizing school supplies through artificial intelligence. The application uses a machine learning model trained with Teachable Machine to identify 10 common school items (e.g., pencil, book, backpack) from images captured via webcam or uploaded files. Once an object is recognized, the app provides its English name along with an example sentence to reinforce contextual learning.

The goal of this project is to make English language learning more engaging and interactive by associating words with real-world objects. It is built using Node.js for the backend and Vanilla JS + HTML/CSS for the frontend, ensuring simplicity and compatibility. This version serves as a foundation for future enhancements, including mobile optimization and expanded functionality.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

---

## Installation

To set up the project, follow these steps:

1. **Clone the repository**:
   ```bash
   github.com/evertms/ai-project-tmachine.git
   cd ai-project-tmachine
   ```

2. **Install dependencies**:
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```

---

## Usage

### Running the Project

To start the server, run the following command in the root directory of the project:
```bash
node server.js
```

Once the server is running, open your browser and navigate to:
```
http://localhost:3000
```

---

## Notes

- Ensure you have Node.js installed on your system before running the project. You can download it from [here](https://nodejs.org/).
- The `node_modules` folder is ignored in this repository via `.gitignore`. Always run `npm install` after cloning the repository to install dependencies locally.
