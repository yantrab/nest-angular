<img title="Langauge" src="https://badge.langauge.io/yantrab/nest-angular" />

# nest-angular-starter
This is a repo for a starter appliation for a Single Page MEAN Stack application
includes nest js + angular 7 + angular material + client api generator.

### Installation 
```sh
git clone https://github.com/yantrab/nest-angular.git
cd .\nest-angular
npm i
```
### debug server
```sh
npm run debug-server
```
### build client
```sh
npm run build-client
```

### Run both server&client
```sh
npm run dev
```

Hit F5 and select the process

## client api generator
#### server controller:
```typescript
@Controller('rest/auth')
export class AuthController {
    @Post('login')
    async login(@Body() user: LoginRequest, @Req() req): Promise<User> {
        return req.user;
    }
    @Get('getUserAuthenticated')
    async getUserAuthenticated(@Req() req):Promise<{user:User}>{
        return {user:req.user};
    }
}
```
#### run 
```sh
npm run gen-client
```
#### result:
```typescript
@Injectable()
export class AuthController {
    async login(user: LoginRequest): Promise<User> {
        return new Promise((resolve) => this.api.post('rest/auth/login',user).subscribe((data:any) => resolve(plainToClass(User,<User>data))))
    }
    async getUserAuthenticated(): Promise<{ user: User }> {
        return new Promise((resolve) => this.api.get('rest/auth/getUserAuthenticated').subscribe((data:any) => resolve(data)))
    }
    constructor(private readonly api: APIService) {}
}
```
## Cordova
```
cd client
npm run cordova:init
npm run build:prod:cordova
npm run cordova:run:browser
```

## class-transformer
#### User class
```typescript
export class User extends Entity{
    fName: string;
    lName: string;
    roles:Role[];
    get fullName() { return this.fName + ' ' + this.lName }
}
```
#### By using [class-tranformer](https://github.com/typestack/class-transformer) (auto generate), you can do:
```typescript
this.authService.login(this.form.value).then(user => {
    console.log(user.fullName)
})
```
## Shared validation using [class-validator](https://github.com/typestack/class-validator)
#### decorate the class with validations:
```typescript
export class LoginRequest {
    @IsEmail()
    email: string

    @Length(6,10)
    password: string
}
})
```

#### server validation
just use [validation pipe](https://docs.nestjs.com/techniques/validation)
#### client validation
```typescript
  constructor(private dynaFB: DynaFormBuilder) {
    this.dynaFB.buildFormFromClass(LoginRequest).then(form => this.form = form);
  }
```

## polymorphism
By inheritance from Poly class  you can do the next thing:

```typescript
 // Class decleration
 export abstract class Filter extends Poly {}
 export class CheckboxFilter extends Filter{}
 export class DropdownFilter extends Filter{}
 
 @Component({
  selector: 'app1-root',
  template: `
  <div fxLayout='column' fxFlex='200px'>
    <p-filter [filter]="filter1"></p-filter>
    <p-filter [filter]="filter2"></p-filter>
  <div>
  `,
  styles: []
})
export class App1Component {
  filter1: Filter;
  filter2: Filter;
  constructor() {
    this.filter1 =
      new CheckboxFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
    this.filter2 =
      new DropdownFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
  }
}
```


## Future
-- Client generator with full types.

-- Auto transform result to real object

-- Share models between server & client


recomended vscode extensions
1. Angular Language Service
2. angular2-inline
3. SCSS Formatter
4. TSLint

