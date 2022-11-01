const validateName = name => {
    if (name.length < 2)
        return "Name must be 2 or more characters long";
    else if (name.length > 30)
        return "Name must be less than 30 characters long";
    else
        return true;
}


exports.validateName = validateName;