import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {ErpService} from '../../erp.service';
import { Lead } from './lead';

export class LeadDataSource implements DataSource<Lead> {

    private Contacts = new BehaviorSubject<Lead[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private erpservice: ErpService) {

    }

    loadContacts(filter,
                sortcolumn,
                sortdirection,
                pageIndex:number,
                pageSize:number) {

        this.loadingContact.next(true);

        this.erpservice.searchleaddata_isdeleted( filter,
            sortcolumn,sortdirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingContact.next(false))
            )
            .subscribe(data => this.Contacts.next(data));

    }

    connect(collectionViewer: CollectionViewer): Observable<Lead[]> {
        return this.Contacts.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.Contacts.complete();
        this.loadingContact.complete();
    }

}