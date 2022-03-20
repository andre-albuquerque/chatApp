function loginValidate(props){
    const errors = {}

    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!props.email){
        errors.email = 'Email é obrigatório!'
    }else if (!regex.test(props.email)){
        errors.email = 'Email inválido!'
    }

    if (!props.password){
        errors.password = 'Senha é obrigatório!'
    }
    return errors;
}

module.exports = loginValidate;