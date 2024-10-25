import { makeAutoObservable } from 'mobx';
class Store {
    balance = 0;
    data;
    liked


    constructor() {
        makeAutoObservable(this);
    }

    setData(data) {
        this.data = data;
    }

    setLiked(like) {
        this.liked = like;
    }

    setBalance(balance) {
        this.balance = balance;
    }

    getBalance() {
        return this.balance
    }
}
export default new Store();