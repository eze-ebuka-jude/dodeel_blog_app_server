import { Schema, model } from "mongoose";

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        slug: { type: String, required: true },
        introText: { type: String, required: true},
        supportText: { type: String, required: true},
        italicText: { type: String, required: true},
        summaryText: { type: String, required: true},
        mainPhoto: { type: String, required: true },
        supportPhoto: { type: String, required: true},
        category: { type: String, required: true },
        date: { type: Date, default: Date.now },
        likes: { type: Number, default: 0 }
    },
    { timestamps: true }
)

const Post = model("Post", PostSchema)
export default Post;