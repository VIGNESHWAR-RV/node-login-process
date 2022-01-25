import express, { response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { getAllUsers,genPassword ,validatePassword,validateemail,getuserbyemail,adduser,
            getAllRequests,addRequest,getrequestbyemail,getrequestbytoken, updateuser} from "../helper.js";
import { sendResetLink } from "../sendEmail.js";
import { auth } from "../middleware/auth.js";


const router = express.Router();


router.get("/",async(request,response)=>{
    let result = await getAllUsers();
    response.send(result);
})

router.get("/requests",async(request,response)=>{
    const result =await getAllRequests();
    response.send(result);
})


router.post("/signup", async (request, response) => {
    let newuser = request.body;
    // console.log("validate email" ,validateemail(newuser.username))
    // console.log("email check",await getuserbyemail(newuser.username))


    //check if username is in email format
    if(validateemail(newuser.username)){
         //check if user already exists with emailid
        if(await getuserbyemail(newuser.username) !==null){
            response.status(404).send({message:"User with email already exist"})
        }else{
            if(validatePassword(newuser.password)){
                newuser.password = await genPassword(newuser.password) //hashing password
                console.log(newuser)
                let result = await adduser(newuser) //adding new user
                response.status(200).send(result);
            }else{
                response.status(404).send({message:"Password validation failed"})
            }
        }
    }else{
        response.status(404).send({message:"Enter a valid email id"})
    }
   
    // console.log(newuser.password,genPassword(newuser.password));
    
    
});


router.post("/login", async (request, response) => {
    let user = request.body;
    console.log(user);
    let userfromdb = await getuserbyemail(user.username)
    console.log(userfromdb)

    if(!userfromdb){
        response.status(400).send({message:"Invalid credentials"})
        return
    }

    const isPasswordmatch = await bcrypt.compare(user.password,userfromdb.password)
    console.log(isPasswordmatch);

    if(isPasswordmatch){
        const token = jwt.sign({id:userfromdb._id},process.env.SECRET_KEY);
        //console.log(token)
        response.send({message:"successful login",token:token})
    }else{
        response.status(400).send({message:"Invalid credentials"})
    }
});

router.post("/forgot-password",async (request,response)=>{
    let user = request.body;
    console.log(user);
    let userfromdb = await getuserbyemail(user.username)
    console.log(userfromdb);

    if(userfromdb){
        //checking if already a request has been sent recently and using the same link
        let requestfromdb = await getrequestbyemail(user.username);
        console.log(requestfromdb);

        if(requestfromdb){
            sendResetLink(requestfromdb.email,requestfromdb.token);
        }
        else{
            const token = jwt.sign({id:userfromdb._id},process.env.SECRET_KEY);
        console.log(token);
        const newrequest = {
            token,
            email:user.username
        }
        addRequest(newrequest);
        sendResetLink(user.username,token);
        }
        response.status(200).send({message:"Check your email for further instructions"});
    }else{
        response.status(400).send({message:"No such user. Kindly check again"});
    }
    
})


router.put("/reset",async (request,response)=>{
    //has token,password
    let user = request.body;
    console.log(user);
    let requestfromdb = await getrequestbytoken(user.token)
    console.log(requestfromdb);

  if(requestfromdb){
   let result = updateuser(requestfromdb.email,genPassword(user.password))
   response .send(requestfromdb)  
}  else{
      response.status(404).send({message:"Invalid request"})
  }
})

export const usersRouter = router;