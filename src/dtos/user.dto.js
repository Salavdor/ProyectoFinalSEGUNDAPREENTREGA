export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age
        this.password = user.password
        this.role = user.role ? user.role : "user"
        this.phone = user.phone ? user.phone.split("-").join('') : ''
    }
}