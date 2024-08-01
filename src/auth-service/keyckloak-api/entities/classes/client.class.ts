export class Client {
    clientId: string;
    secret: string;
    constructor(secret: string, clientId: string) {
        this.clientId = clientId;
        this.secret = secret;
    }
}