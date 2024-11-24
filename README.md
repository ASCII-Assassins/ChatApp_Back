# Chat-Service

Chat-Service is a backend chat application developed using the NestJS framework, designed to support real-time communication via WebSockets, enabling private and group chats. The project implements a robust and scalable architecture using Docker, MongoDB, and RabbitMQ for microservices-based communication. This documentation outlines the setup, features, and technical stack of the application.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Docker Setup](#docker-setup)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Links](#links)

## Project Overview

The Chat-Service provides the backend infrastructure for a real-time chat platform. It includes features such as:

- **User Authentication:** Secure registration and login using bcrypt.
- **Real-time Messaging:** WebSocket integration for instant communication.
- **Group and Private Chats:** Support for both direct and group communication.
- **Message Persistence:** MongoDB is used for storing chat history.
- **Scalable Design:** Built with microservices and RabbitMQ for message brokering.

The project follows a modular architecture, leveraging the power of NestJS for scalability and maintainability.

## Features

### Authentication
- User registration and login with password encryption (bcrypt).
- JWT-based authentication.

### Messaging
- Real-time messaging with WebSocket and `@nestjs/platform-socket.io`.
- Support for private and group messages.
- Delivery and read receipts.

### Group Chat
- Create, manage, and participate in group chats.
- Role-based permissions within groups.

### Notifications
- Real-time notifications for new messages and group activity.

### Admin Features
- Manage user accounts.
- Monitor group activity.

## Tech Stack

### Backend
- **Framework:** NestJS
- **Database:** MongoDB
- **Message Broker:** RabbitMQ
- **Authentication:** bcrypt, JWT
- **Real-time Communication:** WebSocket, Socket.IO

### Tools
- **Containerization:** Docker
- **Testing:** Jest, Supertest

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v18 or above)
- Docker
- MongoDB
- RabbitMQ

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ASCII-Assassins/ChatApp_Back.git
   cd ChatApp_Back
Install the required dependencies:

2. Install the required dependencies
npm install

3.Create a .env file in the root directory with the following environment variables:

PORT=3000
DATABASE_URL=Your MongoDB URI
JWT_SECRET=Your JWT Token Secret
RABBITMQ_URI=Your RabbitMQ URI

4.Run the application in development mode:
npm run start:dev


#Docker Setup
1.Build and run the application using Docker:

docker compose up --build -d

2.Access it at http://localhost:3000.

##Scripts
1.Start Development Server:

npm run start:dev

2.Run Unit Tests:

npm run test

##Architecture
The project utilizes a robust and scalable architecture:

Modular Structure: Features like authentication, chat, and group management are isolated in modules.
WebSocket Integration: Enables real-time bi-directional communication.
MongoDB: Stores user data, chat messages, and group schemas.
RabbitMQ: for Services.
The modular design ensures scalability, while the (RabbitMQ) enables decoupling of services for handling complex workflows.

##Links
Backend Repository: https://github.com/ASCII-Assassins/ChatApp_Back.git
Frontend Repository: https://github.com/ASCII-Assassins/ChatApp_Front.git
API Gateway: https://github.com/ASCII-Assassins/API-GATEWAY.git
Auth Service: https://github.com/ASCII-Assassins/AUTH-SERVICE.git
Feel free to contribute or raise issues to improve the project.