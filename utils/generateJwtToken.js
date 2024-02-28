const jwt = require("jsonwebtoken");

const generateJwtToken = (id, isAdmin) => {
    return jwt.sign(
        { id, isAdmin }, // Include isAdmin in the token payload
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

module.exports = generateJwtToken;
