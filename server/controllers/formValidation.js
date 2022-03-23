module.exports = class formValidation {
  constructor(email, username, password, passwordCheck) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.passwordCheck = passwordCheck;
  }

  validation(){
    let errors = {}

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!this.email){
        errors.email = 'Email é obrigatório!';
    }else if (!regex.test(this.email)){
      errors.email = 'Email inválido!';
    }
    if (!this.username){
        errors.username = 'Username é obrigatório!';
    }
    if(!this.password){
        errors.password = 'Senha é obrigatório!';
    }
    if(this.password.length < 4){
        errors.password = 'Senha deve ter pelo menos 4 caracteres!';
    }
    if(this.password.length > 15){
        errors.password = 'Senha não pode ter mais que 15 caracteres!';
      }
    if(this.password != this.passwordCheck){
        errors.password = 'As senhas são diferentes, tente novamente!';
    }
    return errors;    
  }  
};