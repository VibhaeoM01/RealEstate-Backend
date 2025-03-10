import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  //db operations
  const {username,email,password}=req.body;
  
  try{
    // HASH THE PASSWORD
  const hashedPassword= await bcrypt.hash(password,10);
  console.log(hashedPassword)


  //CREATE NEW USER AND SAVE TO DB
  const newUser=await prisma.user.create(
    {
      data:{
        username,
        email,
        password:hashedPassword,
      },
    }
  );
  console.log(newUser);
  res.status(201).json({message:"User Created Successfully"});
  }
  catch(err)
  {
    console.log(err)
    res.status(500).json({message:"Failed to create user"});
  }
};



export const login = async (req, res) => {
  //db operations

  const {username, password}=req.body;

 try{
                                            //CHECK IF USER EXISTS
     const user= await prisma.user.findUnique({
      where:{username},
     })
     if(!user)
     {
      return res.status(401).json({message:"Invalid Credentails"});
     }



                                              //CHECK IF PW IS CORRECT
     const ValidPassword= await bcrypt.compare(password,user.password);
     if(!ValidPassword)
     {
      return res.status(401).json({message:"Invalid Credentials"});
     }
 


                                     //NOW GENERATE COOKIE TOKEN AND SENT TO USER


     const age=1000*60*60*24*7; //1 week 
     
    //  jwt.sign(payload, secretKey, options) 
     const token =jwt.sign({id:user.id}, process.env.JWT_SECRET_KEY, {expiresIn:age})
     const  {password:userPassword,...userinfo}=user;

    //  res.cookie("token", token, { options })
     res.cookie("token",token,{httpOnly:true,maxAge:age}).status(200).json({message:"Login Success Man"});     // The token is stored in a cookie with security settings.
                                              // secure:true Use when you will host it  
 




//     How It Works
// The user logs in (probably with an email/password).
// A JWT token is generated containing the user.id.
// The token is stored in a cookie with security settings.
// The server responds with a success message.
// The cookie is automatically sent with every subsequent request, allowing the server to authenticate the user.





}
 catch(err)
 {
  console.log(err)
  res.status(500).json({message:"Failed to login"})
 }

};
export const logout = (req, res) => {
  //db operations
  res.clearCookie("token").status(200).json({message:"Logout Successful"});
};
