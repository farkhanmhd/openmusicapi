# OpenMusicAPI

## How to Run the App

Make sure the consumer app is running. To get the OpenMusicAPI up and running, follow these steps:

1. **Install Dependencies**

   First, install all the necessary dependencies by running:

   ```bash
   npm install

   ```

2. Fill your .env file credentials. follow .env.example file and fill it with your credentials.

3. **Migrate Database**

   ```bash
   npm run migrate up
   ```

4. **Build The Project** Next, build the project using:

   ```bash
   npm run build

   ```

5. **Start the Application in Production Mode**
   ```bash
   npm run start:prod
   ```

And that's it! Your OpenMusicAPI should now be running.
