import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {CrudService} from '../../crud.service';
import { Contact } from './manage';

export class ContactDataSource implements DataSource<Contact> {

    private Contacts = new BehaviorSubject<Contact[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private contactService: CrudService) {

    }

    loadContacts(filter,
                pageIndex:number,
                pageSize:number) {

        this.loadingContact.next(true);

        this.contactService.findmaster( filter,
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

export class CountContactDataSource implements DataSource<Contact> {

    private Contacts = new BehaviorSubject<Contact[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private contactService: CrudService) {

    }

    loadContacts(filter,
                pageIndex:number,
                pageSize:number) {

        this.loadingContact.next(true);

        this.contactService.findmastersegment( filter,
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

export class PinCountContactDataSource implements DataSource<Contact> {

    private Contacts = new BehaviorSubject<Contact[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private contactService: CrudService) {

    }

    loadContacts(filter,
                pageIndex:number,
                pageSize:number) {

        this.loadingContact.next(true);

        this.contactService.findmasterpincode( filter,
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