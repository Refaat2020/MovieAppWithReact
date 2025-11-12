export default  class UserData {
    constructor({email, fullName, uid, favorites = [],watchlist = [], watched = [],token}){
        this.email = email;
        this.fullName = fullName;
        this.uid = uid;
        this.favorites = favorites;
        this.token = token;
        this.watchlist = watchlist;
        this.watched = watched;
    }

    static fromFireBaseUser(user){
        if(!user)return null;
        return new UserData({
            email: user.email,
            fullName: user.fullName,
            uid: user.uid,
            favorites: user.favorites,
            watched: user.watched,
            watchlist: user.watchlist,
        })

    }

    toJson(){
        return {
            fullName: this.fullName,
            uid: this.uid,
            favorites: this.favorites,
            watched: this.watched,
            watchlist: this.watchlist,
            email: this.email,
            createdAt: new Date().toISOString(),
        }
    }
}