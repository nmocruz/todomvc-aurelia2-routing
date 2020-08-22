import { IRouter, IViewModel, ViewportInstruction } from 'aurelia';
import { AuthService } from './auth/auth-service';

export class MainView implements IViewModel {

    constructor(@IRouter private router: IRouter, private auth: AuthService) {
   
    }

    async beforeBind(){
        await this.auth.processAuthResponse();
    }

    afterBind() {
        this.router.addHook(async (instructions: ViewportInstruction[]) => {
            if (await this.auth.isAuthenticated()) {
                return true;
            }
            await this.auth.signin()
            return false;
        });
    }
}