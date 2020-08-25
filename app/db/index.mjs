import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const dbURI = ""
try {
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.log(error);
}
mongoose.connection.on('error', err => {
    console.log(`MongoDB error: ${err}`);
});
mongoose.set('useCreateIndex', true);


const userSchema = new mongoose.Schema({
    userName: String,
    ip: String,
    conversations: [{
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    }]
});

export const User = mongoose.model('User', userSchema, 'chatusers');

//Conversation
const conversationSchema = new mongoose.Schema({
    content: String,
    dateCreated: Date,
    member: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }

})

conversationSchema.pre('save', async function () {
    try {
        const user = await User.findById(this.member).exec();
        const room = await Room.findById(this.room).exec();
        if (user){
            user.conversations.push(this._id);
            await user.save();
         
        }
        if (room) {
            room.conversations.push(this._id);
            await room.save();
        }
    } catch (err) {
        console.log(err);
    }

});

export const Conversation = mongoose.model('Conversation', conversationSchema, 'chatConversations');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    dateCreated: Date,
    conversations: [{
        type: Schema.Types.ObjectId,
        ref: 'Conversation'
    }]
})
export const Room = mongoose.model('Room', roomSchema, 'chatRooms');


export default mongoose;
