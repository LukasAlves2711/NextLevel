import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { HttpResponse } from '@angular/common/http';
import { IInfluenciador } from 'app/entities/influenciador/influenciador.model';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IEmpresa } from 'app/entities/empresa/empresa.model';
import { EmpresaService } from 'app/entities/empresa/service/empresa.service';
import { InfluenciadorService } from 'app/entities/influenciador/service/influenciador.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  empresas?: IEmpresa[];
  influenciadors?: IInfluenciador[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    private accountService: AccountService,
    protected empresaService: EmpresaService,
    protected influenciadorService: InfluenciadorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    // eslint-disable-next-line no-console
    this.accountService.getAuthenticationState().subscribe(console.log);
    this.loadEmpresa();
    this.loadInfluenciador();
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  loadEmpresa(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.empresaService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        // sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IEmpresa[]>) => {
          this.isLoading = false;
          this.empresas = res.body ?? [];
        },
        () => {
          this.isLoading = false;
          // this.onError();
        }
      );
  }

  loadInfluenciador(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.influenciadorService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        // sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IInfluenciador[]>) => {
          this.isLoading = false;
          this.influenciadors = res.body ?? [];
        },
        () => {
          this.isLoading = false;
          // this.onError();
        }
      );
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
}
