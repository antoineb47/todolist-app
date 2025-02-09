# Modern Todo List Application

A feature-rich todo list application with user authentication, built using HTML, CSS, and JavaScript.

## Features

- User Authentication (Register/Login)
- Create, Read, Update, and Delete todos
- Mark todos as complete/incomplete
- Add due dates to todos
- Categorize todos
- Search functionality
- Filter todos by status (All/Active/Completed)
- Responsive modern design
- Data persistence using JSON file

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/antoineb47/todolist-app.git
```

2. Set up a local PHP server:
```bash
php -S localhost:8000
```

3. Open the application in your browser:
```
http://localhost:8000
```

## Usage

1. Register a new account or login with existing credentials
2. Add new todos using the input field at the top
3. Add optional due dates and categories to your todos
4. Use the search bar to find specific todos
5. Filter todos using the All/Active/Completed buttons
6. Click the checkbox to mark a todo as complete
7. Click the delete button to remove a todo

## Technical Details

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: PHP (for data persistence)
- Data Storage: JSON file
- Authentication: Local JSON-based user management

## Security Note

This is a demo application using basic JSON file storage. For production use, consider:
- Using a proper database
- Implementing secure password hashing
- Adding input validation
- Using HTTPS
- Implementing proper session management

## License

MIT License - feel free to use this project for learning purposes.
