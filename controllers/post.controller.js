import prisma from "../lib/prisma.js";

export const getPosts = async (req,res) =>{
    try{
        const posts = await prisma.post.findMany()
        res.status(200).json({posts})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to get posts"})
    }
}

export const getPost = async (req,res) =>{
    const id=req.params.id
    try{
        const post= await prisma.post.findUnique({
            where:{id}
        })
        res.status(200).json({post})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to get post"})
    }
}

export const addPost = async (req,res) =>{
    const body=req.body;
    const tokenUserId=req.userId;
    try{
            const newPost = await prisma.post.create({
            data: {
                // Spread the fields from the `body` object (e.g., title, content, etc.)
                // This assumes `body` contains the fields that match the columns in the `post` table.
                ...body.postData,
        
                // Explicitly set the `userId` field to associate the post with the authenticated user.
                // `tokenUserId` is extracted from the authenticated user's token (e.g., JWT).
                userId: tokenUserId,
                postDetail:{
                    create:body.postDetail
                }
            }
        });
        res.status(200).json({newPost})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to create post"})
    }
}


export const updatePost = async (req,res) =>{
    try{
        res.status(200).json({ })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to update post"})
    }
}
export const deletePost = async (req,res) =>{
        // Extract the `id` of the post to be deleted from the request parameters
    const id = req.params.id;
    
    // Extract the authenticated user's ID from the request (set earlier in middleware, e.g., from a JWT)
    const tokenUserId = req.userId;
    
    try {
        // Find the post in the database using the provided `id`
        const post = await prisma.post.findUnique({
            where: { id } // `id` is the unique identifier for the post
        });
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // Check if the post exists and if the authenticated user is the owner of the post
        if (post.userId != tokenUserId) {
            // If the user is not the owner, return a 403 Forbidden response
            return res.status(403).json({ message: "Not Authorized to delete the post" });
        }
        
        // Delete the post from the database
        await prisma.post.delete({
            where: { id } // Deletes the post with the specified `id`
        });
        // If the user is authorized, proceed to delete the post (deletion logic should be added here)
        // Currently, this just sends a success response
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"Failed to delete post"})
    }
}