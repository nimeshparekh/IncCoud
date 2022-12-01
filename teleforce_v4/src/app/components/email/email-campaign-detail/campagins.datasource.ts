import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {EmailService} from '../../../email.service';
import { Campagins } from './campagins';


export class CampaginsDataSource implements DataSource<Campagins> {

    private Contacts = new BehaviorSubject<Campagins[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private contactService: EmailService) {

    }

    loadContacts(filter,sortcolumn,sortdirection,
                pageIndex:number,
                pageSize:number) {

        this.loadingContact.next(true);

        this.contactService.findCalllog( filter,sortcolumn,sortdirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingContact.next(false))
            )
            .subscribe(data => this.Contacts.next(data));

    }

    connect(collectionViewer: CollectionViewer): Observable<Campagins[]> {
        return this.Contacts.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.Contacts.complete();
        this.loadingContact.complete();
    }

}