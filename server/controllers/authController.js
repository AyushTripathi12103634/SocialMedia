import authModel from "../models/authModel.js";
import { compareHash, hashText } from "../helpers/bcrypt_hash.js";
import JWT from "jsonwebtoken";
import imageUploader from "../helpers/imageUploader.js";
import path from "path";
import fs from "fs";

export const registerController = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;
        const { file } = req;
        const check_username = await authModel.findOne({ username: username });
        if (check_username) {
            return res.status(409).send({
                success: false,
                message: "Username already exists"
            })
        }
        const check_email = await authModel.findOne({ email: email });
        if (check_email) {
            return res.status(409).send({
                success: false,
                message: "Email already exists"
            })
        }
        const hashed_password = await hashText(password);
        const user = await authModel.create({
            username,
            email,
            password: hashed_password,
            name
        });
        try {
            // Construct new file name
            const fileExtension = path.extname(file.originalname);
            const newFileName = `${user._id}${fileExtension}`;
            const newFilePath = path.join(path.dirname(file.path), newFileName);

            // Rename the file
            fs.renameSync(file.path, newFilePath);

            // Call imageUploader with the new file path
            const imageUrl = await imageUploader(newFilePath, "id_docs");

            // Update the user record with the image URL
            user.id = imageUrl;
            await user.save();
        } catch (error) {
            await authModel.deleteOne({ _id: user._id });
            return res.status(500).send({
                success: false,
                message: "Failed to create the user",
                error: error
            })
        }
        return res.status(201).send({
            success: true,
            message: "User registered successfully"
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in register api",
            error: error,
        })
    }
}

export const logincontroller = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        let user;
        if (email) {
            user = await authModel.findOne({ email });
        }
        if (username) {
            user = await authModel.findOne({ username });
        }
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
                body: req.body,
            })
        }
        else {
            const check_password = await compareHash(password, user.password);
            if (!check_password) {
                return res.status(401).send({
                    success: false,
                    message: "Wrong Password",
                })
            }
            else {
                req.session.token = JWT.sign(
                    {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    },
                    process.env.JWT_Secret,
                    {
                        expiresIn: "1d"
                    }
                )
                req.session.user = {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
                return res.status(200).send({
                    success: true,
                    message: "User logged in successfully",
                })
            }
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in login api",
            error: error,
        })
    }
}

export const isloginController = async (req, res) => {
    try {
        const { token } = req.session;
        if (!token) {
            return res.status(200).send({
                success: false,
                message: "User not logged in!!!"
            })
        }
        else {
            const user = JWT.verify(token, process.env.JWT_Secret);
            if (!user) {
                return res.status(200).send({
                    success: false,
                    message: "User not logged in!!!"
                })
            }
            return res.status(200).send({
                success: true,
                message: "User logged in",
                user: user
            })
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in check login api",
            error: error,
        })
    }
}