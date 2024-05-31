import Contact from "../models/Contacts.js"

export const sendMessage = async(req, res) => {
    try {
        const { name, email, phoneNumber, subject, message } = req.body

        const contactMessage = new Contact({ name, email, phoneNumber, subject, message })
        const sentMessage = await contactMessage.save()

        res.status(200).json({
            name: sentMessage.name,
            email: sentMessage.email,
            phoneNumber: sentMessage.phoneNumber,
            subject: sentMessage.subject,
            message: sentMessage.message,
        })
    } catch (error) {
        // throw new Error(error.response.data.message)
        next(error)
    }
}

export const getAllMessages = async(req, res, next) => {
    try {
        const { searchKeyword } = req.query

        // let user = await User.findOne({ email })
        
        let where = {}
        if(searchKeyword) {
            // const filteredMsg = Contact.find(user => 
            //     user.email.toLowerCase().includes(searchKeyword.toLowerCase())
            // );
            where.email = { $regex: searchKeyword, $options: "i" }
        }

        let query = Contact.find(where)

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const messages = await query.skip(skip).limit(pageSize).sort({ updatedAt: 'desc' });
        const totalMessages = await Contact.find(where).countDocuments();

        res.status(200).json({
            messages,
            totalMessages,
            totalPages: Math.ceil(totalMessages / pageSize),
            currentPage: page
        })
        
        // let messages = await Contact.find()
        // res.status(200).json(messages)
    } catch (error) {
        next(error)
    }
}