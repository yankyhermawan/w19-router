export class UserException {
	userNotExist() {
		return "User Not Found";
	}
	userRegistered() {
		return "User Already Registered";
	}
	invalidCredential() {
		return "Invalid Credential";
	}
}
