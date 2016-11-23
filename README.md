# Blog application // 2 weeks
Project realised during the 12 weeks web development bootcamp with the NYCDA

Task:
Project Specification
Create a blogging application that allows users to do the following:
- register an account
- login
- logout

Once logged in, a user should be able to:
- create a post
- view a list of their own posts
- view a list of everyone's posts
- view a specific post, including the comments people have made about it
- leave a comment on a post

___PART 1___

Other requirements:
Your routes must be "RESTful". See slide 4 of the http requests lecture: Link. Also look at the RESTful routing example in the node sample apps.
You must use Sequelize for this assignment. Your connection string must once again be read from the environment variables you set up for the Bulletin Board assignment.
Commit well - each commit should ideally be a new piece of functionality.

___PART2___

Add encryption to your blog application so that your user's passwords are stored safely. Do this in a new branch called "encryption", then merge this back into your main branch.

Aside: Remember to use the input of type "password" so that the form field will appear as "*****" - otherwise, people looking over the shoulders of your users' screens will be able to steal their passwords.

___PART3___
For your blog application, add validation such that the user registration and login routes behave like modern web applications. Make sure to put the validation on both the client and the server. 

Requirements:  

- the username field cannot be empty and must be unique  
- the password field cannot be empty and must contain at least 8 characters
- for registration, the 'confirm password' and 'password' fields must match each other
