const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const ip = require("ip");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins (for development)
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const uploadDir = path.join(__dirname, "uploads");
const serverIP = ip.address();  
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/uploads", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Unable to fetch files" });
        res.json(files.map(file => ({
            fileName: file,
            fileUrl: `http://${serverIP}:3000/uploads/${file}` 
        })));
    });
});

app.post("/upload", (req, res) => {
    const fileType = req.headers["content-type"];
    const ext = getExtension(fileType);

    if (!ext) {
        return res.status(400).json({ error: "Unsupported file type" });
    }

    const fileName = `${Date.now()}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const writeStream = fs.createWriteStream(filePath);

    req.pipe(writeStream);

    req.on("end", () => {
        const fileUrl = `http://${serverIP}:3000/uploads/${fileName}`;
        io.emit("newFile", { fileName, fileUrl });
        res.json({ fileName, fileUrl });
    });

    req.on("error", (err) => {
        console.error("Upload failed:", err);
        res.status(500).json({ error: "Upload failed" });
    });
});

app.get("/api/download/:fileName", (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(uploadDir, fileName);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: "File not found" });
        }
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ error: "Error sending file" });
            }
        });
    });
});

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

function getExtension(mimeType) {
    const mimeTypes = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "application/pdf": "pdf",
        "text/plain": "txt"
    };
    return mimeTypes[mimeType] || null;
}

const PORT = 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://${serverIP}:${PORT}`);
});
