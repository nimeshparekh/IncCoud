import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, from } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { SmscampaignService } from'../../../smscampaign.service';
import { Log } from './log';

export class LogDataSource implements DataSource<Log> {

    private Contacts = new BehaviorSubject<Log[]>([]);

    private loadingContact = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingContact.asObservable();

    constructor(private contactService: SmscampaignService) {

    }

    loadContacts(filter,sortcolumn,sortdirection,
        pageIndex: number,
        pageSize: number) {            
        this.loadingContact.next(true);
        this.contactService.findSMSLog(filter,sortcolumn,sortdirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingContact.next(false))
                
            )
            .subscribe(data => this.Contacts.next(data)
            );
            console.log("daguihi",this.Contacts);           

    }
    

    connect(collectionViewer: CollectionViewer): Observable<Log[]> {
        console.log(this.Contacts.asObservable());
        
        return this.Contacts.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.Contacts.complete();
        this.loadingContact.complete();
        
    }

}