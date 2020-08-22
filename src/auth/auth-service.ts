import { IRouter, singleton } from 'aurelia';
import { generateRandomString, parseQueryString, pkceChallengeFromVerifier } from './pkce-util';

@singleton
export class AuthService {
    public user = null;
    private token = null;
    issuer = 'login.microsoftonline.com/e02b9a59-6e13-4bde-94af-4df2e9f9f7ea/v2.0';
    metadata = null;

    constructor(@IRouter private router: IRouter) {}

    public async signin(): Promise<void> {
        const config = await this.getConfig();
        var state = generateRandomString();
        localStorage.setItem("pkce_state", state);
        var code_verifier = generateRandomString();
        localStorage.setItem("pkce_code_verifier", code_verifier);
        var code_challenge = await pkceChallengeFromVerifier(code_verifier);
        const { client_id, redirect_uri, scope } = config; 
        const params = new URLSearchParams({ response_type:'code', 
            client_id, 
            state,
            scope, 
            redirect_uri, 
            code_challenge, 
            code_challenge_method: 'S256' })
        const url = `${config.authorization_endpoint}?${params}`;
        window.location.assign(url);
    }

    public async processAuthResponse(){

        var q = parseQueryString(window.location.search.substring(1));
        if(q.error) {
            alert(q.error_description)
        }
        if(q.code){
            const config = await this.getConfig();
            if(localStorage.getItem("pkce_state") != q.state) {
                alert("Invalid state");
            } else {
            
                this.token = await fetch(config.token_endpoint, {
                    method: 'POST',
                    body: new URLSearchParams({
                        grant_type: "authorization_code",
                        code: q.code,
                        client_id: config.client_id,
                        redirect_uri: config.redirect_uri,
                        code_verifier: localStorage.getItem("pkce_code_verifier")
                    })
                })
                .then(r => r.json())
                .catch(error=>{
                    alert(error)
                });
                
                this.user = await this.getCurrentUser();
                window.history.replaceState({}, null, "/");
            }
        }
        localStorage.removeItem("pkce_state");
        localStorage.removeItem("pkce_code_verifier");
    }

    async isAuthenticated(){
        if(this.token == null)
            return false;
            
        return true;
    }

    async getConfig(){
        if(this.metadata == null)
            this.metadata = await (await fetch(`https://${this.issuer}/.well-known/openid-configuration`)).json();
        return {
            client_id: "f9741b7c-6e6f-479c-a49c-7bd7cbc6ddc5",
            redirect_uri: "http://localhost:9000/",
            authorization_endpoint: this.metadata.authorization_endpoint,
            token_endpoint: this.metadata.token_endpoint,
            userinfo_endpoint: this.metadata.userinfo_endpoint,
            scope: "email openid"
        }
    }

    private async getCurrentUser() {
        const config =  await this.getConfig();
        return fetch(config.userinfo_endpoint, {
            headers: {
                'Authorization': 'bearer '+ this.token.access_token
            }
        }).then(c=>c.json());
    }
}