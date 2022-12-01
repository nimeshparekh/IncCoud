import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, from } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { SmscampaignService } from'../../../smscampaign.service';
import { Campagins } from './campagins';

export class CampaginsDataSource implements DataSource<Campagins> {

    private Contacts = new BehaviorSubject<Campagins[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private contactService: SmscampaignService) {

    }

    loadContacts(filter,sortcolumn,sortdirection,
        pageIndex: number,
        pageSize: number) {            
        this.loadingContact.next(true);
        this.contactService.findContacts(filter,sortcolumn,sortdirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingContact.next(false))
                
            )
            .subscribe(data => this.Contacts.next(data)
            );
            console.log("daguihi",this.Contacts);           

    }
    

    connect(collectionViewer: CollectionViewer): Observable<Campagins[]> {
        console.log(this.Contacts.asObservable());
        
        return this.Contacts.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.Contacts.complete();
        this.loadingContact.complete();
        
    }

}