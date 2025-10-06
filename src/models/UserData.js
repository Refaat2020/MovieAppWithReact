export default  class UserData {
    constructor({userEmail, fullName, uid, favorites = []}){
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.uid = uid;
        this.favorites = favorites;
    }

    static fromFireBaseUser(user){
        if(!user)return null;
        return new UserData({
            userEmail: user.email,
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
            email: this.userEmail,
            createdAt: new Date().toISOString(),
        }
    }
}