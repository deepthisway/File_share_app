# Class Challenge: Server-Client File Sharing App

## Challenge Overview
Create an application with both a server interface and a client interface. The goal is to upload files to the server using the Server Interface, which should then be visible on another PC with the Client Interface open. The Client should also be able to download any file stored on the server.

***Note***: This application is built using vanilla JavaScript, without the use of libraries like Multer.
Update the IP address in index.html with the current IP Address shown in the terminal of IDE 

## Usage Instructions

1. **Run the Server:**
   - Start the application on one PC to act as the server.

2. **Access the Client:**
   - On another PC, open the client interface using the IP address provided after launching the server. 
   - Example URL: `http://{server_IP}:5000/uploads.html`

3. **Upload Files:**
   - Use the Server Interface on the server PC to upload files.

4. **Download Files:**
   - The uploaded files should be visible on the client PC.
   - The client can download any of the files stored on the server.

## Additional Information
- Ensure both PCs are on the same network to facilitate communication between the server and client.
- The server provides the IP address needed to access the client interface upon startup.
- This setup is ideal for environments where simple file sharing is needed without complex configurations.

