import cloudinary from "../lib/cloudinary.js";
import { getReceiver, io } from "../middleware/socket.js";
import MESSAGE from "../models/message.js";
import USER from "../models/user.js";

export async function getUsersForsidebar(req, res) {
  try {
    const admins = await USER.find({ isAdmin: true })
    res.status(200).json({ success: true, users: admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getallUsersForsidebar(req, res) {
  try {
    const loggedInUserId = req.user._id; //  Comes from authentication middleware

    //  Get all non-admin users, excluding the logged-in user
    const users = await USER.find({
      isAdmin: false,
      _id: { $ne: loggedInUserId },
    }).select("-password"); // optional: exclude password field

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}



export async function getMessages(req, res) {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await MESSAGE.find({
            $or: [
                { senderId: userToChatId, receiverId: myId },
                { senderId: myId, receiverId: userToChatId },
            ],
        })

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
    }
}


export async function sendMessage(req, res) {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        let imageUrl = "";
        if (image) {
            const uploaded = await cloudinary.uploader.upload(image);
            imageUrl = uploaded.secure_url;
        }

        //  Use the model MESSAGE
        const newMessage = new MESSAGE({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        //send a notification to the receiver
        const receiverSocketId = getReceiver(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            console.log("Receiver Socket ID:", receiverSocketId);
        } else {
            console.log("Receiver Socket ID not found");
        }


        res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const deleted = await MESSAGE.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const io = req.app.get("io");
    if (io) {
      io.to(deleted.senderId.toString()).emit("messageDeleted", id);
      io.to(deleted.receiverId.toString()).emit("messageDeleted", id);
    }

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

