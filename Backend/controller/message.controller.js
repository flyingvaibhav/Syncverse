import { getReceiverSocketId, io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected. Please try again." });
    }

    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.userId; // set by secureRoute
    
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).maxTimeMS(5000);
    
    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }
    
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    
    // await conversation.save()
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]); // run parallel
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ error: "Database connection error. Please try again." });
    }
    
    if (error.name === 'MongoError' && error.code === 50) {
      return res.status(503).json({ error: "Database operation timed out. Please try again." });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Database not connected. Please try again." });
    }

    const { id: chatUser } = req.params;
    const senderId = req.userId; // set by secureRoute
    
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages").maxTimeMS(5000);
    
    if (!conversation) {
      return res.status(200).json([]);
    }
    
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessage:", error);
    
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ error: "Database connection error. Please try again." });
    }
    
    if (error.name === 'MongoError' && error.code === 50) {
      return res.status(503).json({ error: "Database operation timed out. Please try again." });
    }
    
    res.status(500).json({ error: "Internal server error" });
  }
};