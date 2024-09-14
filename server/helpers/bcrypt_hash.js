import bcrypt from 'bcrypt';

export const hashText = async (text) => {
    try {
        const saltround = 10;
        const hashedtext = await bcrypt.hash(text, saltround);
        return hashedtext;
    } catch (error) {
        console.log("Error: ", error)
    }
}

export const compareHash = async (text, hashedtext) => {
    return bcrypt.compare(text, hashedtext);
}