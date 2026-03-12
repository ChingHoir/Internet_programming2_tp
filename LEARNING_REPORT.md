# Full-Stack Todo Application - Learning Report

**Project:** NestJS + Vue.js Todo Application  
**Date:** March 12, 2026  
**Technologies:** NestJS, Vue 3, Pinia, TypeScript, Axios

---

## 1. Backend Architecture (NestJS)

### 1.1 Project Structure
The NestJS backend follows a modular architecture:
```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
└── modules/
    ├── task/              # Task feature module
    │   ├── task.controller.ts
    │   ├── task.service.ts
    │   ├── task.entity.ts
    │   ├── task.module.ts
    │   └── dto/
    └── user/              # User feature module
```

**Key Learning:** NestJS organizes code by features/modules, making it scalable and maintainable.

### 1.2 Dependency Injection
```typescript
@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}
}
```

**What I Learned:**
- NestJS uses decorators (`@Controller`, `@Injectable`) for dependency injection
- Services are injected into controllers through the constructor
- This promotes loose coupling and easier testing

### 1.3 RESTful API Design

#### HTTP Methods & Routes
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/tasks` | Fetch all tasks |
| GET | `/tasks/:id` | Fetch single task |
| POST | `/tasks` | Create new task |
| PATCH | `/tasks/:id/done` | Mark as completed |
| PATCH | `/tasks/:id/pending` | Mark as pending |
| DELETE | `/tasks/:id` | Delete task |

**Key Learning:** 
- REST follows standard conventions (GET for read, POST for create, PATCH for update, DELETE for remove)
- Route parameters use `:id` syntax
- Controllers handle routing, services handle business logic

### 1.4 Decorators in NestJS

```typescript
@Get('/')           // HTTP GET method
@Post('/')          // HTTP POST method
@Patch('/:id')      // HTTP PATCH with parameter
@Delete('/:id')     // HTTP DELETE with parameter
@Param('id')        // Extract route parameter
@Body()             // Extract request body
```

**What I Learned:** Decorators provide metadata that NestJS uses to configure routes and handle requests.

### 1.5 CORS Configuration

```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
```

**Key Learning:**
- CORS (Cross-Origin Resource Sharing) must be enabled for frontend-backend communication
- Without CORS, browsers block requests from different origins
- Important to specify allowed origins and methods

### 1.6 Validation Pipes

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);
```

**What I Learned:**
- `whitelist: true` removes properties not in the DTO
- `transform: true` automatically transforms payloads to DTO instances
- Validation pipes help ensure data integrity

---

## 2. Frontend Architecture (Vue 3)

### 2.1 Project Structure
```
src/
├── main.js              # App entry point
├── App.vue             # Root component
├── components/         # Reusable components
│   ├── TodoList.vue
│   ├── TodoItem.vue
│   └── AddTodo.vue
└── stores/             # State management
    └── todo.js         # Pinia store
```

**Key Learning:** Vue applications are component-based with centralized state management.

### 2.2 Pinia State Management

#### Store Structure
```javascript
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: []
  }),
  
  getters: {
    countTodos: (state) => state.todos.length,
    completedTodos: (state) => state.todos.filter(todo => todo.completedAt != null),
    pendingTodos: (state) => state.todos.filter(todo => todo.completedAt == null)
  },
  
  actions: {
    async fetchTodos() { ... },
    async addTodo(name, description) { ... },
    async toggleStatus(id) { ... }
  }
});
```

**What I Learned:**
- **State:** Centralized reactive data storage
- **Getters:** Computed properties derived from state (like filters, counts)
- **Actions:** Methods that can modify state and make async calls
- Pinia is the official state management for Vue 3 (replaces Vuex)

### 2.3 Component Communication

#### Using the Store in Components
```javascript
import { useTodoStore } from "../stores/todo";

export default {
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },
  
  async mounted() {
    await this.todoStore.fetchTodos();
  }
}
```

**Key Learning:**
- `setup()` is the Composition API entry point
- Store must be returned from setup to be accessible in template
- `mounted()` lifecycle hook runs after component is added to DOM

### 2.4 Props and Events

```vue
<!-- Parent passes data via props -->
<TodoItem :todo="todo" icon="uil-adobe-alt" />

<!-- Child emits events -->
<script>
export default {
  props: ["todo", "icon"],
  methods: {
    addTodo(e) {
      this.$emit("added", e.target.value);
    }
  }
}
</script>
```

**What I Learned:**
- **Props:** Pass data down from parent to child (one-way data flow)
- **Events:** Children communicate back to parents via `$emit`
- This maintains clear component boundaries

---

## 3. HTTP Communication with Axios

### 3.1 Making API Requests

```javascript
// GET request
const response = await axios.get('http://localhost:3100/tasks');
this.todos = response.data;

// POST request
const response = await axios.post('http://localhost:3100/tasks', {
  name,
  description
});

// PATCH request
const response = await axios.patch(`http://localhost:3100/tasks/${id}`, updates);

