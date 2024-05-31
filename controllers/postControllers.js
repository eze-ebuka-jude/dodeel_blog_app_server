import { uploadPicture } from "../middleware/uploadPicture.js"
import Post from "../models/Posts.js"
import { v4 as uuidv4 } from "uuid"
import { fileRemover } from "../utils/fileRemover.js"

export const createPost = async(req, res, next) => {
    try {
        const { title, author, category, mainPhoto, supportPhoto, date, likes, introText, supportText, italicText, summaryText} = req.body

        let post = await Post.findOne({ title })
        if(post) throw new Error(`The Post with title ${title} already exist!`)

        post = new Post({
            slug: uuidv4(),
            title: title,
            author: author,
            category: category,
            mainPhoto: mainPhoto,
            supportPhoto: supportPhoto,
            date: date,
            likes: likes,
            introText: introText,
            supportText: supportText,
            italicText: italicText,
            summaryText: summaryText
        })

        const createdPost = await post.save()
        console.log(createdPost)
        return res.status(201).json(createdPost)
    } catch (error) {
        next(error)
    }
}

export const updatePost = async(req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })

        if(!post) {
            const error = new Error("Post was not found")
            next(error)
            return
        }

        const { title, author, category, mainPhoto, supportPhoto, date, likes, introText, supportText, italicText, summaryText} = req.body
        post.title = title || post.title
        post.author = author || post.author
        post.category = category || post.category
        post.mainPhoto = mainPhoto || post.mainPhoto
        post.supportPhoto = supportPhoto || post.supportPhoto
        post.date = date || post.date
        post.likes = likes || post.likes
        post.introText = introText || post.introText
        post.supportText = supportText || post.supportText
        post.italicText = italicText || post.italicText
        post.summaryText = summaryText || post.summaryText

        const updatedPost = await post.save()
        return res.status(200).json(updatedPost)
     
    } catch (error) {
      next(error)  
    }
}

export const deletePost = async(req, res, next) => {
    try {
        const post = await Post.findOneAndDelete({ slug: req.params.slug })

        if(!post) {
            const error = new Error("Post was not found")
            return next(error)
        }

        // await Comment.deleteMany({ post: post._id })

        return res.json({ message: "Post is successfully deleted" })
    } catch (error) {
        next(error)
    }
}

export const getPost = async(req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
        // populate([
        //     { path: "user", select: ["avatar", "name"]},
        //     { 
        //         path: "comments", 
        //         match: { check: true, parent: null },
        //         populate: [
        //             { path: "user", select: [ "avatar", "name" ] },     //For the comment not post this time
        //             { 
        //                 path: "replies", 
        //                 match: { check: true },
        //                 populate: [
        //                     { path: "user", select: [ "avatar", "name" ] }
        //                 ]
        //             }
        //         ]
        //     },
        // ])
    
        if(!post) {
            const error = new Error("Post was not found");
            return next(error);
        }

        return res.json(post)
    } catch (error) {
        next(error)
    }
}

export const getAllPost = async(req, res, next) => {
    try {
        const { searchKeyword } = req.query
        
        let where = {}
        if(searchKeyword) where.title = { $regex: searchKeyword, $options: "i" }

        let query = Post.find(where)
        const page = parseInt(req.query.page) || 1
        const pageSize = parseInt(req.query.limit) || 10
        const skip = (page - 1) * pageSize
        const total = await Post.find(where).countDocuments()
        const pages = Math.ceil(total / pageSize)

        if(page > pages) {
            const error = new Error('No page found')
            return next(error)
        }
        
        // const result = await query.skip(skip).limit(pageSize).populate([
        //     { path: "user", select: ["avatar", "name", "verified"]}
        // ]).sort({ updatedAt: "desc" })

        const result = await query.skip(skip).limit(pageSize).sort({ updatedAt: "desc" })

        res.header({
            'x-filter': searchKeyword,
            'x-totalcount': JSON.stringify(total),
            'x-currentpage': JSON.stringify(page),
            'x-pagesize': JSON.stringify(pageSize),
            'x-totalpagecount': JSON.stringify(pages)
        })

        return res.json(result)
    } catch (error) {
        next(error)
    }
}