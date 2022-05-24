export class Registration {
  constructor(public login: string, public email: string, public password: string, public langKey: string) {}
}

export class RegistrationCompany {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public langKey: string,
    public nome: string,
    public regiao: string,
    public nicho: string,
    public site: string
  ) {}
}

export class RegistrationInfluencer {
  constructor(
    public login: string,
    public email: string,
    public password: string,
    public langKey: string,
    public nome: string,
    public regiao: string,
    public bio: string,
    public redes: string
  ) {}
}
