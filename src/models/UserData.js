export default  class UserData {
    constructor({email, fullName, uid, favorites = [],token}){
        this.email = email;
        this.fullName = fullName;
        this.uid = uid;
        this.favorites = favorites;
        this.token = token;
    }

    static fromFireBaseUser(user){
        if(!user)return null;
        return new UserData({
            email: user.email,
            fullName: user.fullName,
            uid: user.uid,
            favorites: user.favorites,
        })

    }

    toJson(){
        return {
            fullName: this.fullName,
            uid: this.uid,
            favorites: this.favorites,
            email: this.email,
            createdAt: new Date().toISOString(),
        }
    }
}