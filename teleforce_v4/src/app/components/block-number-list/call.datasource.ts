import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {AdminService} from '../../admin.service';
import { Contact } from './contact';

export class ContactDataSource implements DataSource<Contact> {

    private Contacts = new BehaviorSubject<Contact[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private contactService: AdminService) {

    }

    loadContacts(sortcolumn,
                sortdirection,
                pageIndex:number,
                pageSize:number) {

        this.loadingContact.next(true);

        this.contactService.findmobilenumber( 
            sortcolumn,sortdirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingContact.next(false))
            )
            .subscribe(data => this.Contacts.next(data));

    }

    connect(collectionViewer: CollectionViewer): Observable<Contact[]> {
        return this.Contacts.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.Contacts.complete();
        this.loadingContact.complete();
    }

}