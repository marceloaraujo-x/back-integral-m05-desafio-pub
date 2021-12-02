const bcrypt = require("bcrypt");
const utilities = require("../validations/utilities");
const schemaSignUpValidation = require("../schemas/schemaSignUpValidation");
const schemaEmailSignUpValidation = require("../schemas/schemaEmailSignUpValidation");

async function signUp(req, res) {
  const { nome, email, senha } = req.body;

  try {
    await schemaSignUpValidation.validate(req.body);
    await utilities.emailIsValid(email, "usuarios");

    const encryptedPassword = await bcrypt.hash(senha, 10);

    const user = await utilities.signUpNewUser(nome, email, encryptedPassword);
    const { senha: _, ...sendUser } = user[0];

    return res.status(200).json(sendUser);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

async function preload(req, res) {
  const { email } = req.body;

  try {
    await schemaEmailSignUpValidation.validate(req.body);
    await utilities.emailIsValid(email, "usuarios");
    return res.status(200).json("Ok");
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  signUp,
  preload,
};
