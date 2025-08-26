# Troubleshooting Guide

## Database Timeout Issues

If you're experiencing `users.findOne()` buffering timed out after 10000ms errors, follow these steps:

### 1. Check MongoDB Connection

First, test your database connection:
```bash
npm run test-db
```

### 2. Verify MongoDB is Running

Make sure MongoDB is running on your system:
- **Windows**: Check Services or Task Manager
- **macOS/Linux**: `sudo systemctl status mongod` or `brew services list`

### 3. Check Environment Variables

Create a `.env` file in the Backend directory with:
```env
MONGODB_URI=mongodb://localhost:27017/syncverse
PORT=5004
JWT_SECRET=your_secret_here
NODE_ENV=development
```

### 4. Common Connection Strings

**Local MongoDB:**
```
mongodb://localhost:27017/syncverse
```

**MongoDB with Authentication:**
```
mongodb://username:password@localhost:27017/syncverse
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/syncverse
```

### 5. Restart the Server

After making changes:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 6. Check Database Health

Visit these endpoints to monitor your server:
- `http://localhost:5004/health` - Server status
- `http://localhost:5004/db-health` - Database connection status

### 7. If Issues Persist

1. **Clear MongoDB cache**: Restart MongoDB service
2. **Check network**: Ensure no firewall blocking port 27017
3. **Verify database exists**: Connect to MongoDB and check if 'syncverse' database exists
4. **Check logs**: Look for MongoDB connection errors in the console

### 8. Performance Tips

- The server now has improved connection pooling
- Database queries have 5-second timeouts
- Better error handling for connection issues
- Graceful shutdown handling

## Still Having Issues?

If the problem continues:
1. Check the console for specific error messages
2. Verify MongoDB version compatibility
3. Try connecting with MongoDB Compass or mongo shell
4. Check if your MongoDB instance has enough resources
