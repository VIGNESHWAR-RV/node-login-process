import { app, client } from "./index.js";
import bcrypt from "bcrypt";
import passwordValidator from 'password-validator';
import emailvalidator from "email-validator";


export async function getAllUsers(){
    return await client.db("practise").collection("users").find({}).toArray();
}

export async function genPassword(password){
    const salt =await bcrypt.genSalt(10);
    const hashedpassword =await bcrypt.hash(password,salt)
    console.log(password,salt,hashedpassword);
    return hashedpassword
  }
  
  export function validateemail(email){
    return emailvalidator.validate(email);
 }

 export function validatePassword(password){
       
       // Create a schema
       var schema = new passwordValidator();

       // Add properties to it
       schema
       .is().min(8)                                    // Minimum length 8
       .is().max(50)                                  // Maximum length 100
       .has().uppercase()                              // Must have uppercase letters
       .has().lowercase()                              // Must have lowercase letters
       .has().digits(2)                                // Must have at least 2 digits
       .has().not().spaces()                           // Should not have spaces
       .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

       // Validate against a password string. Returns true or false
       return (schema.validate(password));
 }


 export async function getuserbyemail(email) {
    return await client.db("practise").collection("users").findOne({ "username": email });
}

export async function adduser(newuser) {
    // console.log("newuser",newuser)
    return await client.db("practise").collection("users").insertOne(newuser);
}

export async function updateuser(email,hashedpassword) {
    console.log("updateuser",email,hashedpassword)
    return await client.db("practise").collection("users").updateOne({"username":email},{$set:{"password":hashedpassword}});
}


export async function getAllRequests(){
    return await client.db("practise").collection("requests").find({}).toArray();
}
export async function addRequest(newrequest) {
    console.log("newrequest",newrequest)
    return await client.db("practise").collection("requests").insertOne(newrequest);
}
export async function getrequestbyemail(email) {
    return await client.db("practise").collection("requests").findOne({ "email": email });
}

export async function getrequestbytoken(token) {
    return await client.db("practise").collection("requests").findOne({ "token": token });
}
export async function deleteRequest(token) {
    return await client.db("practise").collection("requests").deleteOne({ "token": token });
}