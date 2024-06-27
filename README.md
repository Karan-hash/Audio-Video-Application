# Audio and Video Upload Application

This application allows users to upload audio and video files, store them on AWS S3, and manage file metadata using MongoDB.

## Backend Setup

### Prerequisites

- Node.js installed (version 16 or higher)
- npm or yarn package manager
- MongoDB database
- AWS S3 account with credentials (Access Key ID, Secret Access Key)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd backend
2. **Install dependencies:**
    using command 
    ```bash
    npm install
3. **Configuration:**
   - 3.1 Create a .env file in the backend directory: touch .env
   - 3.2 Add the following environment variables to .env:
   - PORT=5000
   - MONGODB_URL=mongodb_connection_string
   - AWS_ACCESS_KEY=aws_access_key
   - AWS_SECRET_KEY=aws_secret_key
   - AWS_BUCKET_NAME=aws_bucket_name

4. **Running the server using command:**
    node server.js or nodemon server.js


## Frontend Setup

### Prerequisites

- Node.js installed (version 16 or higher)
- Axios installed
1. **Install dependencies:**
    using command 
    ```bash
    npm install
    npm install axios
2. **Running the server using command:**
    npm start