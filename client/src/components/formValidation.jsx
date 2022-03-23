function Validate(props){
    const errors = {}

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!props.email){
        errors.email = 'Email é obrigatório!'
    }else if (!regex.test(props.email)){
        errors.email = 'Email inválido!'
    }
    if (!props.username){
        errors.username = 'Username é obrigatório!'
    }else if (props.username.length < 4){
        errors.username = 'O username deve ter pelo menos 4 caracteres!'
    }else if (props.username.length > 15) {
        errors.username = 'O username não deve ter mais que 15 caracteres!'
    }
    if (!props.password){
        errors.password = 'Senha é obrigatório!'
    }else if (props.password.length < 4){
        errors.password = 'Senha deve ter pelo menos 4 caracteres!'
    }else if (props.password.length > 15){
        errors.password = 'Senha não pode ter mais que 15 caracteres!'
    }else if (props.password !== props.passwordCheck){
        errors.password = 'As senhas são diferentes, tente novamente!'
    }

    return errors;
}

module.exports = Validate;