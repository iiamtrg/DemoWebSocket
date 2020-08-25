import { User, Room, Conversation } from "../db/index.mjs";

// User

export const findUserLocalByUserName = async (username)=>{
  try{
    return await User.findOne({"userName": username}).exec();
  } catch(err){
    console.log("Mongoo Error: " + err);
    return null;
  } 
}

export const createNewUserLocal = (data) => {
  try {
    let newUser = new User();
    newUser.userName = data.username;
    newUser.ip = data.ip
    return newUser.save();
  } catch(err){
    console.log("Mongoo Error: " + err);
    return null;
  }
}; 

// Room
export const getAllRooms = async () => {
  try {
    const rooms = await Room.find({})
      .populate({
        path: "conversations",
        populate: {
          path: "member",
        },
        opitons: {
          sort: {dateCreated: "desc"},
        },
        perDocumentLimit: 1,
      })
      .sort({dateCreated: "desc"})
    return rooms;
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};
export const searchRoomByName = async (name) => {
  try {
    const rooms = await Room.find({ name: { $regex: name, $options: "i" } })
      .populate({
        path: "conversations",
        populate: {
          path: "member",
        },
        opitons: {
          sort: { dateCreated: "desc" },
        },
        perDocumentLimit: 1,
      })
      .sort({ dateCreated: "desc" });
    return rooms;
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};

export const createNewRoom = async (name) => {
  try {
    let newRoom = new Room();
    newRoom.name = name;
    newRoom.dateCreated = new Date();
    newRoom.conversations = [];
    return await newRoom.save();
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return null;
  }
};

export const getConversationsByRoomId = async (roomID) => {
  try {
    return await Conversation.find({ room: roomID })
      .populate("member")
      .sort({ dateCreated: "asc" });
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};

export const findConversationLatest = async () => {
  try {
    const conv = await Conversation.find({})
      .sort({ dateCreated: "desc" })
      .limit(1);
    return conv;
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return [];
  }
};

export const createNewConversation = async (data) => {
  try {
    let newConv = new Conversation();
    newConv.content = data.mess;
    newConv.dateCreated = new Date();
    newConv.room = data.roomId;
    newConv.member = data.userId;
    return await newConv.save();
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return null;
  }
};

export const findUserByID = async (id) => {
  try {
    return await User.findById(id).exec();
  } catch (err) {
    console.log("Mongoo Error: " + err);
    return null;
  }
};

export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect("/login")
  }
}

export const isUnauthenticated = (req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    res.redirect("/chat")
  }
}