// DELETE request
await axios.delete(`http://localhost:3100/tasks/${id}`);
```

**What I Learned:**
- Axios is a promise-based HTTP client
- Use async/await for cleaner asynchronous code
- Always wrap in try/catch for error handling
- Response data is in `response.data`

### 3.2 Error Handling

```javascript
try {
  const response = await axios.get('http://localhost:3100/tasks');
  this.todos = response.data;
} catch (error) {
  console.error('Failed to fetch todos:', error);
}
```

**Key Learning:** Always handle errors gracefully to prevent app crashes and provide user feedback.

---

## 4. Common Issues & Solutions

### Issue 1: CORS Errors
**Problem:** Browser blocked requests from frontend to backend  
**Solution:** Enable CORS in NestJS with `app.enableCors()`

### Issue 2: Module Export Error
**Problem:** `The requested module does not provide an export named 'useTodoStore'`  
**Solution:** Changed from plain object to Pinia store using `defineStore`

### Issue 3: API Endpoint Mismatch
**Problem:** Frontend called `/task` but backend used `/tasks`  
**Solution:** Consistent naming - use plural `/tasks` everywhere

### Issue 4: Missing GET All Endpoint
**Problem:** Frontend needed to fetch all tasks but endpoint didn't exist  
**Solution:** Added `@Get('/')` method in controller

---

## 5. Best Practices Learned

### Backend (NestJS)
1. ✅ **Separation of Concerns:** Controllers handle routes, services handle logic
2. ✅ **Use DTOs:** Data Transfer Objects for type safety and validation
3. ✅ **Enable CORS:** Required for cross-origin requests
4. ✅ **Validation Pipes:** Validate and transform incoming data
5. ✅ **Modular Structure:** Organize by features (task module, user module)

### Frontend (Vue)
1. ✅ **Component-Based:** Break UI into reusable components
2. ✅ **State Management:** Use Pinia for shared state
3. ✅ **Error Handling:** Always wrap axios calls in try/catch
4. ✅ **Reactive Data:** Use Vue's reactivity system properly
5. ✅ **Props Down, Events Up:** Clear data flow pattern

### API Design
1. ✅ **RESTful Conventions:** Use standard HTTP methods
2. ✅ **Consistent Naming:** Plural resource names (`/tasks` not `/task`)
3. ✅ **Status Codes:** Return appropriate HTTP status codes
4. ✅ **Error Messages:** Provide meaningful error responses

---

## 6. Technology Stack Summary

### Backend
- **NestJS:** Progressive Node.js framework with TypeScript
- **TypeORM:** ORM for database operations (configured but not fully implemented)
- **Class Validator:** Validation decorators for DTOs
- **Express:** Underlying HTTP server (NestJS default)

### Frontend
- **Vue 3:** Progressive JavaScript framework
- **Pinia:** Official state management library
- **Axios:** HTTP client for API calls
- **Vite:** Fast build tool and dev server

---

## 7. Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           Frontend (Vue + Pinia)                │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ Components   │◄────►│ Pinia Store  │        │
│  │ - TodoList   │      │ - State      │        │
│  │ - TodoItem   │      │ - Actions    │        │
│  │ - AddTodo    │      │ - Getters    │        │
│  └──────────────┘      └──────┬───────┘        │
│                               │                 │
│                        Axios HTTP Requests      │
└───────────────────────────────┼─────────────────┘
                                │
                         CORS Enabled
                                │
┌───────────────────────────────▼─────────────────┐
│          Backend (NestJS)                       │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ Controllers  │◄────►│  Services    │        │
│  │ - Routes     │      │ - Business   │        │
│  │ - HTTP       │      │   Logic      │        │
│  └──────────────┘      └──────┬───────┘        │
│                               │                 │
│                               ▼                 │
│                        ┌──────────────┐         │
│                        │   Database   │         │
│                        │  (TypeORM)   │         │
│                        └──────────────┘         │
└─────────────────────────────────────────────────┘
```

---

## 8. Key Takeaways

1. **Full-Stack Integration:** Understanding how frontend and backend communicate via HTTP/REST APIs

2. **State Management:** Centralized state with Pinia makes data flow predictable and manageable

3. **Type Safety:** TypeScript in NestJS provides compile-time error checking

4. **Modular Design:** Both NestJS and Vue promote modular, reusable code

5. **Async Programming:** Modern async/await syntax makes asynchronous operations cleaner

6. **CORS is Critical:** Must be configured properly for frontend-backend communication

7. **Error Handling:** Always anticipate and handle potential errors gracefully

8. **RESTful Principles:** Following REST conventions makes APIs intuitive and standardized

---

## 9. Next Steps for Learning

1. **Database Integration:** Connect TypeORM to actual database (PostgreSQL, MySQL)
2. **Authentication:** Add JWT-based authentication and authorization
3. **Validation:** Implement proper DTO validation with class-validator
4. **Testing:** Write unit and integration tests
5. **Deployment:** Learn to deploy NestJS and Vue apps to production
6. **Advanced Features:** Pagination, sorting, filtering, search
7. **Error Handling:** Implement proper error interceptors
8. **Environment Variables:** Use .env files for configuration

---

## 10. Resources for Further Learning

### NestJS
- Official Docs: https://docs.nestjs.com
- NestJS Fundamentals Course
- TypeORM Documentation

### Vue 3
- Official Docs: https://vuejs.org
- Pinia Documentation: https://pinia.vuejs.org
- Vue 3 Composition API Guide

### General
- REST API Design Best Practices
- TypeScript Handbook
- Async/Await in JavaScript

---

**Conclusion:** This project demonstrates a modern full-stack web application architecture with clear separation between frontend and backend, proper state management, RESTful API design, and real-world development practices.
