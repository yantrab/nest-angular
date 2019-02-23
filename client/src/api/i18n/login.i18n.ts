export interface I18nRootObject {
    loginPage: I18nLoginPage;
    validation: I18nValidation;
}
export interface I18nLoginPage {
    login: string;
    email: string;
    password: string;
}
export interface I18nValidation {
    required: string;
}
