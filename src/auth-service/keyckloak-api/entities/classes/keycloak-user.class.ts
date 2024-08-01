export class Credentials {
    type: string;
    value: string;
    temporary: boolean;

    constructor(passwordValue: string) {
        this.type = 'password';
        this.value = passwordValue;
        this.temporary = false;
    }
}

export class KeycloakUser {
    username: string;
    enabled: boolean;
    totp: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    credentials: Credentials[];
    notBefore: number;

    constructor(
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        enabled: boolean
    ) {
        this.username = username;
        this.enabled = enabled;
        this.totp = false;
        this.emailVerified = true;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.notBefore = 0;
        this.credentials = new Array<Credentials>();
        const credential = new Credentials(password);
        this.credentials.push({ ...credential });
    }
}